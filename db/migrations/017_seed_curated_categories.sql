-- Seed curated olfactory families, promote legacy matches/subs, rempoint other owners,
-- merge spicy → spices, replace global name unique with curated/other partial uniques,
-- tighten kind/owner check.
-- Prerequisites: 016_categories_curated_hierarchy applied (kind, parent_id, owner_id).
-- Apply once on DBs that have not already been seeded manually.
-- Data steps are mostly idempotent; DROP/ADD constraint and CREATE UNIQUE INDEX will error if already done.

-- ---------------------------------------------------------------------------
-- Promote legacy families that match curated names
-- ---------------------------------------------------------------------------
UPDATE public.categories
SET kind = 'curated', owner_id = NULL
WHERE kind = 'other'
  AND parent_id IS NULL
  AND name IN (
    'animalic', 'musk', 'leather', 'smoky', 'woody', 'earthy', 'amber',
    'resinous / balsamic', 'spices', 'floral', 'green', 'herbal', 'citrus',
    'fruity', 'aldehydic', 'marine / ozonic', 'gourmand', 'sulfurous'
  );

-- ---------------------------------------------------------------------------
-- Insert any curated families still missing
-- ---------------------------------------------------------------------------
INSERT INTO public.categories (name, kind, parent_id, owner_id)
SELECT v.name, 'curated', NULL, NULL
FROM (VALUES
  ('animalic'),
  ('musk'),
  ('leather'),
  ('smoky'),
  ('woody'),
  ('earthy'),
  ('amber'),
  ('resinous / balsamic'),
  ('spices'),
  ('floral'),
  ('green'),
  ('herbal'),
  ('citrus'),
  ('fruity'),
  ('aldehydic'),
  ('marine / ozonic'),
  ('gourmand'),
  ('sulfurous')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories c
  WHERE c.name = v.name AND c.kind = 'curated'
);

-- ---------------------------------------------------------------------------
-- Promote balsamic → curated sub under resinous / balsamic
-- ---------------------------------------------------------------------------
UPDATE public.categories
SET
  kind = 'curated',
  owner_id = NULL,
  parent_id = (
    SELECT id FROM public.categories
    WHERE name = 'resinous / balsamic'
      AND kind = 'curated'
      AND parent_id IS NULL
  )
WHERE name = 'balsamic'
  AND kind = 'other'
  AND parent_id IS NULL;

-- ---------------------------------------------------------------------------
-- Promote resin → curated sub "resinous" under resinous / balsamic
-- ---------------------------------------------------------------------------
UPDATE public.categories
SET
  name = 'resinous',
  kind = 'curated',
  owner_id = NULL,
  parent_id = (
    SELECT id FROM public.categories
    WHERE name = 'resinous / balsamic'
      AND kind = 'curated'
      AND parent_id IS NULL
  )
WHERE name = 'resin'
  AND kind = 'other'
  AND parent_id IS NULL;

-- ---------------------------------------------------------------------------
-- Merge spicy (other) into curated spices family
-- ---------------------------------------------------------------------------
UPDATE public.raw_materials
SET category_id = (
  SELECT id FROM public.categories
  WHERE name = 'spices' AND kind = 'curated' AND parent_id IS NULL
)
WHERE category_id IN (
  SELECT id FROM public.categories
  WHERE name = 'spicy' AND kind = 'other'
);

DELETE FROM public.categories
WHERE name = 'spicy' AND kind = 'other';

-- ---------------------------------------------------------------------------
-- Assign owner_id on remaining other (single-owner categories only)
-- ---------------------------------------------------------------------------
UPDATE public.categories c
SET owner_id = sub.owner_id
FROM (
  SELECT c2.id AS category_id, MIN(rm.owner_id::text)::uuid AS owner_id
  FROM public.categories c2
  JOIN public.raw_materials rm ON rm.category_id = c2.id
  WHERE c2.kind = 'other'
    AND c2.owner_id IS NULL
  GROUP BY c2.id
  HAVING COUNT(DISTINCT rm.owner_id) = 1
) sub
WHERE c.id = sub.category_id;

-- ---------------------------------------------------------------------------
-- Uniqueness: drop global name unique; curated vs other partial uniques
-- ---------------------------------------------------------------------------
ALTER TABLE public.categories
  DROP CONSTRAINT categores_name_key;

CREATE UNIQUE INDEX categories_curated_name_uidx
  ON public.categories (name)
  WHERE kind = 'curated';

CREATE UNIQUE INDEX categories_other_owner_name_uidx
  ON public.categories (owner_id, name)
  WHERE kind = 'other';

-- ---------------------------------------------------------------------------
-- Require owner on other; curated stays owner-less
-- ---------------------------------------------------------------------------
ALTER TABLE public.categories
  DROP CONSTRAINT categories_kind_owner_check;

ALTER TABLE public.categories
  ADD CONSTRAINT categories_kind_owner_check
  CHECK (
    (kind = 'curated' AND owner_id IS NULL)
    OR (kind = 'other' AND owner_id IS NOT NULL)
  );