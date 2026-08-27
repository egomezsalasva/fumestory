mod catalog;
mod compositions;
mod dilutions;
mod limits;
mod materials;
mod settings;

use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use rusqlite::Connection;
use tauri::{AppHandle, Manager};

pub use catalog::{db_create_category, db_list_categories, db_list_notes};
pub use compositions::{
	db_create_composition, db_create_formula, db_get_composition, db_list_compositions,
	db_patch_composition,
};
pub use dilutions::{db_create_dilution, db_list_dilutions, db_patch_dilution};
pub use limits::db_get_usage;
pub use materials::{db_create_raw_material, db_list_raw_materials};
pub use settings::{
	db_get_install_id, db_get_user_settings, db_set_entitlements, db_set_user_settings,
};

pub(crate) use limits::{
	ensure_can_create_composition, ensure_can_create_dilution, ensure_can_create_material,
	ensure_can_create_mod,
};

/// Bump when you add SQLite migrations below.
const DB_USER_VERSION: i32 = 1;

const BACKUP_PREFIX: &str = "fumestory-offline.backup-";
const BACKUP_SUFFIX: &str = ".sqlite";

pub(crate) fn open_db(app: &AppHandle) -> Result<Connection, String> {
	let path = ensure_db(app)?;

	// Read version with a short-lived connection so we can copy the file safely.
	let current_version = {
		let conn = Connection::open(&path).map_err(|e| e.to_string())?;
		let version: i32 = conn
			.query_row("PRAGMA user_version", [], |row| row.get(0))
			.map_err(|e| e.to_string())?;
		version
	};

	if current_version < DB_USER_VERSION {
		let backup_path = backup_db(&path)?;
		prune_backups_except(&path, &backup_path);

		let migrate_result = (|| {
			let conn = Connection::open(&path).map_err(|e| e.to_string())?;
			migrate(&conn, current_version)
			// conn dropped here before any restore
		})();

		if let Err(err) = migrate_result {
			fs::copy(&backup_path, &path).map_err(|copy_err| {
				format!(
					"Database update failed ({err}), and restore from backup also failed ({copy_err}). Backup file: {}",
					backup_path.display()
				)
			})?;
			return Err(format!(
				"Database update failed and was rolled back. Your data was restored. Please restart the app or reinstall if this keeps happening. Details: {err}"
			));
		}

		let conn = Connection::open(&path).map_err(|e| e.to_string())?;
		conn.execute_batch("PRAGMA foreign_keys = ON;")
			.map_err(|e| e.to_string())?;
		return Ok(conn);
	}

	let conn = Connection::open(&path).map_err(|e| e.to_string())?;
	conn.execute_batch("PRAGMA foreign_keys = ON;")
		.map_err(|e| e.to_string())?;
	Ok(conn)
}

fn backup_db(db_path: &Path) -> Result<PathBuf, String> {
	let secs = SystemTime::now()
		.duration_since(UNIX_EPOCH)
		.map(|d| d.as_secs())
		.unwrap_or(0);
	let backup_name = format!("{BACKUP_PREFIX}{secs}{BACKUP_SUFFIX}");
	let backup_path = db_path.with_file_name(backup_name);
	fs::copy(db_path, &backup_path).map_err(|e| {
		format!(
			"Failed to backup database to {}: {e}",
			backup_path.display()
		)
	})?;
	Ok(backup_path)
}

fn list_backup_paths(db_path: &Path) -> Vec<PathBuf> {
	let Some(dir) = db_path.parent() else {
		return Vec::new();
	};
	let Ok(entries) = fs::read_dir(dir) else {
		return Vec::new();
	};

	let mut backups = Vec::new();
	for entry in entries.flatten() {
		let path = entry.path();
		let Some(name) = path.file_name().and_then(|n| n.to_str()) else {
			continue;
		};
		if name.starts_with(BACKUP_PREFIX) && name.ends_with(BACKUP_SUFFIX) {
			backups.push(path);
		}
	}
	backups.sort();
	backups
}

/// Keep only `keep`; delete other backup files (best-effort).
fn prune_backups_except(db_path: &Path, keep: &Path) {
	for path in list_backup_paths(db_path) {
		if path != keep {
			let _ = fs::remove_file(path);
		}
	}
}

fn migrate(conn: &Connection, from_version: i32) -> Result<(), String> {
	if from_version < 1 {
		// v1: PAYG columns on app_settings (idempotent ALTERs).
		settings::ensure_app_settings_columns(conn)?;
	}

	conn.execute_batch(&format!("PRAGMA user_version = {DB_USER_VERSION}"))
		.map_err(|e| e.to_string())?;
	Ok(())
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
		if msg.contains("compositions") {
			return "A composition with this name already exists".into();
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