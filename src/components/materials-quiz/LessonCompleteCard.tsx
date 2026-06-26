import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";

type LessonCompleteCardProps = {
	lessonStreak: number;
	lives: number;
	maxLives: number;
	onNextLesson: () => void;
};

export default function LessonCompleteCard({
	lessonStreak,
	lives,
	maxLives,
	onNextLesson,
}: LessonCompleteCardProps) {
	return (
		<div className={quizStyles.lessonCompleteCard}>
			<h2 className={quizStyles.lessonCompleteTitle}>Lesson complete</h2>
			<p className={quizStyles.lessonCompleteStreak}>
				Lesson streak: {lessonStreak}
			</p>
			<div
				className={quizStyles.lives}
				aria-label={`${lives} of ${maxLives} lives remaining`}
			>
				{Array.from({ length: maxLives }, (_, index) => (
					<span
						key={index}
						className={`${quizStyles.life} ${
							index < lives ? quizStyles.lifeActive : quizStyles.lifeLost
						}`}
						aria-hidden="true"
					/>
				))}
			</div>
			<div className={quizStyles.gameActions}>
				<button
					type="button"
					className={formStyles.formSubmitButton}
					onClick={onNextLesson}
				>
					Next lesson
				</button>
			</div>
		</div>
	);
}
