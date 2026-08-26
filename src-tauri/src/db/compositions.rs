use rusqlite::OptionalExtension;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use super::{
	ensure_can_create_composition, ensure_can_create_mod, map_sqlite_error, open_db,
};

const BRIEF_MAX_LENGTH: usize = 8000;
const COMMENT_MAX_LENGTH: usize = 2000;

#[derive(Serialize)]
pub struct Composition {
	id: i64,
	name: String,
	label: Option<String>,
	r#type: String,
	status: String,
	brief: Option<String>,
	created_at: String,
}

#[derive(Serialize)]
pub struct Formula {
	id: i64,
	composition_id: i64,
	mods: String,
	created_at: String,
	comment: Option<String>,
}

#[derive(Serialize)]
struct FormulaLine {
	dilution_id: i64,
	material_label: Option<String>,
	material_name: String,
	note_type: Option<String>,
	category_name: Option<String>,
	percentage: f64,
	weight_grams: f64,
}

#[derive(Serialize)]
struct FormulaWithLines {
	id: i64,
	composition_id: i64,
	mods: String,
	created_at: String,
	comment: Option<String>,
	lines: Vec<FormulaLine>,
}

#[derive(Serialize)]
pub struct CreateCompositionResult {
	composition: Composition,
	formula: Formula,
}

#[derive(Serialize)]
pub struct GetCompositionResult {
	composition: Composition,
	formulas: Vec<FormulaWithLines>,
}

#[derive(Deserialize)]
pub(crate) struct FormulaIngredientInput {
	dilution_id: i64,
	weight_grams: f64,
	formula_percentage: f64,
}

#[derive(Deserialize)]
pub(crate) struct CreateCompositionInput {
	name: String,
	r#type: String,
	label: Option<String>,
	brief: Option<String>,
	#[serde(default = "default_mods")]
	mods: String,
	ingredients: Vec<FormulaIngredientInput>,
}

fn default_mods() -> String {
	"1".into()
}

#[derive(Deserialize)]
pub(crate) struct CreateFormulaInput {
	composition_id: i64,
	ingredients: Vec<FormulaIngredientInput>,
}

#[derive(Deserialize)]
pub(crate) struct PatchCompositionInput {
	composition_id: i64,
	status: Option<String>,
	formula_id: Option<i64>,
	comment: Option<String>,
}

fn normalize_brief(value: &Option<String>) -> Result<Option<String>, String> {
	let Some(raw) = value else {
		return Ok(None);
	};
	let trimmed = raw.trim();
	if trimmed.is_empty() {
		return Ok(None);
	}
	if trimmed.len() > BRIEF_MAX_LENGTH {
		return Err(format!(
			"brief must be at most {BRIEF_MAX_LENGTH} characters"
		));
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
	if !re_ok {
		return Err("Label must be letters followed by numbers (e.g., LB1)".into());
	}
	Ok(Some(upper))
}

fn validate_ingredients(ingredients: &[FormulaIngredientInput]) -> Result<(), String> {
	if ingredients.is_empty() {
		return Err("At least one ingredient is required".into());
	}
	for ing in ingredients {
		if ing.dilution_id <= 0 {
			return Err("Invalid dilution id in ingredients".into());
		}
		if !(ing.weight_grams.is_finite() && ing.weight_grams > 0.0) {
			return Err("Each ingredient weight_grams must be > 0".into());
		}
		if !(ing.formula_percentage.is_finite()
			&& ing.formula_percentage > 0.0
			&& ing.formula_percentage <= 100.0)
		{
			return Err("Each formula_percentage must be > 0 and <= 100".into());
		}
	}
	Ok(())
}

fn assert_dilutions_exist(
	conn: &rusqlite::Connection,
	dilution_ids: &[i64],
) -> Result<(), String> {
	for id in dilution_ids {
		let exists: bool = conn
			.query_row("SELECT 1 FROM dilutions WHERE id = ?1", [id], |_| Ok(true))
			.optional()
			.map_err(map_sqlite_error)?
			.is_some();
		if !exists {
			return Err("One or more ingredients are not allowed for this user".into());
		}
	}
	Ok(())
}

fn read_composition(conn: &rusqlite::Connection, id: i64) -> Result<Composition, String> {
	conn.query_row(
		"
		SELECT id, name, label, type, status, brief, created_at
		FROM compositions
		WHERE id = ?1
		",
		[id],
		|row| {
			Ok(Composition {
				id: row.get(0)?,
				name: row.get(1)?,
				label: row.get(2)?,
				r#type: row.get(3)?,
				status: row.get(4)?,
				brief: row.get(5)?,
				created_at: row.get(6)?,
			})
		},
	)
	.map_err(map_sqlite_error)
}

#[tauri::command]
pub fn db_list_compositions(
	app: AppHandle,
	status: String,
) -> Result<Vec<Composition>, String> {
	if status != "active" && status != "archived" {
		return Err("Invalid status. Use active or archived.".into());
	}

	let conn = open_db(&app)?;
	let mut stmt = conn
		.prepare(
			"
			SELECT id, name, label, type, status, brief, created_at
			FROM compositions
			WHERE status = ?1
			ORDER BY created_at DESC
			",
		)
		.map_err(map_sqlite_error)?;

	let rows = stmt
		.query_map([status], |row| {
			Ok(Composition {
				id: row.get(0)?,
				name: row.get(1)?,
				label: row.get(2)?,
				r#type: row.get(3)?,
				status: row.get(4)?,
				brief: row.get(5)?,
				created_at: row.get(6)?,
			})
		})
		.map_err(map_sqlite_error)?;

	rows.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)
}

