-- RLS for public tenant tables (Neon role: neondb_owner).
-- Prerequisites: schema with owner_id / FKs as used by the app.
-- App must run set_config('app.current_user_id', ..., true) in the same transaction as queries.
--
-- Apply once on a fresh DB that already has tables. Re-running will error unless policies are dropped first.

-- ---------------------------------------------------------------------------
-- raw_materials
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY raw_materials_select_own ON public.raw_materials
	FOR SELECT
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY raw_materials_insert_own ON public.raw_materials
	FOR INSERT
	TO neondb_owner
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY raw_materials_update_own ON public.raw_materials
	FOR UPDATE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid)
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY raw_materials_delete_own ON public.raw_materials
	FOR DELETE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE public.raw_materials FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- formulas
-- ---------------------------------------------------------------------------
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY formulas_select_own ON public.formulas
	FOR SELECT
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY formulas_insert_own ON public.formulas
	FOR INSERT
	TO neondb_owner
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY formulas_update_own ON public.formulas
	FOR UPDATE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid)
	WITH CHECK (owner_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY formulas_delete_own ON public.formulas
	FOR DELETE
	TO neondb_owner
	USING (owner_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE public.formulas FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- dilutions (via raw_materials.owner_id)
-- ---------------------------------------------------------------------------
ALTER TABLE public.dilutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY dilutions_select_own ON public.dilutions
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = dilutions.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY dilutions_insert_own ON public.dilutions
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = dilutions.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY dilutions_update_own ON public.dilutions
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = dilutions.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = dilutions.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY dilutions_delete_own ON public.dilutions
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = dilutions.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE public.dilutions FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- formula_dilutions (via formulas.owner_id)
-- ---------------------------------------------------------------------------
ALTER TABLE public.formula_dilutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY formula_dilutions_select_own ON public.formula_dilutions
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			WHERE f.id = formula_dilutions.formula_id
				AND f.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_insert_own ON public.formula_dilutions
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			WHERE f.id = formula_dilutions.formula_id
				AND f.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_update_own ON public.formula_dilutions
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			WHERE f.id = formula_dilutions.formula_id
				AND f.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			WHERE f.id = formula_dilutions.formula_id
				AND f.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY formula_dilutions_delete_own ON public.formula_dilutions
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.formulas f
			WHERE f.id = formula_dilutions.formula_id
				AND f.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE public.formula_dilutions FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- feedback (via dilution -> raw_materials.owner_id)
-- ---------------------------------------------------------------------------
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_select_own ON public.feedback
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = feedback.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_insert_own ON public.feedback
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = feedback.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_update_own ON public.feedback
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = feedback.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = feedback.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_delete_own ON public.feedback
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.dilutions d
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE d.id = feedback.dilution_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE public.feedback FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- feedback_notes (via feedback -> dilution -> raw_materials.owner_id)
-- ---------------------------------------------------------------------------
ALTER TABLE public.feedback_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_notes_select_own ON public.feedback_notes
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.feedback f
			JOIN public.dilutions d ON d.id = f.dilution_id
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE f.id = feedback_notes.feedback_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_notes_insert_own ON public.feedback_notes
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.feedback f
			JOIN public.dilutions d ON d.id = f.dilution_id
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE f.id = feedback_notes.feedback_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_notes_update_own ON public.feedback_notes
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.feedback f
			JOIN public.dilutions d ON d.id = f.dilution_id
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE f.id = feedback_notes.feedback_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.feedback f
			JOIN public.dilutions d ON d.id = f.dilution_id
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE f.id = feedback_notes.feedback_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY feedback_notes_delete_own ON public.feedback_notes
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.feedback f
			JOIN public.dilutions d ON d.id = f.dilution_id
			JOIN public.raw_materials rm ON rm.id = d.raw_material_id
			WHERE f.id = feedback_notes.feedback_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE public.feedback_notes FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- raw_material_notes (via raw_materials.owner_id)
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_material_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY raw_material_notes_select_own ON public.raw_material_notes
	FOR SELECT
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = raw_material_notes.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY raw_material_notes_insert_own ON public.raw_material_notes
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = raw_material_notes.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY raw_material_notes_update_own ON public.raw_material_notes
	FOR UPDATE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = raw_material_notes.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = raw_material_notes.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY raw_material_notes_delete_own ON public.raw_material_notes
	FOR DELETE
	TO neondb_owner
	USING (
		EXISTS (
			SELECT 1
			FROM public.raw_materials rm
			WHERE rm.id = raw_material_notes.raw_material_id
				AND rm.owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

ALTER TABLE public.raw_material_notes FORCE ROW LEVEL SECURITY;

-- categories / notes: intentionally no RLS (shared reference data for all users).
