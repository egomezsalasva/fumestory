use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

use rusqlite::{Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

const NEUTRAL_NOTE_COLOR: &str = "#94a3b8";

fn db_path(app: &AppHandle) -> Result<PathBuf, String> {
	let dir = app
		.path()
		.app_data_dir()
		.map_err(|e| e.to_string())?;
	fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
	Ok(dir.join("fumestory-offline.sqlite"))
}

fn seed_db_source() -> PathBuf {
	PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("db/fumestory-offline.sqlite")
}

fn ensure_db(app: &AppHandle) -> Result<PathBuf, String> {
	let dest = db_path(app)?;
	if !dest.exists() {
		let src = seed_db_source();
		if !src.exists() {
			return Err(format!("seed database missing at {}", src.display()));
		}
		fs::copy(&src, &dest).map_err(|e| e.to_string())?;
	}
	Ok(dest)
}

fn open_db(app: &AppHandle) -> Result<Connection, String> {
	let path = ensure_db(app)?;
	let conn = Connection::open(path).map_err(|e| e.to_string())?;
	conn.execute_batch("PRAGMA foreign_keys = ON;")
		.map_err(|e| e.to_string())?;
	Ok(conn)
}

fn map_sqlite_error(err: rusqlite::Error) -> String {
	let msg = err.to_string();
	if msg.contains("UNIQUE") || msg.contains("unique") {
		if msg.contains("raw_materials_name") {
			return "A raw material with this name already exists".into();
		}
		if msg.contains("raw_materials_label") {
			return "A raw material with this label already exists".into();
		}
		if msg.contains("categories_name") {
			return "A category with this name already exists".into();
		}
		if msg.contains("notes_name") {
			return "A note with this name already exists".into();
		}
		return "Unique constraint failed".into();
	}
	msg
}

#[derive(Serialize)]
struct Category {
	id: i64,
	name: String,
	kind: String,
	parent_id: Option<i64>,
}

#[derive(Serialize)]
struct Note {
	id: i64,
	name: String,
	kind: String,
	color: Option<String>,
}

#[derive(Serialize)]
struct RawMaterial {
	id: i64,
	label: Option<String>,
	name: String,
	category_id: Option<i64>,
	material_nature: Option<String>,
	cas_number: Option<String>,
	category_name: String,
	note_type: Option<String>,
	notes: Vec<String>,
	note_colors: HashMap<String, Option<String>>,
	available_dilutions: Vec<i64>,
	aggregated_note_counts: HashMap<String, i64>,
	created_at: String,
}

#[derive(Serialize)]
struct Dilution {
	id: i64,
	raw_material_id: i64,
	percentage: i64,
	dilution_date: Option<String>,
	available: bool,
	created_at: String,
	batch_weight_grams: Option<f64>,
}

#[derive(Deserialize)]
struct CreateNoteInput {
	name: String,
	color: Option<String>,
}

#[derive(Deserialize)]
struct CreateRawMaterialInput {
	label: Option<String>,
	name: String,
	category_id: Option<i64>,
	cas_number: Option<String>,
	note_type: Option<String>,
	material_nature: Option<String>,
	notes: Vec<CreateNoteInput>,
}

#[derive(Deserialize)]
struct CreateDilutionInput {
	raw_material_id: i64,
	percentage: i64,
	dilution_date: Option<String>,
	batch_weight_grams: Option<f64>,
}

#[derive(Deserialize)]
struct PatchDilutionInput {
	id: i64,
	available: bool,
}

fn normalize_cas(value: &Option<String>) -> Result<Option<String>, String> {
	let Some(raw) = value else {
		return Ok(None);
	};
	let trimmed = raw.trim();
	if trimmed.is_empty() {
		return Ok(None);
	}
	let ok = trimmed
		.chars()
		.all(|c| c.is_ascii_digit() || c == '-')
		&& trimmed.contains('-');
	if !ok {
		return Err("CAS number must look like 6790-58-5".into());
	}
	Ok(Some(trimmed.to_string()))
}

fn normalize_label(value: &Option<String>) -> Result<Option<String>, String> {
	let Some(raw) = value else {
		return Ok(None);
	};
	let trimmed = raw.trim();
	if trimmed.is_empty() {
		return Ok(None);
	}
	let upper = trimmed.to_uppercase();
	let valid = upper
		.chars()
		.any(|c| c.is_ascii_alphabetic())
		&& upper.chars().any(|c| c.is_ascii_digit())
		&& upper
			.chars()
			.all(|c| c.is_ascii_alphanumeric());
	// letters followed by numbers, e.g. LB1
	let re_ok = {
		let bytes = upper.as_bytes();
		let mut i = 0;
		while i < bytes.len() && bytes[i].is_ascii_alphabetic() {
			i += 1;
		}
		if i == 0 || i == bytes.len() {
			false
		} else {
			bytes[i..].iter().all(|b| b.is_ascii_digit())
		}
	};
	if !re_ok || !valid {
		return Err("Label must be letters followed by numbers (e.g., LB1)".into());
	}
	Ok(Some(upper))
}

fn row_to_dilution(
	id: i64,
	raw_material_id: i64,
	percentage: i64,
	dilution_date: Option<String>,
	available: i64,
	created_at: String,
	batch_weight_grams: Option<f64>,
) -> Dilution {
	Dilution {
		id,
		raw_material_id,
		percentage,
		dilution_date,
		available: available != 0,
		created_at,
		batch_weight_grams,
	}
}

#[tauri::command]
fn db_list_categories(app: AppHandle) -> Result<Vec<Category>, String> {
	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT id, name, kind, parent_id
			FROM categories
			WHERE parent_id IS NULL
			  AND kind = 'curated'
			ORDER BY name
			",
		)
		.map_err(map_sqlite_error)?;

	let rows = stmt
		.query_map([], |row| {
			Ok(Category {
				id: row.get(0)?,
				name: row.get(1)?,
				kind: row.get(2)?,
				parent_id: row.get(3)?,
			})
		})
		.map_err(map_sqlite_error)?;

	rows.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)
}

