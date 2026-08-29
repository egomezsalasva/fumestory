use rusqlite::OptionalExtension;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use super::{ensure_can_create_dilution, map_sqlite_error, open_db};

#[derive(Serialize)]
pub struct Dilution {
    id: i64,
    raw_material_id: i64,
    percentage: i64,
    dilution_date: Option<String>,
    available: bool,
    created_at: String,
    batch_weight_grams: Option<f64>,
}

#[derive(Deserialize)]
pub(crate) struct CreateDilutionInput {
    raw_material_id: i64,
    percentage: i64,
    dilution_date: Option<String>,
    batch_weight_grams: Option<f64>,
}

#[derive(Deserialize)]
pub(crate) struct PatchDilutionInput {
    id: i64,
    available: bool,
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
pub fn db_list_dilutions(app: AppHandle) -> Result<Vec<Dilution>, String> {
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
pub fn db_create_dilution(app: AppHandle, input: CreateDilutionInput) -> Result<Dilution, String> {
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
                "When provided, batch_weight_grams must be a finite number greater than 0".into(),
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
    ensure_can_create_dilution(&conn)?;

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
pub fn db_patch_dilution(app: AppHandle, input: PatchDilutionInput) -> Result<Dilution, String> {
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
