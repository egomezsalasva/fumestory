-- Optional per-user bottle labels on raw materials and compositions (e.g. LB1, CP3).
-- Raw materials: replace global UNIQUE (label) with UNIQUE (owner_id, label); label nullable.
-- Compositions: add optional label column with UNIQUE (owner_id, label) when set.
-- Cross-table duplicate checks (same owner, same non-null label) are enforced in the app.
-- Label requirement will be toggleable later via user settings.
-- Prerequisites: public.raw_materials and public.compositions exist; compositions.label must not already exist.
-- App: label optional on POST for both; validate format/uniqueness only when label is provided.
-- Apply once. Re-running will error if constraints or column already exist.

-- ---------------------------------------------------------------------------
-- raw_materials
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_materials
	DROP CONSTRAINT raw_materials_label_key;

ALTER TABLE public.raw_materials
	ALTER COLUMN label DROP NOT NULL;

CREATE UNIQUE INDEX raw_materials_owner_label_uidx
	ON public.raw_materials USING btree (owner_id, label);

-- ---------------------------------------------------------------------------
-- compositions
-- ---------------------------------------------------------------------------
ALTER TABLE public.compositions
	ADD COLUMN label character varying(10);

CREATE UNIQUE INDEX compositions_owner_label_uidx
	ON public.compositions USING btree (owner_id, label);