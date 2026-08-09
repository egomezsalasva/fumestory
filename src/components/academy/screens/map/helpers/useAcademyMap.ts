import { useState, type Dispatch, type SetStateAction } from "react";
import {
	findLatestUnlockedLessonId,
	findLesson,
	findSection,
	type CurriculumSection,
} from "../../../curriculum";
import type { OpenLessonPayload } from "../../../session/game/types";
import type { AcademyScreen } from "../../../session/types";
import { useSectionScroll } from "./useSectionScroll";

type GameMapApi = {
	openLesson: (payload: OpenLessonPayload) => void;
	resetPlaySession: () => void;
};

type UseAcademyMapOptions = {
	screen: AcademyScreen;
	setScreen: Dispatch<SetStateAction<AcademyScreen>>;
	curriculum: CurriculumSection[];
	game: GameMapApi;
};

export function useAcademyMap({
	screen,
	setScreen,
	curriculum,
	game,
}: UseAcademyMapOptions) {
	const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
	const { sectionScrollY, scrollToLessonId } = useSectionScroll(
		screen,
		curriculum,
	);

	const activeSection = activeSectionId
		? findSection(curriculum, activeSectionId)
		: null;

	function handleReturnToSection(options?: { toLatestUnlocked?: boolean }) {
		if (options?.toLatestUnlocked) {
			const section = activeSectionId
				? findSection(curriculum, activeSectionId)
				: null;
			if (section) {
				scrollToLessonId.current = findLatestUnlockedLessonId(section);
			}
		}

		game.resetPlaySession();
		setScreen("section");
	}

	function handleOpenOverviewFromComplete() {
		game.resetPlaySession();
		sectionScrollY.current = window.scrollY;
		scrollToLessonId.current = null;
		setScreen("overview");
	}

	function handleOpenSection(sectionId: string) {
		sectionScrollY.current = 0;
		scrollToLessonId.current = null;
		setActiveSectionId(sectionId);
		setScreen("section");
	}

	function handleOpenLesson(lessonId: string) {
		const found = findLesson(curriculum, lessonId);
		if (!found) return;

		sectionScrollY.current = window.scrollY;
		scrollToLessonId.current = null;

		game.openLesson({
			lessonId,
			sectionIndex: found.section.sectionIndex,
			unitDescription: found.unit.description,
			lessonIndex: found.lesson.lessonIndex,
			unitLessonCount: found.unit.lessons.length,
			families: found.unit.families,
			focusFamily: found.unit.focusFamily,
		});
		setScreen("play");
	}

	function handleBackToHome() {
		setActiveSectionId(null);
		setScreen("home");
	}

	function handleOpenOverview() {
		sectionScrollY.current = window.scrollY;
		scrollToLessonId.current = null;
		setScreen("overview");
	}

	return {
		activeSection,
		handleOpenSection,
		handleOpenLesson,
		handleReturnToSection,
		handleOpenOverviewFromComplete,
		handleBackToHome,
		handleOpenOverview,
	};
}
