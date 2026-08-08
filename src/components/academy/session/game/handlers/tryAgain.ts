import { createLesson } from "../../createLesson";
import type { GameState } from "../types";

export function tryAgain(state: GameState): GameState {
	return {
		...state,
		lesson: createLesson(
			state.lessonLevel,
			state.lessonFamilies,
			state.lessonFocusFamily,
			state.lessonSize,
			state.lessonMinNotes,
		),
		expandedKey: null,
		quizSequence: [],
		quizIndex: 0,
		phase: "learn",
		question: null,
		selected: [],
		locked: false,
		lessonStartMastery: {},
		lessonQuizEvents: [],
		completeSnapshot: null,
	};
}
