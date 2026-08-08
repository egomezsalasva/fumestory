import type { MaterialRecord } from "@/curation/materials/types";
import { normalizeMaterialKey } from "@/components/academy/utils";
import type { GameState } from "../types";

export function toggleMaterial(
	state: GameState,
	material: MaterialRecord,
): GameState {
	const key = normalizeMaterialKey(material);
	const alreadyPicked = state.lesson.pickedKeys.includes(key);
	const picksFull = state.lesson.pickedKeys.length >= state.lessonSize;

	if (state.expandedKey === key) {
		return { ...state, expandedKey: null };
	}

	if (picksFull && !alreadyPicked) return state;

	if (alreadyPicked || picksFull) {
		return { ...state, expandedKey: key };
	}

	return {
		...state,
		lesson: {
			...state.lesson,
			pickedKeys: [...state.lesson.pickedKeys, key],
		},
		expandedKey: key,
	};
}
