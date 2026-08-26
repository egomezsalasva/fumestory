import { invoke } from "@tauri-apps/api/core";
import type { Category } from "@/routes/api.categories";
import type { Dilution } from "@/routes/api.dilutions";
import type { Note } from "@/routes/api.notes";
import type { RawMaterial } from "@/routes/api.raw-materials";

export type CreateOfflineRawMaterialInput = {
	label?: string | null;
	name: string;
	category_id?: number | null;
	cas_number?: string | null;
	note_type?: string | null;
	material_nature?: string | null;
	notes: Array<{
		name: string;
		color?: string | null;
		isNew?: boolean;
	}>;
};

export type CreateOfflineDilutionInput = {
	raw_material_id: number;
	percentage: number;
	dilution_date?: string | null;
	batch_weight_grams?: number | null;
};

export type PatchOfflineDilutionInput = {
	id: number;
	available: boolean;
};

export function listOfflineCategories(): Promise<Category[]> {
	return invoke<Category[]>("db_list_categories");
}

export function listOfflineNotes(): Promise<Note[]> {
	return invoke<Note[]>("db_list_notes");
}

export function listOfflineRawMaterials(): Promise<RawMaterial[]> {
	return invoke<RawMaterial[]>("db_list_raw_materials");
}

export function createOfflineCategory(name: string): Promise<Category> {
	return invoke<Category>("db_create_category", { name });
}

export function createOfflineRawMaterial(
	input: CreateOfflineRawMaterialInput,
): Promise<RawMaterial> {
	return invoke<RawMaterial>("db_create_raw_material", { input });
}

export function listOfflineDilutions(): Promise<Dilution[]> {
	return invoke<Dilution[]>("db_list_dilutions");
}

export function createOfflineDilution(
	input: CreateOfflineDilutionInput,
): Promise<Dilution> {
	return invoke<Dilution>("db_create_dilution", { input });
}

export function patchOfflineDilution(
	input: PatchOfflineDilutionInput,
): Promise<Dilution> {
	return invoke<Dilution>("db_patch_dilution", { input });
}
