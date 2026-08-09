import {
	REPEATS_TO_MASTER,
	applyLessonPass,
	buildCurriculum,
	type CurriculumSection,
} from "../curriculum";
import { initialGameState } from "../session/game/state";
import type { GameState } from "../session/game/types";
import type { AcademyProgressV1 } from "./academyProgressLocal";

/**
 * Rebuild map unlocks by replaying saved repeats in curriculum order
 * (same rules as applyLessonPass). Ignores stored status for unlocks.
 */
export function curriculumFromProgress(
	progress: AcademyProgressV1,
): CurriculumSection[] {
	let curriculum = buildCurriculum();
	const lessonIds = curriculum.flatMap((section) =>
		section.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)),
	);

	for (const lessonId of lessonIds) {
		const saved = progress.lessons[lessonId];
		if (!saved) continue;
		const times = Math.min(REPEATS_TO_MASTER, Math.max(0, saved.repeats));
		for (let i = 0; i < times; i++) {
			curriculum = applyLessonPass(curriculum, lessonId);
		}
	}

	return curriculum;
}

/** Apply durable fields onto a fresh game session (ephemeral quiz UI stays initial). */
export function gameStateFromProgress(progress: AcademyProgressV1): GameState {
	return {
		...initialGameState,
		lives: progress.lives,
		lessonStreak: progress.lessonStreak,
		materialMastery: { ...progress.materialMastery },
		learnedMaterialKeys: [...progress.learnedMaterialKeys],
		seenMaterialKeys: [...progress.seenMaterialKeys],
	};
}

export type HydratedAcademy = {
	curriculum: CurriculumSection[];
	game: GameState;
};

/** null progress → fresh curriculum + initial game. */
export function hydrateAcademyFromProgress(
	progress: AcademyProgressV1 | null,
): HydratedAcademy {
	if (!progress) {
		return {
			curriculum: buildCurriculum(),
			game: { ...initialGameState },
		};
	}

	return {
		curriculum: curriculumFromProgress(progress),
		game: gameStateFromProgress(progress),
	};
}
