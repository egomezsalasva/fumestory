-- Compositions hold display name + type; formulas are mods (iterations) with ingredient lines.
-- Applies after 001_rls_tenant_tables.sql (policies on formulas/formula_dilutions are replaced below).

-- ---------------------------------------------------------------------------
-- compositions
-- ---------------------------------------------------------------------------
-- id: SERIAL (Postgres creates compositions_id_seq automatically).
CREATE TABLE public.compositions (
	id SERIAL PRIMARY KEY,
	owner_id uuid NOT NULL,
	name text NOT NULL,
	type text NOT NULL,
	created_at timestamp with time zone DEFAULT now(),
	CONSTRAINT compositions_type_check CHECK ((type = ANY (ARRAY['trial'::text, 'accord'::text, 'perfume'::text]))),
	CONSTRAINT compositions_owner_fkey FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id)
);

CREATE UNIQUE INDEX compositions_owner_name_uidx ON public.compositions USING btree (owner_id, name);

-- ---------------------------------------------------------------------------
-- Backfill: one composition per existing formula row, then link formulas
-- ---------------------------------------------------------------------------
INSERT INTO public.compositions (owner_id, name, type, created_at)
SELECT owner_id, name, type, created_at
FROM public.formulas;

ALTER TABLE public.formulas
	ADD COLUMN composition_id integer,
	ADD COLUMN mods text;

UPDATE public.formulas f
SET composition_id = c.id
FROM public.compositions c
WHERE c.owner_id = f.owner_id
	AND c.name = f.name;

UPDATE public.formulas
SET mods = '1'
WHERE mods IS NULL;

ALTER TABLE public.formulas
	ALTER COLUMN composition_id SET NOT NULL,
	ALTER COLUMN mods SET NOT NULL;

ALTER TABLE public.formulas
	ADD CONSTRAINT formulas_composition_id_fkey FOREIGN KEY (composition_id) REFERENCES public.compositions(id) ON DELETE CASCADE;

-- Old policies from 001 reference formulas.owner_id; drop them before removing that column.
DROP POLICY IF EXISTS formulas_select_own ON public.formulas;
DROP POLICY IF EXISTS formulas_insert_own ON public.formulas;
DROP POLICY IF EXISTS formulas_update_own ON public.formulas;
DROP POLICY IF EXISTS formulas_delete_own ON public.formulas;

DROP POLICY IF EXISTS formula_dilutions_select_own ON public.formula_dilutions;
DROP POLICY IF EXISTS formula_dilutions_insert_own ON public.formula_dilutions;
DROP POLICY IF EXISTS formula_dilutions_update_own ON public.formula_dilutions;
DROP POLICY IF EXISTS formula_dilutions_delete_own ON public.formula_dilutions;

DROP INDEX public.formulas_owner_name_uidx;

ALTER TABLE public.formulas DROP CONSTRAINT formulas_owner_fkey;

ALTER TABLE public.formulas
	DROP COLUMN owner_id,
	DROP COLUMN name,
	DROP COLUMN type;

CREATE UNIQUE INDEX formulas_composition_mods_uidx ON public.formulas USING btree (composition_id, mods);

-- ---------------------------------------------------------------------------
-- RLS: compositions (new), formulas + formula_dilutions (updated)
-- ---------------------------------------------------------------------------
ALTER TABLE public.compositions ENABLE ROW LEVEL SECURITY;

CREATE POLICY compositions_select_own ON public.compositions
	FOR SELECT
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY compositions_insert_own ON public.compositions
	FOR INSERT
	TO neondb_owner
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY compositions_update_own ON public.compositions
	FOR UPDATE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid)
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY compositions_delete_own ON public.compositions
	FOR DELETE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY formulas_select_own ON public.formulas
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.compositions c
			WHERE c.id = formulas.composition_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formulas_insert_own ON public.formulas
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.compositions c
			WHERE c.id = formulas.composition_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formulas_update_own ON public.formulas
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.compositions c
			WHERE c.id = formulas.composition_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.compositions c
			WHERE c.id = formulas.composition_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formulas_delete_own ON public.formulas
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.compositions c
			WHERE c.id = formulas.composition_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_select_own ON public.formula_dilutions
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			JOIN public.compositions c ON c.id = f.composition_id
			WHERE f.id = formula_dilutions.formula_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_insert_own ON public.formula_dilutions
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			JOIN public.compositions c ON c.id = f.composition_id
			WHERE f.id = formula_dilutions.formula_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_update_own ON public.formula_dilutions
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			JOIN public.compositions c ON c.id = f.composition_id
			WHERE f.id = formula_dilutions.formula_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			JOIN public.compositions c ON c.id = f.composition_id
			WHERE f.id = formula_dilutions.formula_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_delete_own ON public.formula_dilutions
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			JOIN public.compositions c ON c.id = f.composition_id
			WHERE f.id = formula_dilutions.formula_id
				AND c.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE ONLY public.compositions FORCE ROW LEVEL SECURITY;