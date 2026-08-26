import { invoke } from "@tauri-apps/api/core";
import type { Category } from "@/routes/api.categories";
import type {
	Composition,
	CompositionStatus,
	Formula,
} from "@/routes/api.compositions";
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

export type OfflineFormulaIngredient = {
	dilution_id: number;
	weight_grams: number;
	formula_percentage: number;
};

export type CreateOfflineCompositionInput = {
	name: string;
	type: Composition["type"];
	label?: string | null;
	brief?: string | null;
	mods?: string;
	ingredients: OfflineFormulaIngredient[];
};

export type CreateOfflineFormulaInput = {
	composition_id: number;
	ingredients: OfflineFormulaIngredient[];
};

export type PatchOfflineCompositionInput = {
	composition_id: number;
	status?: CompositionStatus;
	formula_id?: number;
	comment?: string | null;
};

export type OfflineFormulaLine = {
	dilution_id: number;
	material_label: string | null;
	material_name: string;
	note_type: string | null;
	category_name: string | null;
	percentage: number;
	weight_grams: number;
};

export type OfflineFormulaWithLines = Formula & {
	comment: string | null;
	lines: OfflineFormulaLine[];
};

export type CreateOfflineCompositionResult = {
	composition: Composition;
	formula: Formula & { comment?: string | null };
};

export type GetOfflineCompositionResult = {
	composition: Composition;
	formulas: OfflineFormulaWithLines[];
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

export function listOfflineCompositions(
	status: CompositionStatus = "active",
): Promise<Composition[]> {
	return invoke<Composition[]>("db_list_compositions", { status });
}

export function createOfflineComposition(
	input: CreateOfflineCompositionInput,
): Promise<CreateOfflineCompositionResult> {
	return invoke<CreateOfflineCompositionResult>("db_create_composition", {
		input,
	});
}

export function getOfflineComposition(
	compositionId: number,
): Promise<GetOfflineCompositionResult> {
	return invoke<GetOfflineCompositionResult>("db_get_composition", {
		compositionId,
	});
}

export function createOfflineFormula(
	input: CreateOfflineFormulaInput,
): Promise<Formula & { comment: string | null }> {
	return invoke("db_create_formula", { input });
}

export function patchOfflineComposition(
	input: PatchOfflineCompositionInput,
): Promise<Composition | (Formula & { comment: string | null })> {
	return invoke("db_patch_composition", { input });
}
