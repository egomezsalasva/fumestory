import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import LessonPickGrid from "../LessonPickGrid";
import styles from "../../../Academy.module.css";
import shared from "../../../shared.module.css";

type CardPickPhaseProps = {
	pool: MaterialRecord[];
	pickedKeys: string[];
	expandedKey: string | null;
	lessonSize: number;
	picksReady: boolean;
	onToggle: (material: MaterialRecord) => void;
	onStartQuiz: () => void;
};

export default function CardPickPhase({
	pool,
	pickedKeys,
	expandedKey,
	lessonSize,
	picksReady,
	onToggle,
	onStartQuiz,
}: CardPickPhaseProps) {
	return (
		<>
			<h2 className={styles.learnProgress}>
				Pick {lessonSize} Material Card{lessonSize === 1 ? "" : "s"}
			</h2>
			<LessonPickGrid
				materials={pool}
				pickedKeys={pickedKeys}
				expandedKey={expandedKey}
				lessonSize={lessonSize}
				onToggle={onToggle}
			/>
			{picksReady && !expandedKey ? (
				<div className={shared.gameActions}>
					<button
						type="button"
						className={formStyles.formSubmitButton}
						onClick={onStartQuiz}
					>
						Start quiz
					</button>
				</div>
			) : null}
		</>
	);
}
