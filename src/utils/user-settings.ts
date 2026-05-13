import { z } from "zod";

/** Extend this array when you add more toggles. */
export const INVENTORY_COLUMN_IDS = ["label"] as const;
export type InventoryColumnId = (typeof INVENTORY_COLUMN_IDS)[number];

/** Stored: omitted keys mean “use default” (visible). */
export type InventoryColumnsJson = Partial<Record<InventoryColumnId, boolean>>;

export type InventoryColumnsEffective = Record<InventoryColumnId, boolean>;

export type UserSettingsJson = {
	guest_feedback_enabled?: boolean;
	inventory_columns?: InventoryColumnsJson;
};

export type UserSettingsEffective = {
	guest_feedback_enabled: boolean;
	inventory_columns: InventoryColumnsEffective;
};

export type UserSettingsRow = {
	settings: UserSettingsJson;
};

const inventoryColumnsPatchSchema = z.object({
	label: z.boolean().optional(),
});

export const patchUserSettingsSchema = z
	.object({
		guest_feedback_enabled: z.boolean().optional(),
		inventory_columns: inventoryColumnsPatchSchema.optional(),
	})
	.refine(
		(d) => {
			if (d.guest_feedback_enabled !== undefined) return true;
			const ic = d.inventory_columns;
			if (!ic) return false;
			return INVENTORY_COLUMN_IDS.some((id) => typeof ic[id] === "boolean");
		},
		{
			message:
				"Provide guest_feedback_enabled and/or at least one inventory column flag",
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
	return {
		guest_feedback_enabled: stored.guest_feedback_enabled === true,
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
