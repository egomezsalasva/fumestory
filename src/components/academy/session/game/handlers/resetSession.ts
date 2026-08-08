import type { GameState } from "../types";

export function resetSession(state: GameState): GameState {
	return {
		...state,
		activeLessonId: null,
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
