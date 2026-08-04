import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";
import shared from "./shared.module.css";

type LessonStartOverCardProps = {
	lessonStreak: number;
	maxLives: number;
	onStartOver: () => void;
};

export default function LessonStartOverCard({
	lessonStreak,
	maxLives,
	onStartOver,
}: LessonStartOverCardProps) {
	return (
		<div className={styles.lessonCompleteCard}>
			<h2 className={styles.lessonStartOverTitle}>Out of lives</h2>
			<p className={styles.lessonStreakAchieved}>
				Lesson streak achieved: {lessonStreak}
			</p>
			<p className={styles.lessonStartOverMessage}>
				{lessonStreak > 0
					? "Your streak has ended. Start over to try again."
					: "Start over to begin a new run."}
			</p>
			<div
				className={shared.lives}
				aria-label={`0 of ${maxLives} lives remaining`}
			>
				{Array.from({ length: maxLives }, (_, index) => (
					<span
						key={index}
						className={`${shared.life} ${shared.lifeLost}`}
						aria-hidden="true"
					/>
				))}
			</div>
			<div className={shared.gameActions}>
				<button
					type="button"
					className={formStyles.formSubmitButton}
					onClick={onStartOver}
				>
					Start over
				</button>
			</div>
		</div>
	);
}
