mod catalog;
mod dilutions;
mod materials;

use std::fs;
use std::path::PathBuf;

use rusqlite::Connection;
use tauri::{AppHandle, Manager};

pub use catalog::{db_create_category, db_list_categories, db_list_notes};
pub use dilutions::{db_create_dilution, db_list_dilutions, db_patch_dilution};
pub use materials::{db_create_raw_material, db_list_raw_materials};

pub(crate) fn open_db(app: &AppHandle) -> Result<Connection, String> {
	let path = ensure_db(app)?;
	let conn = Connection::open(path).map_err(|e| e.to_string())?;
	conn.execute_batch("PRAGMA foreign_keys = ON;")
		.map_err(|e| e.to_string())?;
	Ok(conn)
}

pub(crate) fn map_sqlite_error(err: rusqlite::Error) -> String {
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