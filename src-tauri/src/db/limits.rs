use rusqlite::Connection;
use serde::Serialize;
use tauri::AppHandle;

use super::settings::read_entitlements;
use super::{map_sqlite_error, open_db};

pub const FREE_MATERIALS: i64 = 50;
pub const FREE_DILUTIONS: i64 = 100;
pub const FREE_COMPOSITIONS: i64 = 50;
pub const FREE_MODS: i64 = 100;

fn count(conn: &Connection, sql: &str) -> Result<i64, String> {
	conn.query_row(sql, [], |row| row.get(0))
		.map_err(map_sqlite_error)
}

fn extras_materials(conn: &Connection) -> Result<i64, String> {
	Ok(read_entitlements(conn)?.extras_materials)
}
fn extras_dilutions(conn: &Connection) -> Result<i64, String> {
	Ok(read_entitlements(conn)?.extras_dilutions)
}
fn extras_compositions(conn: &Connection) -> Result<i64, String> {
	Ok(read_entitlements(conn)?.extras_compositions)
}
fn extras_mods(conn: &Connection) -> Result<i64, String> {
	Ok(read_entitlements(conn)?.extras_mods)
}

fn bucket(used: i64, limit: i64) -> UsageBucket {
	UsageBucket {
		used,
		limit,
		left: (limit - used).max(0),
	}
}

#[derive(Serialize)]
pub struct UsageBucket {
	pub used: i64,
	pub limit: i64,
	pub left: i64,
}

#[derive(Serialize)]
pub struct Usage {
	pub materials: UsageBucket,
	pub dilutions: UsageBucket,
	pub compositions: UsageBucket,
	pub mods: UsageBucket,
}

#[tauri::command]
pub fn db_get_usage(app: AppHandle) -> Result<Usage, String> {
	let conn = open_db(&app)?;
	Ok(Usage {
		materials: bucket(
			count(&conn, "SELECT COUNT(*) FROM raw_materials")?,
			FREE_MATERIALS + extras_materials(&conn)?,
		),
		dilutions: bucket(
			count(&conn, "SELECT COUNT(*) FROM dilutions")?,
			FREE_DILUTIONS + extras_dilutions(&conn)?,
		),
		compositions: bucket(
			count(&conn, "SELECT COUNT(*) FROM compositions")?,
			FREE_COMPOSITIONS + extras_compositions(&conn)?,
		),
		mods: bucket(
			count(&conn, "SELECT COUNT(*) FROM formulas")?,
			FREE_MODS + extras_mods(&conn)?,
		),
	})
}

pub fn ensure_can_create_material(conn: &Connection) -> Result<(), String> {
	let used = count(conn, "SELECT COUNT(*) FROM raw_materials")?;
	let limit = FREE_MATERIALS + extras_materials(conn)?;
	if used >= limit {
		return Err(format!(
			"Material limit reached ({used}/{limit}). Buy a capacity pack to add more."
		));
	}
	Ok(())
}

pub fn ensure_can_create_dilution(conn: &Connection) -> Result<(), String> {
	let used = count(conn, "SELECT COUNT(*) FROM dilutions")?;
	let limit = FREE_DILUTIONS + extras_dilutions(conn)?;
	if used >= limit {
		return Err(format!(
			"Dilution limit reached ({used}/{limit}). Buy a capacity pack to add more."
		));
	}
	Ok(())
}

pub fn ensure_can_create_composition(conn: &Connection) -> Result<(), String> {
	// Archived compositions still count.
	let used = count(conn, "SELECT COUNT(*) FROM compositions")?;
	let limit = FREE_COMPOSITIONS + extras_compositions(conn)?;
	if used >= limit {
		return Err(format!(
			"Composition limit reached ({used}/{limit}). Buy a capacity pack to add more."
		));
	}
	Ok(())
}

pub fn ensure_can_create_mod(conn: &Connection) -> Result<(), String> {
	let used = count(conn, "SELECT COUNT(*) FROM formulas")?;
	let limit = FREE_MODS + extras_mods(conn)?;
	if used >= limit {
		return Err(format!(
			"Formula (mod) limit reached ({used}/{limit}). Buy a capacity pack to add more."
		));
	}
	Ok(())
}