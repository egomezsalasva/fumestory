-- Per-user Academy progress (JSON document; same shape as fumestory.academyProgress.v1).
-- Prerequisites: neon_auth."user"(id) exists; app uses set_config('app.current_user_id', ...) with RLS.
-- FK uses ON DELETE RESTRICT: removing an auth user must explicitly delete this row first.
-- Apply once. Re-running will error unless objects/policies are dropped first.

-- ---------------------------------------------------------------------------
-- academy_progress
-- ---------------------------------------------------------------------------
CREATE TABLE public.academy_progress (
	user_id uuid NOT NULL PRIMARY KEY,
	progress jsonb NOT NULL DEFAULT '{}'::jsonb,
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	CONSTRAINT academy_progress_user_id_fkey
		FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------------
-- RLS: academy_progress (user-owned rows)
-- ---------------------------------------------------------------------------
ALTER TABLE public.academy_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY academy_progress_select_own ON public.academy_progress
	FOR SELECT
	TO neondb_owner
	USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY academy_progress_insert_own ON public.academy_progress
	FOR INSERT
	TO neondb_owner
	WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY academy_progress_update_own ON public.academy_progress
	FOR UPDATE
	TO neondb_owner
	USING (user_id = (current_setting('app.current_user_id', true))::uuid)
	WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE public.academy_progress FORCE ROW LEVEL SECURITY;