#[tauri::command]
pub fn db_create_composition(
	app: AppHandle,
	input: CreateCompositionInput,
) -> Result<CreateCompositionResult, String> {
	let name = input.name.trim().to_string();
	if name.is_empty() {
		return Err("Name is required".into());
	}
	if !matches!(input.r#type.as_str(), "trial" | "accord" | "perfume") {
		return Err("Invalid composition type".into());
	}

	let brief = normalize_brief(&input.brief)?;
	let label = normalize_label(&input.label)?;
	validate_ingredients(&input.ingredients)?;

	let dilution_ids: Vec<i64> = input
		.ingredients
		.iter()
		.map(|i| i.dilution_id)
		.collect();

	let conn = open_db(&app)?;
	ensure_can_create_composition(&conn)?;
	ensure_can_create_mod(&conn)?;
	assert_dilutions_exist(&conn, &dilution_ids)?;

	if let Some(ref lab) = label {
		let conflict: bool = conn
			.query_row(
				"SELECT 1 FROM raw_materials WHERE label = ?1 LIMIT 1",
				[lab],
				|_| Ok(true),
			)
			.optional()
			.map_err(map_sqlite_error)?
			.is_some();
		if conflict {
			return Err("Label already used on a raw material".into());
		}
	}

	let tx = conn.unchecked_transaction().map_err(map_sqlite_error)?;

	tx.execute(
		"
		INSERT INTO compositions (name, type, label, brief)
		VALUES (?1, ?2, ?3, ?4)
		",
		rusqlite::params![name, input.r#type, label, brief],
	)
	.map_err(map_sqlite_error)?;
	let composition_id = tx.last_insert_rowid();

	let mods = if input.mods.trim().is_empty() {
		"1".to_string()
	} else {
		input.mods.trim().to_string()
	};

	tx.execute(
		"INSERT INTO formulas (composition_id, mods) VALUES (?1, ?2)",
		rusqlite::params![composition_id, mods],
	)
	.map_err(map_sqlite_error)?;
	let formula_id = tx.last_insert_rowid();

	for ing in &input.ingredients {
		tx.execute(
			"
			INSERT INTO formula_dilutions (
				formula_id, dilution_id, weight_grams, percentage
			)
			VALUES (?1, ?2, ?3, ?4)
			",
			rusqlite::params![
				formula_id,
				ing.dilution_id,
				ing.weight_grams,
				ing.formula_percentage,
			],
		)
		.map_err(map_sqlite_error)?;
	}

	let composition = read_composition(&tx, composition_id)?;
	let formula = tx
		.query_row(
			"
			SELECT id, composition_id, mods, created_at, comment
			FROM formulas
			WHERE id = ?1
			",
			[formula_id],
			|row| {
				Ok(Formula {
					id: row.get(0)?,
					composition_id: row.get(1)?,
					mods: row.get(2)?,
					created_at: row.get(3)?,
					comment: row.get(4)?,
				})
			},
		)
		.map_err(map_sqlite_error)?;

	tx.commit().map_err(map_sqlite_error)?;

	Ok(CreateCompositionResult {
		composition,
		formula,
	})
}

#[tauri::command]
pub fn db_get_composition(
	app: AppHandle,
	composition_id: i64,
) -> Result<GetCompositionResult, String> {
	if composition_id <= 0 {
		return Err("Invalid composition id".into());
	}

	let conn = open_db(&app)?;
	let composition = match read_composition(&conn, composition_id) {
		Ok(c) => c,
		Err(_) => return Err("Composition not found".into()),
	};

	let mut formula_stmt = conn
		.prepare(
			"
			SELECT id, composition_id, mods, created_at, comment
			FROM formulas
			WHERE composition_id = ?1
			ORDER BY id
			",
		)
		.map_err(map_sqlite_error)?;

	let formula_headers = formula_stmt
		.query_map([composition_id], |row| {
			Ok((
				row.get::<_, i64>(0)?,
				row.get::<_, i64>(1)?,
				row.get::<_, String>(2)?,
				row.get::<_, String>(3)?,
				row.get::<_, Option<String>>(4)?,
			))
		})
		.map_err(map_sqlite_error)?
		.collect::<Result<Vec<_>, _>>()
		.map_err(map_sqlite_error)?;

	let mut formulas = Vec::with_capacity(formula_headers.len());
	for (id, composition_id, mods, created_at, comment) in formula_headers {
		let mut line_stmt = conn
			.prepare(
				"
				SELECT
					fd.dilution_id,
					rm.label,
					(rm.name || ' (' || d.percentage || '%)'),
					rm.note_type,
					COALESCE(parent.name, cat.name),
					fd.percentage,
					fd.weight_grams
				FROM formula_dilutions fd
				JOIN dilutions d ON d.id = fd.dilution_id
				JOIN raw_materials rm ON rm.id = d.raw_material_id
				LEFT JOIN categories cat ON cat.id = rm.category_id
				LEFT JOIN categories parent ON parent.id = cat.parent_id
				WHERE fd.formula_id = ?1
				ORDER BY fd.id
				",
			)
			.map_err(map_sqlite_error)?;

		let lines = line_stmt
			.query_map([id], |row| {
				Ok(FormulaLine {
					dilution_id: row.get(0)?,
					material_label: row.get(1)?,
					material_name: row.get(2)?,
					note_type: row.get(3)?,
					category_name: row.get(4)?,
					percentage: row.get(5)?,
					weight_grams: row.get(6)?,
				})
			})
			.map_err(map_sqlite_error)?
			.collect::<Result<Vec<_>, _>>()
			.map_err(map_sqlite_error)?;

		formulas.push(FormulaWithLines {
			id,
			composition_id,
			mods,
			created_at,
			comment,
			lines,
		});
	}

	Ok(GetCompositionResult {
		composition,
		formulas,
	})
}

#[tauri::command]
pub fn db_create_formula(
	app: AppHandle,
	input: CreateFormulaInput,
) -> Result<Formula, String> {
	if input.composition_id <= 0 {
		return Err("Invalid composition id".into());
	}
	validate_ingredients(&input.ingredients)?;

	let total: f64 = input
		.ingredients
		.iter()
		.map(|i| i.formula_percentage)
		.sum();
	if (total - 100.0).abs() > 0.0001 {
		return Err(format!(
			"Formula percentages must total 100%. Current total: {total:.2}%"
		));
	}

	let dilution_ids: Vec<i64> = input
		.ingredients
		.iter()
		.map(|i| i.dilution_id)
		.collect();

	let conn = open_db(&app)?;
	ensure_can_create_mod(&conn)?;

	let exists: bool = conn
		.query_row(
			"SELECT 1 FROM compositions WHERE id = ?1",
			[input.composition_id],
			|_| Ok(true),
		)
		.optional()
		.map_err(map_sqlite_error)?
		.is_some();
	if !exists {
		return Err("Composition not found".into());
	}

	assert_dilutions_exist(&conn, &dilution_ids)?;

	let next_mod: i64 = conn
		.query_row(
			"
			SELECT COALESCE(MAX(CAST(mods AS INTEGER)), 0) + 1
			FROM formulas
			WHERE composition_id = ?1
			  AND mods GLOB '[0-9]*'
			",
			[input.composition_id],
			|row| row.get(0),
		)
		.unwrap_or(1);

	let tx = conn.unchecked_transaction().map_err(map_sqlite_error)?;

	tx.execute(
		"INSERT INTO formulas (composition_id, mods) VALUES (?1, ?2)",
		rusqlite::params![input.composition_id, next_mod.to_string()],
	)
	.map_err(map_sqlite_error)?;
	let formula_id = tx.last_insert_rowid();

	for ing in &input.ingredients {
		tx.execute(
			"
			INSERT INTO formula_dilutions (
				formula_id, dilution_id, weight_grams, percentage
			)
			VALUES (?1, ?2, ?3, ?4)
			",
			rusqlite::params![
				formula_id,
				ing.dilution_id,
				ing.weight_grams,
				ing.formula_percentage,
			],
		)
		.map_err(map_sqlite_error)?;
	}

	let formula = tx
		.query_row(
			"
			SELECT id, composition_id, mods, created_at, comment
			FROM formulas
			WHERE id = ?1
			",
			[formula_id],
			|row| {
				Ok(Formula {
					id: row.get(0)?,
					composition_id: row.get(1)?,
					mods: row.get(2)?,
					created_at: row.get(3)?,
					comment: row.get(4)?,
				})
			},
		)
		.map_err(map_sqlite_error)?;

	tx.commit().map_err(map_sqlite_error)?;
	Ok(formula)
}

#[tauri::command]
pub fn db_patch_composition(
	app: AppHandle,
	input: PatchCompositionInput,
) -> Result<serde_json::Value, String> {
	if input.composition_id <= 0 {
		return Err("Invalid composition id".into());
	}

	let conn = open_db(&app)?;

	if let Some(status) = input.status.as_deref() {
		if status != "active" && status != "archived" {
			return Err("Invalid status. Use active or archived.".into());
		}
		let updated = conn
			.execute(
				"UPDATE compositions SET status = ?1 WHERE id = ?2",
				rusqlite::params![status, input.composition_id],
			)
			.map_err(map_sqlite_error)?;
		if updated == 0 {
			return Err("Composition not found".into());
		}
		let composition = read_composition(&conn, input.composition_id)?;
		return serde_json::to_value(composition).map_err(|e| e.to_string());
	}

	let Some(formula_id) = input.formula_id else {
		return Err("Valid formula_id is required".into());
	};
	if formula_id <= 0 {
		return Err("Valid formula_id is required".into());
	}

	let comment = match &input.comment {
		None => None,
		Some(c) => {
			let trimmed = c.trim();
			if trimmed.is_empty() {
				None
			} else if trimmed.len() > COMMENT_MAX_LENGTH {
				return Err(format!(
					"comment must be at most {COMMENT_MAX_LENGTH} characters"
				));
			} else {
				Some(trimmed.to_string())
			}
		}
	};

	let updated = conn
		.execute(
			"
			UPDATE formulas
			SET comment = ?1
			WHERE id = ?2 AND composition_id = ?3
			",
			rusqlite::params![comment, formula_id, input.composition_id],
		)
		.map_err(map_sqlite_error)?;
	if updated == 0 {
		return Err("Formula not found".into());
	}

	let formula = conn
		.query_row(
			"
			SELECT id, composition_id, mods, created_at, comment
			FROM formulas
			WHERE id = ?1
			",
			[formula_id],
			|row| {
				Ok(Formula {
					id: row.get(0)?,
					composition_id: row.get(1)?,
					mods: row.get(2)?,
					created_at: row.get(3)?,
					comment: row.get(4)?,
				})
			},
		)
		.map_err(map_sqlite_error)?;

	serde_json::to_value(formula).map_err(|e| e.to_string())
}