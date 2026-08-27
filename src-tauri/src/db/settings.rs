use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::AppHandle;
use uuid::Uuid;

use super::{map_sqlite_error, open_db};

#[derive(Serialize)]
pub struct AppSettingsRow {
	settings: Value,
	dismissed_ui: Value,
}

#[derive(Serialize)]
pub struct InstallIdRow {
	offline_install_id: String,
}

#[derive(Serialize, Clone)]
pub struct Entitlements {
	pub email: Option<String>,
	pub extras_materials: i64,
	pub extras_dilutions: i64,
	pub extras_compositions: i64,
	pub extras_mods: i64,
}

#[derive(Deserialize)]
pub(crate) struct SetUserSettingsInput {
	settings: Value,
	dismissed_ui: Value,
}

#[derive(Deserialize)]
pub(crate) struct SetEntitlementsInput {
	email: Option<String>,
	extras_materials: i64,
	extras_dilutions: i64,
	extras_compositions: i64,
	extras_mods: i64,
}

fn parse_json_column(raw: String, label: &str) -> Result<Value, String> {
	if raw.trim().is_empty() {
		return Ok(Value::Object(Default::default()));
	}
	serde_json::from_str(&raw).map_err(|e| format!("Invalid {label} JSON: {e}"))
}

fn table_column_names(conn: &rusqlite::Connection) -> Result<Vec<String>, String> {
	let mut stmt = conn
		.prepare("PRAGMA table_info(app_settings)")
		.map_err(map_sqlite_error)?;
	let names = stmt
		.query_map([], |row| row.get::<_, String>(1))
		.map_err(map_sqlite_error)?
		.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)?;
	Ok(names)
}

fn ensure_column(
	conn: &rusqlite::Connection,
	names: &[String],
	column: &str,
	ddl_type: &str,
) -> Result<(), String> {
	if !names.iter().any(|n| n == column) {
		conn.execute(
			&format!("ALTER TABLE app_settings ADD COLUMN {column} {ddl_type}"),
			[],
		)
		.map_err(map_sqlite_error)?;
	}
	Ok(())
}

fn ensure_app_settings_columns(conn: &rusqlite::Connection) -> Result<(), String> {
	let names = table_column_names(conn)?;
	ensure_column(conn, &names, "offline_install_id", "TEXT")?;
	ensure_column(conn, &names, "payg_email", "TEXT")?;
	ensure_column(conn, &names, "extras_materials", "INTEGER NOT NULL DEFAULT 0")?;
	ensure_column(conn, &names, "extras_dilutions", "INTEGER NOT NULL DEFAULT 0")?;
	ensure_column(
		conn,
		&names,
		"extras_compositions",
		"INTEGER NOT NULL DEFAULT 0",
	)?;
	ensure_column(conn, &names, "extras_mods", "INTEGER NOT NULL DEFAULT 0")?;
	Ok(())
}

fn read_row(conn: &rusqlite::Connection) -> Result<AppSettingsRow, String> {
	conn.query_row(
		"
		SELECT settings, dismissed_ui
		FROM app_settings
		WHERE id = 1
		",
		[],
		|row| {
			Ok((
				row.get::<_, String>(0)?,
				row.get::<_, String>(1)?,
			))
		},
	)
	.map_err(map_sqlite_error)
	.and_then(|(settings_raw, dismissed_raw)| {
		Ok(AppSettingsRow {
			settings: parse_json_column(settings_raw, "settings")?,
			dismissed_ui: parse_json_column(dismissed_raw, "dismissed_ui")?,
		})
	})
}

fn ensure_row(conn: &rusqlite::Connection) -> Result<(), String> {
	ensure_app_settings_columns(conn)?;
	conn.execute(
		"INSERT OR IGNORE INTO app_settings (id) VALUES (1)",
		[],
	)
	.map_err(map_sqlite_error)?;
	Ok(())
}

