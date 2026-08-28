use serde::Serialize;
use tauri::AppHandle;

use super::{map_sqlite_error, open_db};

#[derive(Serialize)]
pub struct Category {
	id: i64,
	name: String,
	kind: String,
	parent_id: Option<i64>,
}

#[derive(Serialize)]
pub struct Note {
	id: i64,
	name: String,
	kind: String,
	color: Option<String>,
}

#[tauri::command]
pub fn db_list_categories(app: AppHandle) -> Result<Vec<Category>, String> {
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
pub fn db_list_notes(app: AppHandle) -> Result<Vec<Note>, String> {
	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT id, name, kind, color
			FROM notes
			WHERE kind = 'other'
			  AND color IS NOT NULL
			ORDER BY name
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
pub fn db_create_category(app: AppHandle, name: String) -> Result<Category, String> {
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