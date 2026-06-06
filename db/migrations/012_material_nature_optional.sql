-- Optional material nature on each raw material (Natural or Synthetic).
-- NULL when the user has not enabled the field or left it blank.
-- When set, must be Natural or Synthetic.
-- Prerequisites: public.raw_materials exists; column material_nature must already exist.
-- App: POST /api/raw-materials will accept optional material_nature; add form and
--       user setting material_nature_enabled gate visibility (like cas_number).
-- Apply once. Re-running will error if the constraint was already replaced.

-- ---------------------------------------------------------------------------
-- raw_materials
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_materials
	DROP CONSTRAINT raw_materials_nature_check;

ALTER TABLE public.raw_materials
	ALTER COLUMN material_nature DROP NOT NULL;

ALTER TABLE public.raw_materials
	ADD CONSTRAINT raw_materials_nature_check
	CHECK (material_nature IS NULL OR material_nature = ANY (ARRAY['Natural'::text, 'Synthetic'::text]));