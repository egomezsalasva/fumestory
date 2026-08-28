-- Fumestory offline — curated category families only.
-- Curated notes live in NOTE_DOT_STYLES (app bundle); materials in data.ts.
-- Safe to re-run: INSERT OR IGNORE skips names that already exist.
PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Curated families
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO categories (name, kind, parent_id) VALUES
  ('animalic', 'curated', NULL),
  ('musk', 'curated', NULL),
  ('leather', 'curated', NULL),
  ('smoky', 'curated', NULL),
  ('woody', 'curated', NULL),
  ('earthy', 'curated', NULL),
  ('amber', 'curated', NULL),
  ('resinous / balsamic', 'curated', NULL),
  ('spices', 'curated', NULL),
  ('floral', 'curated', NULL),
  ('green', 'curated', NULL),
  ('herbal', 'curated', NULL),
  ('citrus', 'curated', NULL),
  ('fruity', 'curated', NULL),
  ('aldehydic', 'curated', NULL),
  ('marine / ozonic', 'curated', NULL),
  ('gourmand', 'curated', NULL),
  ('sulfurous', 'curated', NULL);

-- ---------------------------------------------------------------------------
-- Curated subs under resinous / balsamic
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO categories (name, kind, parent_id)
SELECT 'balsamic', 'curated', id
FROM categories
WHERE name = 'resinous / balsamic';

INSERT OR IGNORE INTO categories (name, kind, parent_id)
SELECT 'resinous', 'curated', id
FROM categories
WHERE name = 'resinous / balsamic';