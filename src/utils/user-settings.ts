import { z } from "zod";

/** Extend this array when you add more toggles. */
export const INVENTORY_COLUMN_IDS = [
	"label",
	"cas_number",
	"material_nature",
	"category_name",
	"note_type",
	"notes_display",
	"available_dilutions",
] as const;
export type InventoryColumnId = (typeof INVENTORY_COLUMN_IDS)[number];

/** Stored: omitted keys mean “use default” (visible). */
export type InventoryColumnsJson = Partial<Record<InventoryColumnId, boolean>>;

export type InventoryColumnsEffective = Record<InventoryColumnId, boolean>;

export type UserSettingsJson = {
	guest_feedback_enabled?: boolean;
	guest_feedback_aggregate_note?: boolean;
	inventory_columns?: InventoryColumnsJson;
	hide_raw_materials_without_available_dilutions?: boolean;
	composition_agent_collapsed?: boolean;
	raw_material_agent_collapsed?: boolean;
	scent_blind_test_enabled?: boolean;
};

export type UserSettingsEffective = {
	guest_feedback_enabled: boolean;
	guest_feedback_aggregate_note: boolean;
	inventory_columns: InventoryColumnsEffective;
	hide_raw_materials_without_available_dilutions: boolean;
	composition_agent_collapsed: boolean;
	raw_material_agent_collapsed: boolean;
	scent_blind_test_enabled: boolean;
};

export type UserSettingsRow = {
	settings: UserSettingsJson;
};

const inventoryColumnsPatchSchema = z.object({
	label: z.boolean().optional(),
	cas_number: z.boolean().optional(),
	material_nature: z.boolean().optional(),
	category_name: z.boolean().optional(),
	note_type: z.boolean().optional(),
	notes_display: z.boolean().optional(),
	available_dilutions: z.boolean().optional(),
});

export const patchUserSettingsSchema = z
	.object({
		guest_feedback_enabled: z.boolean().optional(),
		guest_feedback_aggregate_note: z.boolean().optional(),
		inventory_columns: inventoryColumnsPatchSchema.optional(),
		hide_raw_materials_without_available_dilutions: z.boolean().optional(),
		composition_agent_collapsed: z.boolean().optional(),
		raw_material_agent_collapsed: z.boolean().optional(),
		scent_blind_test_enabled: z.boolean().optional(),
	})
	.refine(
		(d) => {
			if (d.guest_feedback_enabled !== undefined) return true;
			if (typeof d.guest_feedback_aggregate_note === "boolean") return true;
			if (typeof d.hide_raw_materials_without_available_dilutions === "boolean")
				return true;
			if (typeof d.composition_agent_collapsed === "boolean") return true;
			if (typeof d.raw_material_agent_collapsed === "boolean") return true;
			if (d.scent_blind_test_enabled !== undefined) return true;

			const ic = d.inventory_columns;
			if (!ic) return false;
			return INVENTORY_COLUMN_IDS.some((id) => typeof ic[id] === "boolean");
		},
		{
			message:
				"Provide guest_feedback_enabled, guest_feedback_aggregate_note, hide_raw_materials_without_available_dilutions, composition_agent_collapsed, raw_material_agent_collapsed, scent_blind_test_enabled, and/or at least one inventory column flag",
		},
	);

export type PatchUserSettingsBody = z.infer<typeof patchUserSettingsSchema>;