#[tauri::command]
fn db_list_notes(app: AppHandle) -> Result<Vec<Note>, String> {
	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT id, name, kind, color
			FROM notes
			WHERE kind = 'curated'
			   OR (kind = 'other' AND color IS NOT NULL)
			ORDER BY
				CASE WHEN kind = 'curated' THEN 0 ELSE 1 END,
				name
			",
		)
		.map_err(map_sqlite_error)?;

	let rows = stmt
		.query_map([], |row| {
			Ok(Note {
				id: row.get(0)?,
				name: row.get(1)?,
				kind: row.get(2)?,
				color: row.get(3)?,
			})
		})
		.map_err(map_sqlite_error)?;

	rows.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)
}

#[tauri::command]
fn db_list_raw_materials(app: AppHandle) -> Result<Vec<RawMaterial>, String> {
	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT
				rm.id,
				rm.label,
				rm.name,
				rm.material_nature,
				rm.category_id,
				rm.cas_number,
				COALESCE(parent.name, c.name, '') AS category_name,
				rm.note_type,
				rm.created_at
			FROM raw_materials rm
			LEFT JOIN categories c ON rm.category_id = c.id
			LEFT JOIN categories parent ON parent.id = c.parent_id
			ORDER BY rm.id DESC
			",
		)
		.map_err(map_sqlite_error)?;

	let base_rows = stmt
		.query_map([], |row| {
			Ok((
				row.get::<_, i64>(0)?,
				row.get::<_, Option<String>>(1)?,
				row.get::<_, String>(2)?,
				row.get::<_, Option<String>>(3)?,
				row.get::<_, Option<i64>>(4)?,
				row.get::<_, Option<String>>(5)?,
				row.get::<_, String>(6)?,
				row.get::<_, Option<String>>(7)?,
				row.get::<_, String>(8)?,
			))
		})
		.map_err(map_sqlite_error)?
		.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)?;

	let mut out = Vec::with_capacity(base_rows.len());
	for (
		id,
		label,
		name,
		material_nature,
		category_id,
		cas_number,
		category_name,
		note_type,
		created_at,
	) in base_rows
	{
		let mut note_stmt = conn
			.prepare(
				"
				SELECT n.name, n.color
				FROM raw_material_notes rmn
				JOIN notes n ON n.id = rmn.note_id
				WHERE rmn.raw_material_id = ?1
				ORDER BY n.name
				",
			)
			.map_err(map_sqlite_error)?;
		let note_rows = note_stmt
			.query_map([id], |row| {
				Ok((row.get::<_, String>(0)?, row.get::<_, Option<String>>(1)?))
			})
			.map_err(map_sqlite_error)?
			.collect::<Result<Vec<_>, _>>()
			.map_err(map_sqlite_error)?;

		let mut notes = Vec::new();
		let mut note_colors = HashMap::new();
		let mut aggregated_note_counts = HashMap::new();
		for (note_name, color) in note_rows {
			notes.push(note_name.clone());
			note_colors.insert(note_name.clone(), color);
			aggregated_note_counts.insert(note_name, 1);
		}

		let mut dil_stmt = conn
			.prepare(
				"
				SELECT percentage
				FROM dilutions
				WHERE raw_material_id = ?1 AND available = 1
				ORDER BY percentage
				",
			)
			.map_err(map_sqlite_error)?;
		let available_dilutions = dil_stmt
			.query_map([id], |row| row.get::<_, i64>(0))
			.map_err(map_sqlite_error)?
			.collect::<Result<Vec<_>, _>>()
			.map_err(map_sqlite_error)?;

		out.push(RawMaterial {
			id,
			label,
			name,
			category_id,
			material_nature,
			cas_number,
			category_name,
			note_type,
			notes,
			note_colors,
			available_dilutions,
			aggregated_note_counts,
			created_at,
		});
	}

	Ok(out)
}

