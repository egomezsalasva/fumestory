-- Per-user app preferences (JSON document; add keys without new migrations).
-- Prerequisites: neon_auth."user"(id) exists; app uses set_config('app.current_user_id', ...) with RLS (see 001_rls_tenant_tables.sql).
-- FK uses ON DELETE RESTRICT: removing an auth user must explicitly delete this row first (one row per user).
-- Apply once. Re-running will error unless objects/policies are dropped first.

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
CREATE TABLE public.user_settings (
	user_id uuid NOT NULL PRIMARY KEY,
	settings jsonb NOT NULL DEFAULT '{}'::jsonb,
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------------
-- RLS: user_settings (user-owned rows)
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_settings_select_own ON public.user_settings
	FOR SELECT
	TO neondb_owner
	USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY user_settings_insert_own ON public.user_settings
	FOR INSERT
	TO neondb_owner
	WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY user_settings_update_own ON public.user_settings
	FOR UPDATE
	TO neondb_owner
	USING (user_id = (current_setting('app.current_user_id', true))::uuid)
	WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

ALTER TABLE public.user_settings FORCE ROW LEVEL SECURITY;