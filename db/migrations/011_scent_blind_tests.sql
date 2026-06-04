-- Scent blind test attempts: per-dilution pass/fail rows grouped by batch_id per run.
-- Prerequisites: neon_auth."user"(id), public.dilutions, 001_rls_tenant_tables.sql (dilutions RLS).
-- App: set_config('app.current_user_id', ...) in the same transaction as queries; /api/scent-blind-tests after API + UI.
-- batch_id groups rows from one Save (URL, delete run); later migratable to scent_blind_tests + test_id FK.
-- Apply once. Re-running will error unless objects/policies are dropped first.

-- ---------------------------------------------------------------------------
-- scent_blind_test_results
-- ---------------------------------------------------------------------------
CREATE TABLE public.scent_blind_test_results (
	id bigserial PRIMARY KEY,
	owner_id uuid NOT NULL,
	batch_id uuid NOT NULL,
	dilution_id integer NOT NULL,
	matched boolean NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	CONSTRAINT scent_blind_test_results_owner_fkey
		FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id),
	CONSTRAINT scent_blind_test_results_dilution_id_fkey
		FOREIGN KEY (dilution_id) REFERENCES public.dilutions(id) ON DELETE CASCADE,
	CONSTRAINT scent_blind_test_results_batch_dilution_uidx
		UNIQUE (batch_id, dilution_id)
);

CREATE INDEX scent_blind_test_results_owner_batch_idx
	ON public.scent_blind_test_results USING btree (owner_id, batch_id);

CREATE INDEX scent_blind_test_results_owner_dilution_idx
	ON public.scent_blind_test_results USING btree (owner_id, dilution_id);

CREATE INDEX scent_blind_test_results_batch_id_idx
	ON public.scent_blind_test_results USING btree (batch_id);

-- ---------------------------------------------------------------------------
-- RLS: scent_blind_test_results (owner + dilution ownership on insert)
-- ---------------------------------------------------------------------------
ALTER TABLE public.scent_blind_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY scent_blind_test_results_select_own ON public.scent_blind_test_results
	FOR SELECT
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY scent_blind_test_results_insert_own ON public.scent_blind_test_results
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		owner_id = (current_setting('app.current_user_id', true))::uuid
		AND EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = scent_blind_test_results.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY scent_blind_test_results_delete_own ON public.scent_blind_test_results
	FOR DELETE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE ONLY public.scent_blind_test_results FORCE ROW LEVEL SECURITY;