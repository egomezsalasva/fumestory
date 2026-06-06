import { z } from "zod";

/** Stable IDs — bump suffix (v2) to re-show after copy changes. */
export const HEADER_HINT_IDS = {
	CAS_NUMBER: "hint-cas-number-v1",
	RAW_MATERIALS_BOTTLE_LABEL: "hint-raw-materials-bottle-label-v1",
	COMPOSITION_BOTTLE_LABEL: "hint-composition-bottle-label-v1",
	MATERIAL_NATURE: "hint-material-nature-v1",
} as const;

export type HeaderHintId =
	(typeof HEADER_HINT_IDS)[keyof typeof HEADER_HINT_IDS];

/** Stored in user_settings.dismissed_ui (top-level JSON column). */
export type DismissedUiJson = {
	header_hints?: Record<string, true>;
};

/** header_hints with all known keys resolved (unknown keys preserved). */
export type DismissedUiEffective = {
	header_hints: Record<string, true>;
};

export type UserSettingsWithDismissedUiRow = {
	settings: unknown;
	dismissed_ui: DismissedUiJson | null;
};

const headerHintsPatchSchema = z.record(z.string(), z.literal(true));

export const patchDismissedUiSchema = z
	.object({
		header_hints: headerHintsPatchSchema.optional(),
	})
	.refine((d) => d.header_hints !== undefined, {
		message: "Provide header_hints with at least one dismissed hint id",
	});

export type PatchDismissedUiBody = z.infer<typeof patchDismissedUiSchema>;

function parseHeaderHintsJson(raw: unknown): Record<string, true> | undefined {
	if (raw === null || raw === undefined) return undefined;
	if (typeof raw !== "object" || Array.isArray(raw)) return undefined;

	const o = raw as Record<string, unknown>;
	const out: Record<string, true> = {};

	for (const [id, value] of Object.entries(o)) {
		if (value === true) {
			out[id] = true;
		}
	}

	return Object.keys(out).length > 0 ? out : undefined;
}

/** Parse dismissed_ui column from DB. Preserves unknown top-level keys for future modules. */
export function parseDismissedUiJson(
	raw: DismissedUiJson | null | undefined,
): DismissedUiJson {
	if (raw === null || raw === undefined) {
		return {};
	}
	if (typeof raw !== "object" || Array.isArray(raw)) {
		return {};
	}

	const o = raw as Record<string, unknown>;
	const out: DismissedUiJson = {};

	const headerHints = parseHeaderHintsJson(o.header_hints);
	if (headerHints) {
		out.header_hints = headerHints;
	}

	// Preserve keys owned by other files (tours, modals, etc.)
	for (const [key, value] of Object.entries(o)) {
		if (key === "header_hints") continue;
		if (value !== undefined) {
			(out as Record<string, unknown>)[key] = value;
		}
	}

	return out;
}

export function effectiveDismissedUi(
	stored: DismissedUiJson,
): DismissedUiEffective {
	return {
		header_hints: stored.header_hints ?? {},
	};
}

/** Append-only merge for dismissals — never removes existing keys. */
export function mergeDismissedUiJson(
	stored: DismissedUiJson,
	patch: PatchDismissedUiBody,
): DismissedUiJson {
	const merged: DismissedUiJson = { ...stored };

	if (patch.header_hints) {
		merged.header_hints = {
			...stored.header_hints,
			...patch.header_hints,
		};
	}

	return merged;
}

export function isHeaderHintDismissed(
	dismissed: DismissedUiEffective,
	id: HeaderHintId | string,
): boolean {
	return dismissed.header_hints[id] === true;
}

/** Convenience for PATCH body when user closes a hint. */
export function dismissHeaderHintPatch(id: HeaderHintId): PatchDismissedUiBody {
	return { header_hints: { [id]: true } };
}
