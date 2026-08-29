use std::collections::HashMap;

use rusqlite::OptionalExtension;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use super::{ensure_can_create_material, map_sqlite_error, open_db};

const NEUTRAL_NOTE_COLOR: &str = "#94a3b8";

#[derive(Serialize)]
pub struct RawMaterial {
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

#[derive(Deserialize)]
struct CreateNoteInput {
    name: String,
    color: Option<String>,
    #[serde(rename = "isNew")]
    is_new: Option<bool>,
}

#[derive(Deserialize)]
pub(crate) struct CreateRawMaterialInput {
    label: Option<String>,
    name: String,
    category_id: Option<i64>,
    cas_number: Option<String>,
    note_type: Option<String>,
    material_nature: Option<String>,
    notes: Vec<CreateNoteInput>,
}

fn normalize_cas(value: &Option<String>) -> Result<Option<String>, String> {
    let Some(raw) = value else {
        return Ok(None);
    };
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return Ok(None);
    }
    let ok = trimmed.chars().all(|c| c.is_ascii_digit() || c == '-') && trimmed.contains('-');
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
    let valid = upper.chars().any(|c| c.is_ascii_alphabetic())
        && upper.chars().any(|c| c.is_ascii_digit())
        && upper.chars().all(|c| c.is_ascii_alphanumeric());
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

fn resolve_other_note_color(
    tx: &rusqlite::Transaction<'_>,
    note_name: &str,
    fallback: Option<&str>,
) -> Result<Option<String>, String> {
    let existing: Option<String> = tx
        .query_row(
            "
			SELECT color
			FROM notes
			WHERE name = ?1 AND kind = 'other'
			LIMIT 1
			",
            [note_name],
            |row| row.get(0),
        )
        .optional()
        .map_err(map_sqlite_error)?;

    if let Some(color) = existing {
        return Ok(Some(color));
    }

    let color = fallback
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

    Ok(Some(color))
}

#[tauri::command]
pub fn db_list_raw_materials(app: AppHandle) -> Result<Vec<RawMaterial>, String> {
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
				SELECT rmn.note_name, n.color
				FROM raw_material_notes rmn
				LEFT JOIN notes n
				  ON n.name = rmn.note_name
				 AND n.kind = 'other'
				WHERE rmn.raw_material_id = ?1
				ORDER BY rmn.note_name
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
pub fn db_create_raw_material(
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
    ensure_can_create_material(&conn)?;
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

        let is_new = note.is_new.unwrap_or(false);
        let note_color = if is_new {
            resolve_other_note_color(&tx, &note_name, note.color.as_deref())?
        } else {
            let existing_other: Option<String> = tx
                .query_row(
                    "
					SELECT color
					FROM notes
					WHERE name = ?1 AND kind = 'other'
					LIMIT 1
					",
                    [&note_name],
                    |row| row.get(0),
                )
                .optional()
                .map_err(map_sqlite_error)?;

            existing_other.or_else(|| {
                note.color
                    .as_deref()
                    .map(str::trim)
                    .filter(|c| !c.is_empty())
                    .map(str::to_string)
            })
        };

        tx.execute(
            "
			INSERT OR IGNORE INTO raw_material_notes (raw_material_id, note_name)
			VALUES (?1, ?2)
			",
            rusqlite::params![raw_id, note_name],
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