function parseInventoryColumnsJson(
	raw: unknown,
): InventoryColumnsJson | undefined {
	if (raw === null || raw === undefined) return undefined;
	if (typeof raw !== "object" || Array.isArray(raw)) return undefined;
	const o = raw as Record<string, unknown>;
	const out: InventoryColumnsJson = {};
	for (const id of INVENTORY_COLUMN_IDS) {
		const v = o[id];
		if (typeof v === "boolean") {
			out[id] = v;
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export function parseUserSettingsJson(
	raw: UserSettingsJson | null | undefined,
): UserSettingsJson {
	if (raw === null || raw === undefined) {
		return {};
	}
	if (typeof raw !== "object" || Array.isArray(raw)) {
		return {};
	}
	const o = raw as Record<string, unknown>;
	const out: UserSettingsJson = {};
	if (typeof o.guest_feedback_enabled === "boolean") {
		out.guest_feedback_enabled = o.guest_feedback_enabled;
	}
	if (typeof o.guest_feedback_aggregate_note === "boolean") {
		out.guest_feedback_aggregate_note = o.guest_feedback_aggregate_note;
	}
	if (typeof o.hide_raw_materials_without_available_dilutions === "boolean") {
		out.hide_raw_materials_without_available_dilutions =
			o.hide_raw_materials_without_available_dilutions;
	}
	if (typeof o.composition_agent_collapsed === "boolean") {
		out.composition_agent_collapsed = o.composition_agent_collapsed;
	}
	if (typeof o.raw_material_agent_collapsed === "boolean") {
		out.raw_material_agent_collapsed = o.raw_material_agent_collapsed;
	}
	if (typeof o.scent_blind_test_enabled === "boolean") {
		out.scent_blind_test_enabled = o.scent_blind_test_enabled;
	}
	const cols = parseInventoryColumnsJson(o.inventory_columns);
	if (cols) {
		out.inventory_columns = cols;
	}
	return out;
}

function effectiveInventoryColumns(
	stored: InventoryColumnsJson | undefined,
): InventoryColumnsEffective {
	const defaults: InventoryColumnsEffective = {
		label: true,
		cas_number: true,
		material_nature: true,
		category_name: true,
		note_type: true,
		notes_display: true,
		available_dilutions: true,
	};
	if (!stored) {
		return defaults;
	}
	const next = { ...defaults };
	for (const id of INVENTORY_COLUMN_IDS) {
		if (typeof stored[id] === "boolean") {
			next[id] = stored[id];
		}
	}
	return next;
}

export function effectiveUserSettings(
	stored: UserSettingsJson,
): UserSettingsEffective {
	const guestOn = stored.guest_feedback_enabled === true;
	const inventory_columns = effectiveInventoryColumns(stored.inventory_columns);
	return {
		guest_feedback_enabled: guestOn,
		guest_feedback_aggregate_note:
			guestOn && stored.guest_feedback_aggregate_note !== false,
		inventory_columns,
		hide_raw_materials_without_available_dilutions:
			inventory_columns.available_dilutions === true &&
			stored.hide_raw_materials_without_available_dilutions === true,
		composition_agent_collapsed: stored.composition_agent_collapsed === true,
		raw_material_agent_collapsed: stored.raw_material_agent_collapsed === true,
		scent_blind_test_enabled: stored.scent_blind_test_enabled === true,
	};
}

export function mergeUserSettingsJson(
	stored: UserSettingsJson,
	patch: Partial<UserSettingsJson>,
): UserSettingsJson {
	const merged: UserSettingsJson = { ...stored };
	if (typeof patch.guest_feedback_enabled === "boolean") {
		merged.guest_feedback_enabled = patch.guest_feedback_enabled;
	}
	if (typeof patch.guest_feedback_aggregate_note === "boolean") {
		merged.guest_feedback_aggregate_note = patch.guest_feedback_aggregate_note;
	}
	if (
		patch.inventory_columns !== undefined &&
		patch.inventory_columns !== null
	) {
		const combined: InventoryColumnsJson = {
			...stored.inventory_columns,
			...patch.inventory_columns,
		};
		const cleaned = parseInventoryColumnsJson(combined);
		if (cleaned) {
			merged.inventory_columns = cleaned;
		} else {
			delete merged.inventory_columns;
		}
	}
	if (
		typeof patch.hide_raw_materials_without_available_dilutions === "boolean"
	) {
		merged.hide_raw_materials_without_available_dilutions =
			patch.hide_raw_materials_without_available_dilutions;
	}
	if (typeof patch.composition_agent_collapsed === "boolean") {
		merged.composition_agent_collapsed = patch.composition_agent_collapsed;
	}
	if (typeof patch.raw_material_agent_collapsed === "boolean") {
		merged.raw_material_agent_collapsed = patch.raw_material_agent_collapsed;
	}
	if (typeof patch.scent_blind_test_enabled === "boolean") {
		merged.scent_blind_test_enabled = patch.scent_blind_test_enabled;
	}
	return merged;
}

/** Fired after user settings are saved so shell UI (e.g. SideNav) can refetch. */
export const USER_SETTINGS_UPDATED_EVENT =
	"fumestory:user-settings-updated" as const;

export function notifyUserSettingsUpdated(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent(USER_SETTINGS_UPDATED_EVENT));
	}
}
