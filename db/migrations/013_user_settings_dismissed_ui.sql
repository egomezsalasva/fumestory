-- One-way dismissed UI state (header hints, tours, etc.) on user_settings.
-- Separate from feature toggles in settings; keys are added on dismiss and not removed.
-- Example shape: { "header_hints": { "hint-cas-number-v1": true } }.
-- Prerequisites: public.user_settings exists; column dismissed_ui must not already exist.
-- App: GET/PATCH /api/user-settings will read/write dismissed_ui alongside settings.
-- Apply once. Re-running will error if the column already exists.

-- ---------------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_settings
	ADD COLUMN dismissed_ui jsonb NOT NULL DEFAULT '{}'::jsonb;