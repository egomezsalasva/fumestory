import type { CurriculumSection } from "../../curriculum";
import { AcademyHome } from "./AcademyMap";
import styles from "../../Academy.module.css";

type LandingScreenProps = {
	sections: CurriculumSection[];
	onOpenSection: (sectionId: string) => void;
};

export default function LandingScreen({
	sections,
	onOpenSection,
}: LandingScreenProps) {
	return (
		<section className={styles.quizSection}>
			<AcademyHome sections={sections} onOpenSection={onOpenSection} />
		</section>
	);
}
