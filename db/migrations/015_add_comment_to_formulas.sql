-- Freeform trial comment per formula (mod), e.g. what to change on the next mod.
-- NULL when unset. Editable anytime from composition details.
-- Max length 2000 when set.
-- Prerequisites: public.formulas exists; column comment must not already exist.
-- App: composition detail GET/PATCH after API + UI; UI label "Comment";
--       enforce the same max length in the API/UI.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- formulas
-- ---------------------------------------------------------------------------
ALTER TABLE public.formulas
	ADD COLUMN comment text;

ALTER TABLE public.formulas
	ADD CONSTRAINT formulas_comment_length_check
	CHECK (comment IS NULL OR char_length(comment) <= 2000);