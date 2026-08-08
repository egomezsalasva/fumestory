import type { MaterialRecord } from "@/curation/materials/types";
import type {
	LessonQuizEvent,
	MaterialMasteryMap,
	QuizQuestion,
} from "@/components/academy/utils";
import type {
	CompleteSnapshot,
	LessonPhase,
	LessonState,
	Level,
} from "../types";

export type GameState = {
	activeLessonId: string | null;
	activeLessonIndex: number;
	activeUnitDescription: string;
	lessonFamilies: string[];
	lessonFocusFamily: string;
	lessonSize: number;
	lessonMinNotes: number;
	lessonLevel: Level;

	phase: LessonPhase;
	lesson: LessonState;
	expandedKey: string | null;
	quizSequence: MaterialRecord[];
	quizIndex: number;
	question: QuizQuestion | null;
	selected: string[];
	locked: boolean;

	lessonStreak: number;
	gameOverStreak: number;
	lives: number;

	learnedMaterialKeys: string[];
	seenMaterialKeys: string[];
	materialMastery: MaterialMasteryMap;
	lessonStartMastery: MaterialMasteryMap;
	lessonQuizEvents: LessonQuizEvent[];
	completeSnapshot: CompleteSnapshot | null;
};

export type OpenLessonPayload = {
	lessonId: string;
	sectionIndex: number;
	unitDescription: string;
	lessonIndex: number;
	families: string[];
	focusFamily: string;
};

export type GameAction =
	| { type: "OPEN_LESSON"; payload: OpenLessonPayload }
	| { type: "TOGGLE_MATERIAL"; payload: { material: MaterialRecord } }
	| { type: "START_QUIZ" }
	| { type: "TOGGLE_OPTION"; payload: { option: string } }
	| { type: "NEXT" }
	| { type: "TRY_AGAIN" }
	| { type: "START_OVER" }
	| { type: "RESET_SESSION" }
	| { type: "LESSON_PASSED" };
