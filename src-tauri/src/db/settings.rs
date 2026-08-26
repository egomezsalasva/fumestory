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

#[derive(Deserialize)]
pub(crate) struct SetUserSettingsInput {
	settings: Value,
	dismissed_ui: Value,
}

fn parse_json_column(raw: String, label: &str) -> Result<Value, String> {
	if raw.trim().is_empty() {
		return Ok(Value::Object(Default::default()));
	}
	serde_json::from_str(&raw).map_err(|e| format!("Invalid {label} JSON: {e}"))
}

fn ensure_install_id_column(conn: &rusqlite::Connection) -> Result<(), String> {
	let mut stmt = conn
		.prepare("PRAGMA table_info(app_settings)")
		.map_err(map_sqlite_error)?;
	let names: Vec<String> = stmt
		.query_map([], |row| row.get::<_, String>(1))
		.map_err(map_sqlite_error)?
		.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)?;
	if !names.iter().any(|n| n == "offline_install_id") {
		conn.execute(
			"ALTER TABLE app_settings ADD COLUMN offline_install_id TEXT",
			[],
		)
		.map_err(map_sqlite_error)?;
	}
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
	ensure_install_id_column(conn)?;
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