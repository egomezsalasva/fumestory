import {
	generateQuestionForMaterial,
	getMasteryValue,
	getProducerMaterials,
	normalizeMaterialKey,
	quizFormatForLesson,
	shuffleMaterials,
	type MaterialMasteryMap,
} from "@/components/academy/utils";
import { getPickedMaterials } from "../../createLesson";
import type { GameState } from "../types";

const materials = getProducerMaterials();

export function startQuiz(state: GameState): GameState {
	const quizMaterials = getPickedMaterials(state.lesson);
	if (quizMaterials.length < state.lessonSize) return state;

	const seenMaterialKeys = [
		...new Set([
			...state.seenMaterialKeys,
			...quizMaterials.map(normalizeMaterialKey),
		]),
	];

	const lessonStartMastery: MaterialMasteryMap = {};
	for (const material of quizMaterials) {
		const key = normalizeMaterialKey(material);
		lessonStartMastery[key] = getMasteryValue(state.materialMastery, key);
	}

	const quizSequence = shuffleMaterials(quizMaterials);
	const lessonQuizFormat = quizFormatForLesson(
		state.activeUnitDescription,
		state.activeLessonIndex,
	);

	return {
		...state,
		seenMaterialKeys,
		expandedKey: null,
		quizSequence,
		quizIndex: 0,
		lessonStartMastery,
		lessonQuizEvents: [],
		phase: "quiz",
		question: generateQuestionForMaterial(
			quizSequence[0],
			materials,
			state.materialMastery,
			lessonQuizFormat,
		),
		selected: [],
		locked: false,
	};
}
