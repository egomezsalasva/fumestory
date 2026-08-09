import { useEffect } from "react";
import type { AcademyScreen, LessonPhase } from "./types";

export function useAcademyPlayScroll(options: {
	screen: AcademyScreen;
	phase: LessonPhase;
	quizIndex: number;
	selectedCount: number;
	locked: boolean;
}) {
	const { screen, phase, quizIndex, selectedCount, locked } = options;

	useEffect(() => {
		if (screen !== "play") return;
		if (
			phase !== "learn" &&
			phase !== "quiz" &&
			phase !== "complete" &&
			phase !== "unitComplete"
		)
			return;

		const frame = requestAnimationFrame(() => {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, phase, quizIndex]);

	useEffect(() => {
		if (screen !== "play" || phase !== "quiz") return;
		if (selectedCount === 0 && !locked) return;

		const frame = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				window.scrollTo({
					top: document.documentElement.scrollHeight,
					left: 0,
					behavior: "smooth",
				});
			});
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, phase, selectedCount, locked]);
}
