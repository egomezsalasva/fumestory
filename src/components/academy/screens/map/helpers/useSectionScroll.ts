import { useEffect, useRef } from "react";
import type { CurriculumSection } from "../../../curriculum";
import type { AcademyScreen } from "../../../session/types";

export function useSectionScroll(
	screen: AcademyScreen,
	curriculum: CurriculumSection[],
) {
	const sectionScrollY = useRef(0);
	const scrollToLessonId = useRef<string | null>(null);

	useEffect(() => {
		if (screen !== "section") return;

		const lessonId = scrollToLessonId.current;
		if (lessonId) {
			scrollToLessonId.current = null;
			const frame = requestAnimationFrame(() => {
				document.getElementById(lessonId)?.scrollIntoView({
					block: "center",
					behavior: "auto",
				});
			});
			return () => cancelAnimationFrame(frame);
		}

		const y = sectionScrollY.current;
		const frame = requestAnimationFrame(() => {
			window.scrollTo({ top: y, left: 0, behavior: "auto" });
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, curriculum]);

	return { sectionScrollY, scrollToLessonId };
}
