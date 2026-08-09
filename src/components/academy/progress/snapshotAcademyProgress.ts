import type { CurriculumSection } from "../curriculum";
import type { GameState } from "../session/game/types";
import type {
	AcademyLessonProgress,
	AcademyProgressV1,
} from "./academyProgressLocal";

export function snapshotAcademyProgress(
	curriculum: CurriculumSection[],
	game: Pick<
		GameState,
		| "lives"
		| "lessonStreak"
		| "materialMastery"
		| "learnedMaterialKeys"
		| "seenMaterialKeys"
	>,
): AcademyProgressV1 {
	const lessons: Record<string, AcademyLessonProgress> = {};

	for (const section of curriculum) {
		for (const unit of section.units) {
			for (const lesson of unit.lessons) {
				if (lesson.repeats <= 0 && lesson.status === "locked") continue;
				lessons[lesson.id] = {
					repeats: lesson.repeats,
					status: lesson.status,
				};
			}
		}
	}

	return {
		v: 1,
		updatedAt: new Date().toISOString(),
		lives: game.lives,
		lessonStreak: game.lessonStreak,
		lessons,
		materialMastery: { ...game.materialMastery },
		learnedMaterialKeys: [...game.learnedMaterialKeys],
		seenMaterialKeys: [...game.seenMaterialKeys],
	};
}
