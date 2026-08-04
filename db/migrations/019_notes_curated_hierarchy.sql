-- Olfactory notes: curated vs other, color as CSS (hex or gradient).
-- Prerequisites: public.notes exists; columns must not already exist.
-- Next: seed from NOTE_DOT_STYLES; rempoint inventory; partial uniques; RLS.
-- Apply once. Re-running will error if columns/constraints already exist.

-- ---------------------------------------------------------------------------
-- notes
-- ---------------------------------------------------------------------------
ALTER TABLE public.notes
	ADD COLUMN kind text NOT NULL DEFAULT 'other',
	ADD COLUMN owner_id uuid NULL,
	ADD COLUMN color text NULL;

ALTER TABLE public.notes
	ADD CONSTRAINT notes_kind_check
	CHECK (kind IN ('curated', 'other'));

-- curated = shared (no owner). other may be null owner briefly during migrate.
ALTER TABLE public.notes
	ADD CONSTRAINT notes_kind_owner_check
	CHECK (
		(kind = 'curated' AND owner_id IS NULL)
		OR (kind = 'other')
	);

-- curated must have a color once seeded (020). Soft for now: allow NULL on all
-- until promote/seed runs. Tightened in 020 to:
--   curated => color IS NOT NULL; other => color optional (hex or gradient).

ALTER TABLE public.notes
	ADD CONSTRAINT notes_owner_id_fkey
	FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id);

CREATE INDEX notes_owner_id_idx ON public.notes (owner_id);
CREATE INDEX notes_kind_idx ON public.notes (kind);