#[tauri::command]
fn db_create_category(app: AppHandle, name: String) -> Result<Category, String> {
	let normalized = name.trim().to_lowercase();
	if normalized.is_empty() {
		return Err("Category name is required".into());
	}

	let conn = open_db(&app)?;
	conn.execute(
		"
		INSERT INTO categories (name, kind, parent_id)
		VALUES (?1, 'other', NULL)
		",
		[&normalized],
	)
	.map_err(map_sqlite_error)?;

	let id = conn.last_insert_rowid();
	Ok(Category {
		id,
		name: normalized,
		kind: "other".into(),
		parent_id: None,
	})
}

#[tauri::command]
fn db_create_raw_material(
	app: AppHandle,
	input: CreateRawMaterialInput,
) -> Result<RawMaterial, String> {
	let name = input.name.trim().to_string();
	if name.is_empty() {
		return Err("Raw material name is required".into());
	}
	if name.len() < 3 {
		return Err("Name must be at least 3 characters long".into());
	}

	let cas_number = normalize_cas(&input.cas_number)?;
	let label = normalize_label(&input.label)?;

	let material_nature = match input.material_nature.as_deref() {
		None | Some("") => None,
		Some("Natural") | Some("Synthetic") => {
			Some(input.material_nature.as_ref().unwrap().clone())
		}
		_ => {
			return Err("Material nature must be Natural or Synthetic".into());
		}
	};

	let note_type = match input.note_type.as_deref() {
		None | Some("") => None,
		Some("High") | Some("Mid(Heart)") | Some("Base") => input.note_type.clone(),
		_ => return Err("Invalid note type".into()),
	};

	if input.notes.is_empty() {
		return Err("At least one note is required".into());
	}
	if input.notes.len() > 25 {
		return Err("Too many notes (max 25)".into());
	}

	let conn = open_db(&app)?;
	let tx = conn.unchecked_transaction().map_err(map_sqlite_error)?;

	tx.execute(
		"
		INSERT INTO raw_materials (
			label, name, category_id, note_type, material_nature, cas_number
		)
		VALUES (?1, ?2, ?3, ?4, ?5, ?6)
		",
		rusqlite::params![
			label,
			name,
			input.category_id,
			note_type,
			material_nature,
			cas_number,
		],
	)
	.map_err(map_sqlite_error)?;

	let raw_id = tx.last_insert_rowid();

	let mut note_names = Vec::new();
	let mut note_colors: HashMap<String, Option<String>> = HashMap::new();

	for note in &input.notes {
		let note_name = note.name.trim().to_lowercase();
		if note_name.is_empty() {
			return Err("Invalid notes payload".into());
		}

		let existing: Option<(i64, Option<String>)> = tx
			.query_row(
				"
				SELECT id, color
				FROM notes
				WHERE name = ?1
				ORDER BY CASE WHEN kind = 'curated' THEN 0 ELSE 1 END
				LIMIT 1
				",
				[&note_name],
				|row| Ok((row.get(0)?, row.get(1)?)),
			)
			.optional()
			.map_err(map_sqlite_error)?;

		let (note_id, note_color) = if let Some((id, color)) = existing {
			(id, color)
		} else {
			let color = note
				.color
				.as_deref()
				.map(str::trim)
				.filter(|c| !c.is_empty())
				.unwrap_or(NEUTRAL_NOTE_COLOR)
				.to_string();
			tx.execute(
				"
				INSERT INTO notes (name, kind, color)
				VALUES (?1, 'other', ?2)
				",
				rusqlite::params![note_name, color],
			)
			.map_err(map_sqlite_error)?;
			(tx.last_insert_rowid(), Some(color))
		};

		tx.execute(
			"
			INSERT OR IGNORE INTO raw_material_notes (raw_material_id, note_id)
			VALUES (?1, ?2)
			",
			rusqlite::params![raw_id, note_id],
		)
		.map_err(map_sqlite_error)?;

		note_names.push(note_name.clone());
		note_colors.insert(note_name, note_color);
	}

	let (created_at, category_name): (String, String) = tx
		.query_row(
			"
			SELECT
				rm.created_at,
				COALESCE(parent.name, c.name, '')
			FROM raw_materials rm
			LEFT JOIN categories c ON rm.category_id = c.id
			LEFT JOIN categories parent ON parent.id = c.parent_id
			WHERE rm.id = ?1
			",
			[raw_id],
			|row| Ok((row.get(0)?, row.get(1)?)),
		)
		.map_err(map_sqlite_error)?;

	tx.commit().map_err(map_sqlite_error)?;

	Ok(RawMaterial {
		id: raw_id,
		label,
		name,
		category_id: input.category_id,
		material_nature,
		cas_number,
		category_name,
		note_type,
		notes: note_names,
		note_colors,
		available_dilutions: vec![],
		aggregated_note_counts: HashMap::new(),
		created_at,
	})
}

