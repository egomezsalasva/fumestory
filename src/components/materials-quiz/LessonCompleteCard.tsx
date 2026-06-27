import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";

type LessonCompleteCardProps = {
	level: number;
	lessonInLevel: number;
	lessonsPerLevel: number;
	learnedUniqueCount: number;
	allReliableMaterialsCount: number;
	lives: number;
	maxLives: number;
	onNextLesson: () => void;
	promotedToLevel: number | null;
};

export default function LessonCompleteCard({
	level,
	lessonInLevel,
	lessonsPerLevel,
	learnedUniqueCount,
	allReliableMaterialsCount,
	lives,
	maxLives,
	onNextLesson,
	promotedToLevel,
}: LessonCompleteCardProps) {
	return (
		<div className={quizStyles.lessonCompleteCard}>
			<h2 className={quizStyles.lessonCompleteTitle}>Lesson Complete!</h2>
			<div className={quizStyles.lessonCompleteMeta}>
				<p className={quizStyles.lessonCompleteLevel}>Level {level}</p>
				<p className={quizStyles.lessonCompleteStreak}>
					Lesson {lessonInLevel}/{lessonsPerLevel}
				</p>
			</div>
			{promotedToLevel ? (
				<p className={quizStyles.lessonCompleteStreak}>
					Congrats! You moved up to level {promotedToLevel}!
				</p>
			) : null}
			<p className={quizStyles.lessonStartOverMessage}>
				You now know {learnedUniqueCount}/{allReliableMaterialsCount} materials.
				Great job, let's keep learning.
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
