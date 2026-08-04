-- Rempoint leftover other notes (single-owner via materials/feedback), replace
-- global name unique with curated/other partial uniques, require curated color
-- and other owner.
-- Prerequisites: 019 + 020 (seed) applied.
-- Before the final CHECK: every kind=other row must have owner_id
-- (rempoint below covers used notes; delete or assign unused orphans by hand).
-- Apply once. Re-running will error if constraints/indexes already changed.

-- ---------------------------------------------------------------------------
-- Assign owner_id on remaining other (single-owner via raw materials)
-- ---------------------------------------------------------------------------
UPDATE public.notes n
SET owner_id = sub.owner_id
FROM (
	SELECT n2.id AS note_id, MIN(rm.owner_id::text)::uuid AS owner_id
	FROM public.notes n2
	JOIN public.raw_material_notes rmn ON rmn.note_id = n2.id
	JOIN public.raw_materials rm ON rm.id = rmn.raw_material_id
	WHERE n2.kind = 'other'
		AND n2.owner_id IS NULL
	GROUP BY n2.id
	HAVING COUNT(DISTINCT rm.owner_id) = 1
) sub
WHERE n.id = sub.note_id;

-- ---------------------------------------------------------------------------
-- Assign owner_id on remaining other (single-owner via feedback)
-- ---------------------------------------------------------------------------
UPDATE public.notes n
SET owner_id = sub.owner_id
FROM (
	SELECT n2.id AS note_id, MIN(rm.owner_id::text)::uuid AS owner_id
	FROM public.notes n2
	JOIN public.feedback_notes fn ON fn.note_id = n2.id
	JOIN public.feedback f ON f.id = fn.feedback_id
	JOIN public.dilutions d ON d.id = f.dilution_id
	JOIN public.raw_materials rm ON rm.id = d.raw_material_id
	WHERE n2.kind = 'other'
		AND n2.owner_id IS NULL
	GROUP BY n2.id
	HAVING COUNT(DISTINCT rm.owner_id) = 1
) sub
WHERE n.id = sub.note_id;

-- ---------------------------------------------------------------------------
-- Uniqueness: drop global name unique; curated vs other partial uniques
-- ---------------------------------------------------------------------------
ALTER TABLE public.notes
	DROP CONSTRAINT notes_name_key;

CREATE UNIQUE INDEX notes_curated_name_uidx
	ON public.notes (name)
	WHERE kind = 'curated';

CREATE UNIQUE INDEX notes_other_owner_name_uidx
	ON public.notes (owner_id, name)
	WHERE kind = 'other';

-- ---------------------------------------------------------------------------
-- curated => no owner + color required; other => owner required (color optional)
-- ---------------------------------------------------------------------------
ALTER TABLE public.notes
	DROP CONSTRAINT notes_kind_owner_check;

ALTER TABLE public.notes
	ADD CONSTRAINT notes_kind_owner_check
	CHECK (
		(kind = 'curated' AND owner_id IS NULL AND color IS NOT NULL)
		OR (kind = 'other' AND owner_id IS NOT NULL)
	);