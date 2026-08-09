import { lessonFormatForLesson } from "@/components/academy/utils";
import { createLesson } from "../../createLesson";
import type { GameState, OpenLessonPayload } from "../types";
import { resolveLevel } from "../utils/resolveLevel";

export function openLesson(
	state: GameState,
	payload: OpenLessonPayload,
): GameState {
	const format = lessonFormatForLesson(
		payload.unitDescription,
		payload.lessonIndex,
	);
	const level = resolveLevel(payload.sectionIndex);

	return {
		...state,
		activeLessonId: payload.lessonId,
		activeLessonIndex: payload.lessonIndex,
		activeUnitDescription: payload.unitDescription,
		unitLessonCount: payload.unitLessonCount,
		lessonFamilies: payload.families,
		lessonFocusFamily: payload.focusFamily,
		lessonSize: format.picks,
		lessonMinNotes: format.minNotes,
		lessonLevel: level,
		lesson: createLesson(
			level,
			payload.families,
			payload.focusFamily,
			format.picks,
			format.minNotes,
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