fn read_or_create_install_id(conn: &rusqlite::Connection) -> Result<String, String> {
	ensure_row(conn)?;
	let existing: Option<String> = conn
		.query_row(
			"
			SELECT offline_install_id
			FROM app_settings
			WHERE id = 1
			",
			[],
			|row| row.get::<_, Option<String>>(0),
		)
		.map_err(map_sqlite_error)?;

	if let Some(id) = existing.filter(|s| !s.trim().is_empty()) {
		return Ok(id);
	}

	let id = Uuid::new_v4().to_string();
	let updated = conn
		.execute(
			"
			UPDATE app_settings
			SET offline_install_id = ?1,
			    updated_at = datetime('now')
			WHERE id = 1
			",
			rusqlite::params![id],
		)
		.map_err(map_sqlite_error)?;

	if updated == 0 {
		return Err("Failed to save offline install id".into());
	}

	Ok(id)
}

pub(crate) fn read_entitlements(conn: &rusqlite::Connection) -> Result<Entitlements, String> {
	ensure_row(conn)?;
	conn.query_row(
		"
		SELECT payg_email, extras_materials, extras_dilutions, extras_compositions, extras_mods
		FROM app_settings
		WHERE id = 1
		",
		[],
		|row| {
			Ok(Entitlements {
				email: row.get::<_, Option<String>>(0)?,
				extras_materials: row.get::<_, i64>(1)?,
				extras_dilutions: row.get::<_, i64>(2)?,
				extras_compositions: row.get::<_, i64>(3)?,
				extras_mods: row.get::<_, i64>(4)?,
			})
		},
	)
	.map_err(map_sqlite_error)
}

#[tauri::command]
pub fn db_get_user_settings(app: AppHandle) -> Result<AppSettingsRow, String> {
	let conn = open_db(&app)?;
	ensure_row(&conn)?;
	read_row(&conn)
}

#[tauri::command]
pub fn db_get_install_id(app: AppHandle) -> Result<InstallIdRow, String> {
	let conn = open_db(&app)?;
	Ok(InstallIdRow {
		offline_install_id: read_or_create_install_id(&conn)?,
	})
}

#[tauri::command]
pub fn db_set_entitlements(
	app: AppHandle,
	input: SetEntitlementsInput,
) -> Result<Entitlements, String> {
	if input.extras_materials < 0
		|| input.extras_dilutions < 0
		|| input.extras_compositions < 0
		|| input.extras_mods < 0
	{
		return Err("extras must be >= 0".into());
	}

	let email = input
		.email
		.map(|e| e.trim().to_lowercase())
		.filter(|e| !e.is_empty());

	let conn = open_db(&app)?;
	ensure_row(&conn)?;

	let updated = conn
		.execute(
			"
			UPDATE app_settings
			SET payg_email = ?1,
			    extras_materials = ?2,
			    extras_dilutions = ?3,
			    extras_compositions = ?4,
			    extras_mods = ?5,
			    updated_at = datetime('now')
			WHERE id = 1
			",
			rusqlite::params![
				email,
				input.extras_materials,
				input.extras_dilutions,
				input.extras_compositions,
				input.extras_mods,
			],
		)
		.map_err(map_sqlite_error)?;

	if updated == 0 {
		return Err("Failed to save entitlements".into());
	}

	read_entitlements(&conn)
}

#[tauri::command]
pub fn db_set_user_settings(
	app: AppHandle,
	input: SetUserSettingsInput,
) -> Result<AppSettingsRow, String> {
	if !input.settings.is_object() {
		return Err("settings must be a JSON object".into());
	}
	if !input.dismissed_ui.is_object() {
		return Err("dismissed_ui must be a JSON object".into());
	}

	let settings_raw =
		serde_json::to_string(&input.settings).map_err(|e| e.to_string())?;
	let dismissed_raw =
		serde_json::to_string(&input.dismissed_ui).map_err(|e| e.to_string())?;

	let conn = open_db(&app)?;
	ensure_row(&conn)?;

	let updated = conn
		.execute(
			"
			UPDATE app_settings
			SET settings = ?1,
			    dismissed_ui = ?2,
			    updated_at = datetime('now')
			WHERE id = 1
			",
			rusqlite::params![settings_raw, dismissed_raw],
		)
		.map_err(map_sqlite_error)?;

	if updated == 0 {
		return Err("Failed to save settings".into());
	}

	read_row(&conn)
}