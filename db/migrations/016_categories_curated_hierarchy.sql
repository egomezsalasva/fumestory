-- Olfactory families: curated vs other, optional subcategory via parent_id.
-- Colors stay client + user_settings (no color column).
-- Prerequisites: public.categories exists; columns must not already exist.
-- Next: seed curated tree; rempoint legacy rows to per-user other; then RLS.
-- Apply once. Re-running will error if columns/constraints already exist.
-- Seed / rempoint / uniqueness: see 017_seed_curated_categories.sql

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
ALTER TABLE public.categories
	ADD COLUMN kind text NOT NULL DEFAULT 'other',
	ADD COLUMN parent_id integer NULL,
	ADD COLUMN owner_id uuid NULL;

ALTER TABLE public.categories
	ADD CONSTRAINT categories_kind_check
	CHECK (kind IN ('curated', 'other'));

-- curated = shared catalog (no owner). other may be null briefly during legacy migrate.
ALTER TABLE public.categories
	ADD CONSTRAINT categories_kind_owner_check
	CHECK (
		(kind = 'curated' AND owner_id IS NULL)
		OR (kind = 'other')
	);

ALTER TABLE public.categories
	ADD CONSTRAINT categories_parent_id_fkey
	FOREIGN KEY (parent_id) REFERENCES public.categories(id);

ALTER TABLE public.categories
	ADD CONSTRAINT categories_owner_id_fkey
	FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id);

CREATE INDEX categories_parent_id_idx ON public.categories (parent_id);
CREATE INDEX categories_owner_id_idx ON public.categories (owner_id);
CREATE INDEX categories_kind_idx ON public.categories (kind);