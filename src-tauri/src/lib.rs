mod db;

use db::{
	db_create_category, db_create_composition, db_create_dilution, db_create_formula,
	db_create_raw_material, db_get_composition, db_get_install_id, db_get_usage,
	db_get_user_settings, db_list_categories, db_list_compositions, db_list_dilutions,
	db_list_notes, db_list_raw_materials, db_patch_composition, db_patch_dilution,
	db_set_user_settings,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.setup(|app| {
			if cfg!(debug_assertions) {
				app.handle().plugin(
					tauri_plugin_log::Builder::default()
						.level(log::LevelFilter::Info)
						.build(),
				)?;
			}
			Ok(())
		})
		.invoke_handler(tauri::generate_handler![
			db_list_categories,
			db_list_notes,
			db_list_raw_materials,
			db_create_category,
			db_create_raw_material,
			db_list_dilutions,
			db_create_dilution,
			db_patch_dilution,
			db_list_compositions,
			db_create_composition,
			db_get_composition,
			db_create_formula,
			db_patch_composition,
			db_get_usage,
			db_get_install_id,
			db_get_user_settings,
			db_set_user_settings
		])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}