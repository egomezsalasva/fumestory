import formStyles from "@/components/Form.module.css";
import academyStyles from "./Academy.module.css";

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
		<div className={academyStyles.lessonCompleteCard}>
			<h2 className={academyStyles.lessonStartOverTitle}>Out of lives</h2>
			<p className={academyStyles.lessonStreakAchieved}>
				Lesson streak achieved: {lessonStreak}
			</p>
			<p className={academyStyles.lessonStartOverMessage}>
				{lessonStreak > 0
					? "Your streak has ended. Start over to try again."
					: "Start over to begin a new run."}
			</p>
			<div
				className={academyStyles.lives}
				aria-label={`0 of ${maxLives} lives remaining`}
			>
				{Array.from({ length: maxLives }, (_, index) => (
					<span
						key={index}
						className={`${academyStyles.life} ${academyStyles.lifeLost}`}
						aria-hidden="true"
					/>
				))}
			</div>
			<div className={academyStyles.gameActions}>
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
