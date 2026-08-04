-- RLS on notes: curated visible to all; other only for owning user.
-- Prerequisites: 019–021 applied (kind, owner_id, color, rempoint).
-- App must set_config('app.current_user_id', ..., true) in the same transaction
-- for own-other reads/writes (see /api/notes, /api/raw-materials, /api/feedback,
-- /api/agent/resolve-notes).
-- Apply once. Re-running will error if policies already exist.

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY notes_select_curated_or_own ON public.notes
	FOR SELECT
	TO neondb_owner
	USING (
		kind = 'curated'
		OR (
			kind = 'other'
			AND owner_id = (current_setting('app.current_user_id', true))::uuid
		)
	);

CREATE POLICY notes_insert_own_other ON public.notes
	FOR INSERT
	TO neondb_owner
	WITH CHECK (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	);

CREATE POLICY notes_update_own_other ON public.notes
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

CREATE POLICY notes_delete_own_other ON public.notes
	FOR DELETE
	TO neondb_owner
	USING (
		kind = 'other'
		AND owner_id = (current_setting('app.current_user_id', true))::uuid
	);

ALTER TABLE public.notes FORCE ROW LEVEL SECURITY;