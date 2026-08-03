-- RLS on categories: curated visible to all; other only for owning user.
-- Prerequisites: 016/017 applied (kind, parent_id, owner_id).
-- App must set_config('app.current_user_id', ..., true) in the same transaction
-- for own-other reads/writes (see /api/categories, /api/raw-materials, etc.).
-- Apply once. Re-running will error if policies already exist.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select_curated_or_own ON public.categories
	FOR SELECT
	TO neondb_owner
	USING (
		kind = 'curated'
		OR (
			kind = 'other'
			AND owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY categories_insert_own_other ON public.categories
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	);

CREATE POLICY categories_update_own_other ON public.categories
	FOR UPDATE
	TO neondb_owner
	USING (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	)
	WITH CHECK (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	);

CREATE POLICY categories_delete_own_other ON public.categories
	FOR DELETE
	TO neondb_owner
	USING (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	);

ALTER TABLE public.categories FORCE ROW LEVEL SECURITY;