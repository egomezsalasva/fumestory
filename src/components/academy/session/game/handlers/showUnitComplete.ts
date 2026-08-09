import type { GameState } from "../types";

export function showUnitComplete(state: GameState): GameState {
	if (state.phase !== "complete") return state;
	if (state.completeSnapshot?.outcome !== "success") return state;
	if (state.activeLessonIndex !== state.unitLessonCount) return state;

	return {
		...state,
		phase: "unitComplete",
	};
}
