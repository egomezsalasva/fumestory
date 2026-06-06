import type { UserSettingsEffective } from "@/utils/user-settings";
import {
	HEADER_HINT_IDS,
	type DismissedUiEffective,
	type HeaderHintId,
	isHeaderHintDismissed,
} from "@/utils/toast-settings";

export type HeaderHintDefinition = {
	id: HeaderHintId;
	message: string;
	isRelevant: (settings: UserSettingsEffective) => boolean;
};

export const HEADER_HINTS: HeaderHintDefinition[] = [
	{
		id: HEADER_HINT_IDS.CAS_NUMBER,
		message: "You can enable CAS Number in settings",
		isRelevant: (settings) => !settings.cas_number_enabled,
	},
	{
		id: HEADER_HINT_IDS.RAW_MATERIALS_BOTTLE_LABEL,
		message: "You can enable Bottle Label in settings",
		isRelevant: (settings) => !settings.bottle_label_enabled,
	},
	{
		id: HEADER_HINT_IDS.COMPOSITION_BOTTLE_LABEL,
		message: "You can enable Bottle Label in settings",
		isRelevant: (settings) => !settings.composition_bottle_label_enabled,
	},
	{
		id: HEADER_HINT_IDS.MATERIAL_NATURE,
		message: "You can enable Material Nature (Natural/Synthetic) in settings",
		isRelevant: (settings) => !settings.material_nature_enabled,
	},
];

const headerHintsById = new Map(HEADER_HINTS.map((hint) => [hint.id, hint]));

export type GetVisibleHeaderHintsOptions = {
	hintIds: HeaderHintId[];
	limit?: number;
};

export function getVisibleHeaderHints(
	settings: UserSettingsEffective,
	dismissed: DismissedUiEffective,
	options: GetVisibleHeaderHintsOptions,
): HeaderHintDefinition[] {
	const limit = options.limit ?? 1;
	const visible: HeaderHintDefinition[] = [];

	for (const id of options.hintIds) {
		const hint = headerHintsById.get(id);
		if (!hint) continue;

		if (
			hint.isRelevant(settings) &&
			!isHeaderHintDismissed(dismissed, hint.id)
		) {
			visible.push(hint);
			if (visible.length >= limit) break;
		}
	}

	return visible;
}
