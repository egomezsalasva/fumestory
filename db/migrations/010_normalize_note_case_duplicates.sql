-- Merge notes that differ only by case (e.g. Woody + woody), then enforce lowercase names.
-- Keeps the row whose name is already lowercase; otherwise the smallest id in the group.
-- Rewires raw_material_notes and feedback_notes to keep_id, deletes duplicate note rows,
-- lowercases any remaining mixed-case note names, then adds CHECK constraints on notes and categories.
-- Prerequisites: public.notes, public.categories, public.raw_material_notes, public.feedback_notes exist.
-- App: POST /api/raw-materials, /api/categories, and /api/feedback already store note/category names as lowercase.
-- Apply once. Re-running the data steps is a no-op when duplicates are already merged.
-- Re-running the CHECK constraints will error if notes_name_lowercase_check or categories_name_lowercase_check already exist.

-- ---------------------------------------------------------------------------
-- notes: merge case duplicates
-- ---------------------------------------------------------------------------
BEGIN;

CREATE TEMP TABLE note_merge ON COMMIT DROP AS
SELECT r.id AS dup_id, k.keep_id
FROM public.notes r
JOIN (
	SELECT
		lower(name) AS lname,
		(array_agg(id ORDER BY (name = lower(name)) DESC, id))[1] AS keep_id
	FROM public.notes
	GROUP BY lower(name)
	HAVING count(*) > 1
) k ON lower(r.name) = k.lname AND r.id <> k.keep_id;

UPDATE public.raw_material_notes rmn
SET note_id = m.keep_id
FROM note_merge m
WHERE rmn.note_id = m.dup_id
	AND NOT EXISTS (
		SELECT 1
		FROM public.raw_material_notes x
		WHERE x.raw_material_id = rmn.raw_material_id
			AND x.note_id = m.keep_id
	);

DELETE FROM public.raw_material_notes rmn
USING note_merge m
WHERE rmn.note_id = m.dup_id;

UPDATE public.feedback_notes fn
SET note_id = m.keep_id
FROM note_merge m
WHERE fn.note_id = m.dup_id
	AND NOT EXISTS (
		SELECT 1
		FROM public.feedback_notes x
		WHERE x.feedback_id = fn.feedback_id
			AND x.note_id = m.keep_id
	);

DELETE FROM public.feedback_notes fn
USING note_merge m
WHERE fn.note_id = m.dup_id;

DELETE FROM public.notes n
USING note_merge m
WHERE n.id = m.dup_id;

UPDATE public.notes
SET name = lower(name)
WHERE name <> lower(name);

COMMIT;

-- ---------------------------------------------------------------------------
-- notes and categories: enforce lowercase storage
-- ---------------------------------------------------------------------------
ALTER TABLE public.notes
	ADD CONSTRAINT notes_name_lowercase_check
	CHECK (name = lower(name));

ALTER TABLE public.categories
	ADD CONSTRAINT categories_name_lowercase_check
	CHECK (name = lower(name));