import { lessonFormatForLesson } from "@/components/academy/utils";

export const MAX_LIVES = 5;
export const OPTION_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const MAX_LEVEL = 3;

export const INITIAL_UNIT = "Florals";
export const INITIAL_LESSON_INDEX = 1;
export const INITIAL_FORMAT = lessonFormatForLesson(
	INITIAL_UNIT,
	INITIAL_LESSON_INDEX,
);
