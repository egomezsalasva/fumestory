-- Optional guest rating (0–5) on each feedback row; NULL when the guest skips rating.
-- When set, must be an integer from 0 through 5 inclusive.
-- Prerequisites: public.feedback exists; column rating must not already exist.
-- App: will read/write via /api/feedback (GET/POST) after API changes.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- feedback
-- ---------------------------------------------------------------------------
ALTER TABLE public.feedback
	ADD COLUMN rating smallint;

ALTER TABLE public.feedback
	ADD CONSTRAINT feedback_rating_check
	CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));