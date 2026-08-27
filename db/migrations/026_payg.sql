-- Pay-as-you-go: offline installs + one-time codes bound to email.
-- Totals = SUM of redeemed codes (no separate entitlements table).
-- Free caps stay in the offline app; local SQLite caches the summed extras after redeem.
-- Prerequisites: none beyond public schema / neondb_owner RLS pattern.
-- Apply once on Neon. Re-running will error if objects already exist.

-- ---------------------------------------------------------------------------
-- offline_installs (install count)
-- ---------------------------------------------------------------------------
CREATE TABLE public.offline_installs (
	install_id uuid PRIMARY KEY,
	email text,
	first_seen_at timestamp with time zone NOT NULL DEFAULT now(),
	CONSTRAINT offline_installs_email_lower_check
		CHECK (email IS NULL OR email = lower(email))
);

CREATE INDEX offline_installs_email_idx
	ON public.offline_installs (email)
	WHERE email IS NOT NULL;

-- ---------------------------------------------------------------------------
-- payg_codes (bound to email at creation; manual OK until Stripe)
-- ---------------------------------------------------------------------------
CREATE TABLE public.payg_codes (
	code text PRIMARY KEY,
	email text NOT NULL,
	extras_materials integer NOT NULL DEFAULT 0,
	extras_dilutions integer NOT NULL DEFAULT 0,
	extras_compositions integer NOT NULL DEFAULT 0,
	extras_mods integer NOT NULL DEFAULT 0,
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	redeemed_at timestamp with time zone,
	CONSTRAINT payg_codes_code_nonempty_check
		CHECK (char_length(trim(code)) >= 6),
	CONSTRAINT payg_codes_email_lower_check
		CHECK (email = lower(email)),
	CONSTRAINT payg_codes_extras_nonneg_check
		CHECK (
			extras_materials >= 0
			AND extras_dilutions >= 0
			AND extras_compositions >= 0
			AND extras_mods >= 0
		),
	CONSTRAINT payg_codes_extras_nonzero_check
		CHECK (
			extras_materials
			+ extras_dilutions
			+ extras_compositions
			+ extras_mods
			> 0
		)
);

CREATE INDEX payg_codes_email_idx ON public.payg_codes (email);

-- ---------------------------------------------------------------------------
-- RLS: server-only via neondb_owner (offline redeem has no neon_auth user)
-- ---------------------------------------------------------------------------
ALTER TABLE public.offline_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payg_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY offline_installs_all ON public.offline_installs
	FOR ALL
	TO neondb_owner
	USING (true)
	WITH CHECK (true);

CREATE POLICY payg_codes_all ON public.payg_codes
	FOR ALL
	TO neondb_owner
	USING (true)
	WITH CHECK (true);

ALTER TABLE public.offline_installs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.payg_codes FORCE ROW LEVEL SECURITY;

-- Example (bound to a real email):
-- INSERT INTO public.payg_codes (code, email, extras_materials)
-- VALUES ('TEST-MAT-50', 'you@example.com', 50);