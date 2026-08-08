import {
	generateQuestionForMaterial,
	getProducerMaterials,
	quizFormatForLesson,
} from "@/components/academy/utils";
import type { GameState } from "../types";
import { completeLesson } from "./completeLesson";

const materials = getProducerMaterials();

export function nextQuestion(state: GameState): GameState {
	if (state.question === null) return state;

	const nextIndex = state.quizIndex + 1;

	if (nextIndex >= state.quizSequence.length) {
		if (state.lives > 0) {
			return completeLesson(state);
		}
		return state;
	}

	const lessonQuizFormat = quizFormatForLesson(
		state.activeUnitDescription,
		state.activeLessonIndex,
	);

	return {
		...state,
		quizIndex: nextIndex,
		question: generateQuestionForMaterial(
			state.quizSequence[nextIndex],
			materials,
			state.materialMastery,
			lessonQuizFormat,
		),
		selected: [],
		locked: false,
	};
}
