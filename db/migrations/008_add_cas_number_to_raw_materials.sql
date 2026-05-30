-- Optional CAS Registry Number on each raw material (e.g. 6790-58-5 for Ambroxan).
-- NULL when unknown or not applicable (common for natural blends).
-- When set, must match the usual three-segment form: 2–7 digits, hyphen, 2 digits, hyphen, 1 digit.
-- Prerequisites: public.raw_materials exists; column cas_number must not already exist.
-- App: POST /api/raw-materials will accept optional cas_number; GET will return it after API changes.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- raw_materials
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_materials
	ADD COLUMN cas_number text;

ALTER TABLE public.raw_materials
	ADD CONSTRAINT raw_materials_cas_number_check
	CHECK (cas_number IS NULL OR cas_number ~ '^\d{2,7}-\d{2}-\d$');