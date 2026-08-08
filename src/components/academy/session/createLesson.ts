import type { MaterialRecord, SourceName } from "@/curation/materials/types";
import {
	POOL_SIZE,
	filterLessonMaterials,
	getProducerMaterials,
	materialMeetsMinNotes,
	normalizeMaterialKey,
	pickRandomMaterials,
	shuffleMaterials,
} from "@/components/academy/utils";
import type { LessonState, Level } from "./types";

const materials = getProducerMaterials();

const RELIABLE_SOURCES = new Set<SourceName>([
	"Givaudan",
	"Firmenich",
	"IFF",
	"Symrise",
]);

function normalizeNote(note: string): string {
	return note.trim().toLowerCase().replace(/\s+/g, " ");
}

export function countReliableNotes(material: MaterialRecord): number {
	const notes = new Set<string>();

	for (const source of material.sources ?? []) {
		if (!RELIABLE_SOURCES.has(source.sourceName)) continue;
		for (const note of source.data?.notes ?? []) {
			notes.add(normalizeNote(String(note)));
		}
	}

	return notes.size;
}

export function getMaterialFamily(material: MaterialRecord): string | null {
	const family = material.olfactiveFamily?.[0]?.trim().toLowerCase();
	return family || null;
}

export function materialInFamilies(
	material: MaterialRecord,
	families: string[],
): boolean {
	const family = getMaterialFamily(material);
	return family != null && families.includes(family);
}

export function isMaterialInLevel(
	material: MaterialRecord,
	level: Level,
): boolean {
	const noteCount = countReliableNotes(material);

	if (level === 1) return noteCount <= 5;
	if (level === 2) return noteCount > 5 && noteCount < 10;
	return noteCount >= 10;
}

function pickUpTo(pool: MaterialRecord[], count: number): MaterialRecord[] {
	if (count <= 0 || pool.length === 0) return [];
	return pickRandomMaterials(pool, Math.min(count, pool.length));
}

/** Up to 6 from focus; fill to POOL_SIZE from leftover focus + earlier families. */
export function createLesson(
	level: Level,
	families: string[],
	focusFamily: string,
	lessonSize: number,
	minNotes: number,
): LessonState {
	const eligible = filterLessonMaterials(
		materials.filter(
			(material) =>
				isMaterialInLevel(material, level) &&
				materialInFamilies(material, families) &&
				materialMeetsMinNotes(material, minNotes),
		),
	);

	if (eligible.length < lessonSize) {
		return { pool: [], pickedKeys: [] };
	}

	const poolSize = Math.min(POOL_SIZE, eligible.length);
	const focusPool = eligible.filter(
		(material) => getMaterialFamily(material) === focusFamily,
	);
	const priorPool = eligible.filter(
		(material) => getMaterialFamily(material) !== focusFamily,
	);

	const focusCount = Math.min(6, focusPool.length, poolSize);
	const focusPicked = pickUpTo(focusPool, focusCount);
	const focusKeys = new Set(focusPicked.map(normalizeMaterialKey));

	const fillPool = [
		...focusPool.filter(
			(material) => !focusKeys.has(normalizeMaterialKey(material)),
		),
		...priorPool,
	];
	const need = Math.max(0, poolSize - focusPicked.length);
	const rest = pickUpTo(fillPool, need);

	return {
		pool: shuffleMaterials([...focusPicked, ...rest]),
		pickedKeys: [],
	};
}

export function getPickedMaterials(lesson: LessonState): MaterialRecord[] {
	return lesson.pickedKeys
		.map((key) =>
			lesson.pool.find((material) => normalizeMaterialKey(material) === key),
		)
		.filter((material): material is MaterialRecord => material != null);
}
