import type { MaterialRecord } from "@/curation/materials/types";
import {
	getMasteryValue,
	normalizeMaterialKey,
	type MaterialMasteryMap,
} from "@/components/academy/utils";

/** Update learned keys for this lesson’s materials from current mastery. */
export function syncLearnedKeys(
	previousKeys: string[],
	lessonMaterials: MaterialRecord[],
	materialMastery: MaterialMasteryMap,
): string[] {
	const next = new Set(previousKeys);

	for (const material of lessonMaterials) {
		const key = normalizeMaterialKey(material);
		if (getMasteryValue(materialMastery, key) > 0) {
			next.add(key);
		} else {
			next.delete(key);
		}
	}

	return [...next];
}
