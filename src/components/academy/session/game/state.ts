import {
	INITIAL_FORMAT,
	INITIAL_LESSON_INDEX,
	INITIAL_UNIT,
	MAX_LIVES,
} from "../constants";
import { createLesson } from "../createLesson";
import type { GameState } from "./types";

export const initialGameState: GameState = {
	activeLessonId: null,
	activeLessonIndex: INITIAL_LESSON_INDEX,
	activeUnitDescription: INITIAL_UNIT,
	lessonFamilies: ["floral"],
	lessonFocusFamily: "floral",
	lessonSize: INITIAL_FORMAT.picks,
	lessonMinNotes: INITIAL_FORMAT.minNotes,
	lessonLevel: 1,

	phase: "learn",
	lesson: createLesson(
		1,
		["floral"],
		"floral",
		INITIAL_FORMAT.picks,
		INITIAL_FORMAT.minNotes,
	),
	expandedKey: null,
	quizSequence: [],
	quizIndex: 0,
	question: null,
	selected: [],
	locked: false,

	lessonStreak: 0,
	gameOverStreak: 0,
	lives: MAX_LIVES,

	learnedMaterialKeys: [],
	seenMaterialKeys: [],
	materialMastery: {},
	lessonStartMastery: {},
	lessonQuizEvents: [],
	completeSnapshot: null,
};
