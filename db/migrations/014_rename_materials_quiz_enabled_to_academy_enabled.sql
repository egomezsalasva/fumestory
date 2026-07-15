-- Rename user_settings.settings key materials_quiz_enabled → academy_enabled.
-- Preserves an explicit false; default remains on when neither key is present.
-- Prerequisites: public.user_settings exists; settings is jsonb.
-- App: user-settings types/API and project settings UI use academy_enabled only.
-- Apply once. Re-running is a no-op when materials_quiz_enabled is already gone.

-- ---------------------------------------------------------------------------
-- user_settings.settings
-- ---------------------------------------------------------------------------
UPDATE public.user_settings
SET settings =
	(settings - 'materials_quiz_enabled')
	|| jsonb_build_object(
		'academy_enabled',
		COALESCE(
			settings->'academy_enabled',
			settings->'materials_quiz_enabled',
			'true'::jsonb
		)
	)
WHERE settings ? 'materials_quiz_enabled';