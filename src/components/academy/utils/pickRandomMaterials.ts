import type { MaterialRecord } from "@/curation/materials/types";
import { getMaterialProducerSources } from "./materialSources";

export const LESSON_SIZE = 3;
export const POOL_SIZE = 9;

/** Max producer sources per material in a lesson. Set to 2+ later for harder UI. */
export const LESSON_MAX_PRODUCER_SOURCES = 1;

/** Lesson 1→3, 2→4, 3→5, 4→6 */
export function lessonSizeForIndex(lessonIndex: number): number {
	return Math.min(6, Math.max(3, 2 + lessonIndex));
}

export function filterLessonMaterials(
	materials: MaterialRecord[],
): MaterialRecord[] {
	return materials.filter(
		(material) =>
			getMaterialProducerSources(material).length <=
			LESSON_MAX_PRODUCER_SOURCES,
	);
}

export function pickRandomMaterials(
	materials: MaterialRecord[],
	count: number = LESSON_SIZE,
): MaterialRecord[] {
	const eligible = filterLessonMaterials(materials);

	if (eligible.length < count) {
		throw new Error(
			`Need ${count} lesson materials but only ${eligible.length} eligible (max ${LESSON_MAX_PRODUCER_SOURCES} producer source(s))`,
		);
	}

	const copy = [...eligible];
	const picked: MaterialRecord[] = [];

	for (let i = 0; i < count; i++) {
		const index = Math.floor(Math.random() * copy.length);
		picked.push(copy[index]);
		copy.splice(index, 1);
	}

	return picked;
}

export function shuffleMaterials(
	materials: MaterialRecord[],
): MaterialRecord[] {
	const copy = [...materials];

	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}

	return copy;
}
