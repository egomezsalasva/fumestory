-- Batch size (grams) for each dilution row; optional until the app requires it.
-- When set, must be > 0. NULL allowed for legacy rows and “unknown” until backfilled.
-- Prerequisites: public.dilutions exists; column batch_weight_grams must not already exist.
-- App: will read/write via /api/dilutions (GET/POST) after API changes.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- dilutions
-- ---------------------------------------------------------------------------
ALTER TABLE public.dilutions
	ADD COLUMN batch_weight_grams numeric(10, 5);

ALTER TABLE public.dilutions
	ADD CONSTRAINT dilutions_batch_weight_grams_check
	CHECK (batch_weight_grams IS NULL OR batch_weight_grams > 0);