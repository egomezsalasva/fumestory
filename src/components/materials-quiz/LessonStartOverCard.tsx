import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";

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
		<div className={quizStyles.lessonCompleteCard}>
			<h2 className={quizStyles.lessonStartOverTitle}>Out of lives</h2>
			<p className={quizStyles.lessonStreakAchieved}>
				Lesson streak achieved: {lessonStreak}
			</p>
			<p className={quizStyles.lessonStartOverMessage}>
				{lessonStreak > 0
					? "Your streak has ended. Start over to try again."
					: "Start over to begin a new run."}
			</p>
			<div
				className={quizStyles.lives}
				aria-label={`0 of ${maxLives} lives remaining`}
			>
				{Array.from({ length: maxLives }, (_, index) => (
					<span
						key={index}
						className={`${quizStyles.life} ${quizStyles.lifeLost}`}
						aria-hidden="true"
					/>
				))}
			</div>
			<div className={quizStyles.gameActions}>
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
