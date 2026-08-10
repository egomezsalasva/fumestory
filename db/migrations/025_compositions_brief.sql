-- Optional creative brief for a composition (markdown source).
-- NULL when unset. Plain text / markdown (# ## **bold**) stored as text;
-- UI can render with react-markdown later (toolbar + preview later).
-- Prerequisites: public.compositions exists.
-- Apply once. Re-running will error if the column or constraint already exists.

-- ---------------------------------------------------------------------------
-- compositions.brief
-- ---------------------------------------------------------------------------
ALTER TABLE public.compositions
	ADD COLUMN brief text;

ALTER TABLE public.compositions
	ADD CONSTRAINT compositions_brief_length_check
	CHECK (brief IS NULL OR char_length(brief) <= 8000);