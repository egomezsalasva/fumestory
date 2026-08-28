import { invoke } from "@tauri-apps/api/core";
import {
	getNoteDotStyle,
	NOTE_DOT_STYLES,
} from "@/components/academy/utils/note-dot-styles";
import type { Category } from "@/routes/api.categories";
import type {
	Composition,
	CompositionStatus,
	Formula,
} from "@/routes/api.compositions";
import type { Dilution } from "@/routes/api.dilutions";
import type { Note } from "@/routes/api.notes";
import type { RawMaterial } from "@/routes/api.raw-materials";
import type { DismissedUiJson } from "@/utils/toast-settings";
import type { UserSettingsJson } from "@/utils/user-settings";

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

export type OfflineAppSettingsRow = {
	settings: UserSettingsJson;
	dismissed_ui: DismissedUiJson;
};

export type SetOfflineUserSettingsInput = {
	settings: UserSettingsJson;
	dismissed_ui: DismissedUiJson;
};

export type OfflineUsageBucket = {
	used: number;
	limit: number;
	left: number;
};

export type OfflineUsage = {
	materials: OfflineUsageBucket;
	dilutions: OfflineUsageBucket;
	compositions: OfflineUsageBucket;
	mods: OfflineUsageBucket;
};

export type OfflineInstallId = {
	offline_install_id: string;
};

export type OfflineEntitlements = {
	email: string | null;
	extras_materials: number;
	extras_dilutions: number;
	extras_compositions: number;
	extras_mods: number;
};

export type SetOfflineEntitlementsInput = {
	email?: string | null;
	extras_materials: number;
	extras_dilutions: number;
	extras_compositions: number;
	extras_mods: number;
};

function enrichRawMaterialNoteColors(material: RawMaterial): RawMaterial {
	const note_colors = { ...material.note_colors };
	for (const note of material.notes) {
		if (!note_colors[note]) {
			note_colors[note] = getNoteDotStyle(note);
		}
	}
	return { ...material, note_colors };
}

export function listOfflineCategories(): Promise<Category[]> {
	return invoke<Category[]>("db_list_categories");
}

export async function listOfflineNotes(): Promise<Note[]> {
	const otherNotes = await invoke<Note[]>("db_list_notes");
	const otherNames = new Set(otherNotes.map((note) => note.name));

	const curated: Note[] = Object.keys(NOTE_DOT_STYLES)
		.sort((a, b) => a.localeCompare(b))
		.filter((name) => !otherNames.has(name))
		.map((name, index) => ({
			id: -(index + 1),
			name,
			kind: "curated" as const,
			color: getNoteDotStyle(name),
		}));

	return [...curated, ...otherNotes];
}

export async function listOfflineRawMaterials(): Promise<RawMaterial[]> {
	const materials = await invoke<RawMaterial[]>("db_list_raw_materials");
	return materials.map(enrichRawMaterialNoteColors);
}

export function createOfflineCategory(name: string): Promise<Category> {
	return invoke<Category>("db_create_category", { name });
}

export async function createOfflineRawMaterial(
	input: CreateOfflineRawMaterialInput,
): Promise<RawMaterial> {
	const material = await invoke<RawMaterial>("db_create_raw_material", {
		input,
	});
	return enrichRawMaterialNoteColors(material);
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

export function getOfflineUsage(): Promise<OfflineUsage> {
	return invoke<OfflineUsage>("db_get_usage");
}

export function getOfflineInstallId(): Promise<OfflineInstallId> {
	return invoke<OfflineInstallId>("db_get_install_id");
}

export function setOfflineEntitlements(
	input: SetOfflineEntitlementsInput,
): Promise<OfflineEntitlements> {
	return invoke<OfflineEntitlements>("db_set_entitlements", { input });
}

export function getOfflineUserSettings(): Promise<OfflineAppSettingsRow> {
	return invoke<OfflineAppSettingsRow>("db_get_user_settings");
}

export function setOfflineUserSettings(
	input: SetOfflineUserSettingsInput,
): Promise<OfflineAppSettingsRow> {
	return invoke<OfflineAppSettingsRow>("db_set_user_settings", { input });
}
