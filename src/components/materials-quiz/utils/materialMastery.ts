import type { MaterialRecord } from "@/curation/materials/types";

export const MASTERY_TARGET = 20;

export type MaterialMasteryMap = Record<string, number>;

export type LessonQuizEvent = {
	materialKey: string;
	delta: 1 | -1;
};

export function normalizeMaterialKey(material: MaterialRecord): string {
	return material.canonicalName.trim().toLowerCase();
}

export function getMasteryValue(
	mastery: MaterialMasteryMap,
	materialKey: string,
): number {
	return mastery[materialKey] ?? 0;
}

export function applyMasteryDelta(
	mastery: MaterialMasteryMap,
	materialKey: string,
	delta: 1 | -1,
): MaterialMasteryMap {
	const previous = getMasteryValue(mastery, materialKey);
	const next = Math.min(MASTERY_TARGET, Math.max(0, previous + delta));

	return {
		...mastery,
		[materialKey]: next,
	};
}

export function getNetMasteryDelta(
	events: LessonQuizEvent[],
	materialKey: string,
): number {
	return events
		.filter((event) => event.materialKey === materialKey)
		.reduce((sum, event) => sum + event.delta, 0);
}

export function getMasteryStartValue(
	currentValue: number,
	events: LessonQuizEvent[],
	materialKey: string,
): number {
	const netDelta = getNetMasteryDelta(events, materialKey);
	return Math.min(MASTERY_TARGET, Math.max(0, currentValue - netDelta));
}
