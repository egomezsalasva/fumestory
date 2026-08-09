-- Composition lifecycle status for list tabs (active / archived; finished later).
-- Prerequisites: public.compositions exists.
-- Apply once. Re-running will error unless the column/constraint are dropped first.

-- ---------------------------------------------------------------------------
-- compositions.status
-- ---------------------------------------------------------------------------
ALTER TABLE public.compositions
	ADD COLUMN status text NOT NULL DEFAULT 'active';

ALTER TABLE public.compositions
	ADD CONSTRAINT compositions_status_check
	CHECK (status = ANY (ARRAY['active'::text, 'archived'::text]));