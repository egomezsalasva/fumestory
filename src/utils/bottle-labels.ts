/** Letters then digits, e.g. LB1, CP3 */
export const BOTTLE_LABEL_FORMAT = /^[A-Z]+\d+$/;
/** Same pattern with capture groups for prefix/number parsing in UI */
export const BOTTLE_LABEL_PARSE = /^([A-Z]+)(\d+)$/;

export type BottleLabel = string | null;

/** Returns uppercase label, or null if empty. Throws nothing — use validateBottleLabel for errors. */
export function parseBottleLabelInput(label: unknown): BottleLabel {
	if (label == null || typeof label !== "string" || label.trim() === "") {
		return null;
	}
	return label.trim().toUpperCase();
}

export function validateBottleLabelFormat(label: string): string | null {
	if (!BOTTLE_LABEL_FORMAT.test(label)) {
		return "Label must be letters followed by numbers (e.g., LB1)";
	}
	return null;
}
