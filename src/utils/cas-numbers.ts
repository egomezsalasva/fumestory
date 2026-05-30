export const CAS_NUMBER_REGEX = /^\d{2,7}-\d{2}-\d$/;

export function normalizeCasNumber(value: unknown): string | null {
	if (value === null || value === undefined) return null;
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed === "" ? null : trimmed;
}

export function isValidCasNumber(value: string | null): boolean {
	return value === null || CAS_NUMBER_REGEX.test(value);
}
