import { useReducer, useRef } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import { getProducerMaterials } from "@/components/academy/utils";
import { MAX_LIVES } from "../constants";
import type { AcademyScreen } from "../types";
import { useAcademyPlayScroll } from "../useAcademyPlayScroll";
import { gameReducer } from "./reducer";
import { initialGameState } from "./state";
import type { GameState, OpenLessonPayload } from "./types";

const materials = getProducerMaterials();

type UseGameSessionOptions = {
	screen: AcademyScreen;
	onLessonPassed: (lessonId: string) => void;
	/** Hydrated durable state; defaults to a fresh session. */
	initialState?: GameState;
};

export function useGameSession({
	screen,
	onLessonPassed,
	initialState = initialGameState,
}: UseGameSessionOptions) {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const prevPhaseRef = useRef(state.phase);

	useAcademyPlayScroll({
		screen,
		phase: state.phase,
		quizIndex: state.quizIndex,
		selectedCount: state.selected.length,
		locked: state.locked,
	});

	if (
		prevPhaseRef.current !== "complete" &&
		state.phase === "complete" &&
		state.completeSnapshot?.outcome === "success" &&
		state.activeLessonId
	) {
		onLessonPassed(state.activeLessonId);
	}
	prevPhaseRef.current = state.phase;

	const picksReady = state.lesson.pickedKeys.length >= state.lessonSize;
	const isLastQuizQuestion = state.quizIndex >= state.quizSequence.length - 1;
	const isUnitFinishingLesson =
		state.completeSnapshot?.outcome === "success" &&
		state.activeLessonIndex === state.unitLessonCount;

	return {
		materials,
		phase: state.phase,
		lesson: state.lesson,
		expandedKey: state.expandedKey,
		lessonSize: state.lessonSize,
		picksReady,
		question: state.question,
		quizIndex: state.quizIndex,
		selected: state.selected,
		locked: state.locked,
		lives: state.lives,
		maxLives: MAX_LIVES,
		isLastQuizQuestion,
		completeSnapshot: state.completeSnapshot,
		learnedMaterialKeys: new Set(state.learnedMaterialKeys),
		seenMaterialKeys: new Set(state.seenMaterialKeys),
		materialMastery: state.materialMastery,
		allReliableMaterialsCount: materials.length,
		unitName: state.activeUnitDescription,
		isUnitFinishingLesson,

		/** Fields written to localStorage / later DB. */
		durable: {
			lives: state.lives,
			lessonStreak: state.lessonStreak,
			materialMastery: state.materialMastery,
			learnedMaterialKeys: state.learnedMaterialKeys,
			seenMaterialKeys: state.seenMaterialKeys,
		},

		openLesson: (payload: OpenLessonPayload) =>
			dispatch({ type: "OPEN_LESSON", payload }),
		resetPlaySession: () => dispatch({ type: "RESET_SESSION" }),
		showUnitComplete: () => dispatch({ type: "SHOW_UNIT_COMPLETE" }),
		handleToggleMaterial: (material: MaterialRecord) =>
			dispatch({ type: "TOGGLE_MATERIAL", payload: { material } }),
		handleStartQuiz: () => dispatch({ type: "START_QUIZ" }),
		handleToggleOption: (option: string) =>
			dispatch({ type: "TOGGLE_OPTION", payload: { option } }),
		handleNext: () => dispatch({ type: "NEXT" }),
		handleStartOver: () => dispatch({ type: "START_OVER" }),
	};
}