#[tauri::command]
fn db_list_dilutions(app: AppHandle) -> Result<Vec<Dilution>, String> {
	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT
				id,
				raw_material_id,
				percentage,
				dilution_date,
				available,
				created_at,
				batch_weight_grams
			FROM dilutions
			ORDER BY created_at DESC
			",
		)
		.map_err(map_sqlite_error)?;

	let rows = stmt
		.query_map([], |row| {
			Ok(row_to_dilution(
				row.get(0)?,
				row.get(1)?,
				row.get(2)?,
				row.get(3)?,
				row.get(4)?,
				row.get(5)?,
				row.get(6)?,
			))
		})
		.map_err(map_sqlite_error)?;

	rows.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)
}

#[tauri::command]
fn db_create_dilution(
	app: AppHandle,
	input: CreateDilutionInput,
) -> Result<Dilution, String> {
	if input.raw_material_id <= 0 {
		return Err("Raw material id is required".into());
	}
	if input.percentage <= 0 || input.percentage > 100 {
		return Err("Valid percentage is required".into());
	}

	let batch_weight = match input.batch_weight_grams {
		None => None,
		Some(w) if w.is_finite() && w > 0.0 => Some(w),
		Some(_) => {
			return Err(
				"When provided, batch_weight_grams must be a finite number greater than 0"
					.into(),
			);
		}
	};

	let dilution_date = input
		.dilution_date
		.as_deref()
		.map(str::trim)
		.filter(|s| !s.is_empty())
		.map(str::to_string);

	let conn = open_db(&app)?;

	let exists: bool = conn
		.query_row(
			"SELECT 1 FROM raw_materials WHERE id = ?1",
			[input.raw_material_id],
			|_| Ok(true),
		)
		.optional()
		.map_err(map_sqlite_error)?
		.is_some();
	if !exists {
		return Err("Not allowed for this raw material".into());
	}

	conn.execute(
		"
		INSERT INTO dilutions (
			raw_material_id, percentage, dilution_date, batch_weight_grams
		)
		VALUES (?1, ?2, ?3, ?4)
		",
		rusqlite::params![
			input.raw_material_id,
			input.percentage,
			dilution_date,
			batch_weight,
		],
	)
	.map_err(map_sqlite_error)?;

	let id = conn.last_insert_rowid();
	conn.query_row(
		"
		SELECT
			id,
			raw_material_id,
			percentage,
			dilution_date,
			available,
			created_at,
			batch_weight_grams
		FROM dilutions
		WHERE id = ?1
		",
		[id],
		|row| {
			Ok(row_to_dilution(
				row.get(0)?,
				row.get(1)?,
				row.get(2)?,
				row.get(3)?,
				row.get(4)?,
				row.get(5)?,
				row.get(6)?,
			))
		},
	)
	.map_err(map_sqlite_error)
}

#[tauri::command]
fn db_patch_dilution(
	app: AppHandle,
	input: PatchDilutionInput,
) -> Result<Dilution, String> {
	if input.id <= 0 {
		return Err("Dilution ID is required".into());
	}

	let conn = open_db(&app)?;
	let updated = conn
		.execute(
			"UPDATE dilutions SET available = ?1 WHERE id = ?2",
			rusqlite::params![if input.available { 1 } else { 0 }, input.id],
		)
		.map_err(map_sqlite_error)?;

	if updated == 0 {
		return Err("Dilution not found".into());
	}

	conn.query_row(
		"
		SELECT
			id,
			raw_material_id,
			percentage,
			dilution_date,
			available,
			created_at,
			batch_weight_grams
		FROM dilutions
		WHERE id = ?1
		",
		[input.id],
		|row| {
			Ok(row_to_dilution(
				row.get(0)?,
				row.get(1)?,
				row.get(2)?,
				row.get(3)?,
				row.get(4)?,
				row.get(5)?,
				row.get(6)?,
			))
		},
	)
	.map_err(map_sqlite_error)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.setup(|app| {
			if cfg!(debug_assertions) {
				app.handle().plugin(
					tauri_plugin_log::Builder::default()
						.level(log::LevelFilter::Info)
						.build(),
				)?;
			}
			Ok(())
		})
		.invoke_handler(tauri::generate_handler![
			db_list_categories,
			db_list_notes,
			db_list_raw_materials,
			db_create_category,
			db_create_raw_material,
			db_list_dilutions,
			db_create_dilution,
			db_patch_dilution
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}