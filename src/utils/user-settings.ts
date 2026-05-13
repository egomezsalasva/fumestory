import { z } from "zod";

/** Extend this array when you add more toggles. */
export const INVENTORY_COLUMN_IDS = [
	"label",
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
};

export type UserSettingsEffective = {
	guest_feedback_enabled: boolean;
	guest_feedback_aggregate_note: boolean;
	inventory_columns: InventoryColumnsEffective;
};

export type UserSettingsRow = {
	settings: UserSettingsJson;
};

const inventoryColumnsPatchSchema = z.object({
	label: z.boolean().optional(),
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
	})
	.refine(
		(d) => {
			if (d.guest_feedback_enabled !== undefined) return true;
			if (typeof d.guest_feedback_aggregate_note === "boolean") return true;
			const ic = d.inventory_columns;
			if (!ic) return false;
			return INVENTORY_COLUMN_IDS.some((id) => typeof ic[id] === "boolean");
		},
		{
			message:
				"Provide guest_feedback_enabled, guest_feedback_aggregate_note, and/or at least one inventory column flag",
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
	return {
		guest_feedback_enabled: guestOn,
		guest_feedback_aggregate_note:
			guestOn && stored.guest_feedback_aggregate_note !== false,
		inventory_columns: effectiveInventoryColumns(stored.inventory_columns),
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
