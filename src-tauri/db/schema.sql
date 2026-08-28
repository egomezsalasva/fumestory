-- Fumestory offline (SQLite) — dashboard only, single profile, no auth.
-- No owner_id / neon_auth / roadmap / paywall.
-- Curated category families seeded separately (seed-curated.sql).
-- Curated notes/materials ship in the app bundle (NOTE_DOT_STYLES, data.ts).
PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL COLLATE NOCASE,
  kind TEXT NOT NULL DEFAULT 'other' CHECK (kind IN ('curated', 'other')),
  parent_id INTEGER REFERENCES categories(id),
  CHECK (name = lower(name))
);

CREATE UNIQUE INDEX categories_name_uidx ON categories(name);

CREATE INDEX categories_parent_id_idx ON categories(parent_id);
CREATE INDEX categories_kind_idx ON categories(kind);

CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL COLLATE NOCASE,
  kind TEXT NOT NULL DEFAULT 'other' CHECK (kind IN ('curated', 'other')),
  color TEXT,
  CHECK (name = lower(name)),
  CHECK (
    (kind = 'curated' AND color IS NOT NULL)
    OR (kind = 'other')
  )
);

CREATE UNIQUE INDEX notes_name_uidx ON notes(name);

CREATE INDEX notes_kind_idx ON notes(kind);

-- ---------------------------------------------------------------------------
-- Inventory
-- ---------------------------------------------------------------------------
CREATE TABLE raw_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  note_type TEXT CHECK (note_type IN ('High', 'Mid(Heart)', 'Base')),
  label TEXT,
  material_nature TEXT CHECK (
    material_nature IS NULL OR material_nature IN ('Natural', 'Synthetic')
  ),
  cas_number TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX raw_materials_name_uidx ON raw_materials(name);
CREATE UNIQUE INDEX raw_materials_label_uidx
  ON raw_materials(label) WHERE label IS NOT NULL;

CREATE TABLE raw_material_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  raw_material_id INTEGER NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
  note_name TEXT NOT NULL COLLATE NOCASE,
  UNIQUE (raw_material_id, note_name),
  CHECK (note_name = lower(note_name))
);

CREATE TABLE dilutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  raw_material_id INTEGER NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
  percentage INTEGER NOT NULL,
  dilution_date TEXT,
  available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
  batch_weight_grams REAL CHECK (
    batch_weight_grams IS NULL OR batch_weight_grams > 0
  ),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX dilutions_raw_material_id_idx ON dilutions(raw_material_id);

-- ---------------------------------------------------------------------------
-- Compositions / formulas
-- ---------------------------------------------------------------------------
CREATE TABLE compositions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trial', 'accord', 'perfume')),
  label TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  brief TEXT CHECK (brief IS NULL OR length(brief) <= 8000),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (name)
);

CREATE TABLE formulas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  composition_id INTEGER NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  mods TEXT NOT NULL,
  comment TEXT CHECK (comment IS NULL OR length(comment) <= 2000),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX formulas_composition_id_idx ON formulas(composition_id);

CREATE TABLE formula_dilutions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  formula_id INTEGER NOT NULL REFERENCES formulas(id) ON DELETE CASCADE,
  dilution_id INTEGER NOT NULL REFERENCES dilutions(id),
  weight_grams REAL NOT NULL CHECK (weight_grams > 0),
  percentage REAL NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX formula_dilutions_formula_id_idx ON formula_dilutions(formula_id);

-- ---------------------------------------------------------------------------
-- Feedback
-- ---------------------------------------------------------------------------
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dilution_id INTEGER NOT NULL REFERENCES dilutions(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE feedback_notes (
  feedback_id INTEGER NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  note_id INTEGER NOT NULL REFERENCES notes(id),
  PRIMARY KEY (feedback_id, note_id)
);

-- ---------------------------------------------------------------------------
-- Scent blind tests
-- ---------------------------------------------------------------------------
CREATE TABLE scent_blind_test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,
  dilution_id INTEGER NOT NULL REFERENCES dilutions(id),
  matched INTEGER NOT NULL CHECK (matched IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- App state (single row each)
-- ---------------------------------------------------------------------------
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  settings TEXT NOT NULL DEFAULT '{}',
  dismissed_ui TEXT NOT NULL DEFAULT '{}',
  offline_install_id TEXT,
  payg_email TEXT,
  extras_materials INTEGER NOT NULL DEFAULT 0,
  extras_dilutions INTEGER NOT NULL DEFAULT 0,
  extras_compositions INTEGER NOT NULL DEFAULT 0,
  extras_mods INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO app_settings (id) VALUES (1);

CREATE TABLE academy_progress (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  progress TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO academy_progress (id) VALUES (1);