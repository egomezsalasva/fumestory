import { getPickedMaterials } from "../../createLesson";
import type { GameState } from "../types";
import { syncLearnedKeys } from "../utils/syncLearnedKeys";

export function completeLesson(state: GameState): GameState {
	const quizMaterials = getPickedMaterials(state.lesson);
	const previousKnownCount = state.learnedMaterialKeys.length;
	const learnedMaterialKeys = syncLearnedKeys(
		state.learnedMaterialKeys,
		quizMaterials,
		state.materialMastery,
	);

	const allWrong =
		state.lessonQuizEvents.length > 0 &&
		state.lessonQuizEvents.every((event) => event.delta === -1);

	const base = {
		learnedMaterialKeys,
		phase: "complete" as const,
		question: null,
		selected: [],
		locked: false,
		completeSnapshot: {
			previousKnownCount,
			newKnownCount: learnedMaterialKeys.length,
			previousLearnedKeys: [...state.learnedMaterialKeys],
			lessonMaterials: quizMaterials,
			lessonStartMastery: state.lessonStartMastery,
			outcome: allWrong ? ("retry" as const) : ("success" as const),
		},
	};

	if (allWrong) {
		return { ...state, ...base };
	}

	return {
		...state,
		...base,
		lessonStreak: state.lessonStreak + 1,
	};
}
