import {
	applyMasteryDelta,
	normalizeMaterialKey,
} from "@/components/academy/utils";
import { isSelectionCorrect, noteKey } from "../../quizSelection";
import type { GameState } from "../types";

function submitAnswer(state: GameState, nextSelected: string[]): GameState {
	if (state.question === null) return state;

	const answerCorrect = isSelectionCorrect(
		nextSelected,
		state.question.correctNotes,
	);
	const materialKey = normalizeMaterialKey(state.question.material);
	const delta: 1 | -1 = answerCorrect ? 1 : -1;

	const materialMastery = applyMasteryDelta(
		state.materialMastery,
		materialKey,
		delta,
	);
	const lessonQuizEvents = [...state.lessonQuizEvents, { materialKey, delta }];

	if (answerCorrect) {
		return {
			...state,
			locked: true,
			selected: nextSelected,
			materialMastery,
			lessonQuizEvents,
		};
	}

	const lives = state.lives - 1;

	if (lives === 0) {
		return {
			...state,
			materialMastery,
			lessonQuizEvents,
			lives,
			gameOverStreak: state.lessonStreak,
			lessonStreak: 0,
			phase: "gameOver",
			question: null,
			selected: [],
			locked: false,
		};
	}

	return {
		...state,
		locked: true,
		selected: nextSelected,
		materialMastery,
		lessonQuizEvents,
		lives,
	};
}

export function selectOption(state: GameState, option: string): GameState {
	if (state.locked || state.question === null) return state;

	const already = state.selected.some(
		(note) => noteKey(note) === noteKey(option),
	);

	if (already) {
		return {
			...state,
			selected: state.selected.filter(
				(note) => noteKey(note) !== noteKey(option),
			),
		};
	}

	if (state.selected.length >= state.question.format.correct) return state;

	const nextSelected = [...state.selected, option];

	if (nextSelected.length === state.question.format.correct) {
		return submitAnswer(state, nextSelected);
	}

	return { ...state, selected: nextSelected };
}
