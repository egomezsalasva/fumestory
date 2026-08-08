import type { CurriculumSection } from "../../curriculum";
import { AcademySectionView } from "./AcademyMap";
import styles from "../../Academy.module.css";

type MapScreenProps = {
	section: CurriculumSection;
	sections: CurriculumSection[];
	onBack: () => void;
	onOpenOverview: () => void;
	onOpenLesson: (lessonId: string) => void;
};

export default function MapScreen({
	section,
	sections,
	onBack,
	onOpenOverview,
	onOpenLesson,
}: MapScreenProps) {
	return (
		<section className={styles.quizSection}>
			<AcademySectionView
				section={section}
				sections={sections}
				onBack={onBack}
				onOpenOverview={onOpenOverview}
				onOpenLesson={onOpenLesson}
			/>
		</section>
	);
}
