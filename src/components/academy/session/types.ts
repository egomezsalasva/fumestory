import type { MaterialRecord } from "@/curation/materials/types";
import type { MaterialMasteryMap } from "@/components/academy/utils";

export type AcademyScreen = "home" | "section" | "overview" | "play";
export type LessonPhase = "learn" | "quiz" | "complete" | "gameOver";
export type Level = 1 | 2 | 3;

export type LessonState = {
	pool: MaterialRecord[];
	pickedKeys: string[];
};

export type CompleteSnapshot = {
	previousKnownCount: number;
	newKnownCount: number;
	previousLearnedKeys: string[];
	lessonMaterials: MaterialRecord[];
	lessonStartMastery: MaterialMasteryMap;
	outcome: "success" | "retry";
};
