-- material_nature on public.raw_materials (values: Natural, Synthetic).
-- Prerequisites: public.raw_materials exists; column material_nature must not already exist.
-- App: POST /api/raw-materials validates material_nature; inserts always set it.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- raw_materials
-- ---------------------------------------------------------------------------
ALTER TABLE public.raw_materials
	ADD COLUMN material_nature text NOT NULL DEFAULT 'Natural'
	CONSTRAINT raw_materials_material_nature_check
	CHECK (material_nature = ANY (ARRAY['Natural'::text, 'Synthetic'::text]));

-- Backfill used DEFAULT above; new rows should supply material_nature from the app.
ALTER TABLE public.raw_materials
	ALTER COLUMN material_nature DROP DEFAULT;