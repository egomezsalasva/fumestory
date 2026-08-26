use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::AppHandle;

use super::{map_sqlite_error, open_db};

#[derive(Serialize)]
pub struct AppSettingsRow {
	settings: Value,
	dismissed_ui: Value,
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
	conn.execute(
		"INSERT OR IGNORE INTO app_settings (id) VALUES (1)",
		[],
	)
	.map_err(map_sqlite_error)?;
	Ok(())
}

#[tauri::command]
pub fn db_get_user_settings(app: AppHandle) -> Result<AppSettingsRow, String> {
	let conn = open_db(&app)?;
	ensure_row(&conn)?;
	read_row(&conn)
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