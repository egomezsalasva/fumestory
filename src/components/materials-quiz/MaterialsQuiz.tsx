import { useState } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	generateQuestionForMaterial,
	getProducerMaterials,
	pickRandomMaterials,
	shuffleMaterials,
	type QuizQuestion,
} from "@/components/materials-quiz/utils";
import { toTitleCaseWords } from "@/utils/display-names";
import LessonCompleteCard from "./LessonCompleteCard";
import LessonLearnCard from "./LessonLearnCard";
import LessonStartOverCard from "./LessonStartOverCard";
import QuizAnswerReveal from "./QuizAnswerReveal";

const materials = getProducerMaterials();
const MAX_LIVES = 3;
const OPTION_LETTERS = ["a", "b", "c", "d"] as const;

type LessonPhase = "learn" | "quiz" | "complete" | "gameOver";

type LessonState = {
	lessonSet: MaterialRecord[];
	learnSequence: MaterialRecord[];
};

function createLesson(): LessonState {
	const lessonSet = pickRandomMaterials(materials);
	return {
		lessonSet,
		learnSequence: shuffleMaterials(lessonSet),
	};
}

function getOptionLetter(index: number): string {
	return OPTION_LETTERS[index] ?? String.fromCharCode(97 + index);
}

function optionClass(
	option: string,
	selected: string | null,
	correctNote: string,
): string {
	const base = `${formStyles.feedbackNoRatingButton} ${quizStyles.optionButton}`;

	if (!selected) {
		return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
	}

	const isCorrectOption = option.toLowerCase() === correctNote.toLowerCase();
	const isSelectedWrong =
		option === selected && selected.toLowerCase() !== correctNote.toLowerCase();

	if (isCorrectOption) {
		return `${base} ${quizStyles.optionCorrect}`;
	}

	if (isSelectedWrong) {
		return `${base} ${quizStyles.optionWrong}`;
	}

	return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
}

export default function MaterialsQuiz() {
	const [phase, setPhase] = useState<LessonPhase>("learn");
	const [lesson, setLesson] = useState<LessonState>(createLesson);
	const [quizSequence, setQuizSequence] = useState<MaterialRecord[]>([]);
	const [learnIndex, setLearnIndex] = useState(0);
	const [quizIndex, setQuizIndex] = useState(0);
	const [question, setQuestion] = useState<QuizQuestion | null>(null);
	const [selected, setSelected] = useState<string | null>(null);
	const [lessonStreak, setLessonStreak] = useState(0);
	const [lives, setLives] = useState(MAX_LIVES);

	const isCorrect =
		question !== null &&
		selected !== null &&
		selected.toLowerCase() === question.correctNote.toLowerCase();

	const isLastQuizQuestion = quizIndex >= quizSequence.length - 1;

	function startNewLesson() {
		setLesson(createLesson());
		setQuizSequence([]);
		setLearnIndex(0);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected(null);
	}

	function completeLesson() {
		setLessonStreak((current) => current + 1);
		setPhase("complete");
		setQuestion(null);
		setSelected(null);
	}

	function handleLearnNext() {
		if (learnIndex < lesson.learnSequence.length - 1) {
			setLearnIndex((current) => current + 1);
			return;
		}

		const sequence = shuffleMaterials(lesson.lessonSet);
		setQuizSequence(sequence);
		setQuizIndex(0);
		setPhase("quiz");
		setQuestion(generateQuestionForMaterial(sequence[0], materials));
		setSelected(null);
	}

	function handleSelect(option: string) {
		if (selected !== null || question === null) return;

		setSelected(option);

		if (option.toLowerCase() !== question.correctNote.toLowerCase()) {
			const nextLives = lives - 1;
			setLives(nextLives);

			if (nextLives === 0) {
				setPhase("gameOver");
				setQuestion(null);
				setSelected(null);
			}
		}
	}

	function handleNext() {
		if (question === null) return;

		const nextIndex = quizIndex + 1;

		if (nextIndex >= quizSequence.length) {
			if (lives > 0) {
				completeLesson();
			}
			return;
		}

		setQuizIndex(nextIndex);
		setQuestion(
			generateQuestionForMaterial(quizSequence[nextIndex], materials),
		);
		setSelected(null);
	}

	function handleNextLesson() {
		startNewLesson();
	}

	function handleStartOver() {
		setLessonStreak(0);
		setLives(MAX_LIVES);
		startNewLesson();
	}

	return (
		<section className={quizStyles.quizSection}>
			<div
				className={`${formStyles.formContainer} ${quizStyles.quizContainer}`}
			>
				{phase === "learn" ? (
					<>
						<LessonLearnCard
							material={lesson.learnSequence[learnIndex]}
							cardIndex={learnIndex}
							totalCards={lesson.learnSequence.length}
						/>
						<div className={quizStyles.gameActions}>
							<button
								type="button"
								className={formStyles.formSubmitButton}
								onClick={handleLearnNext}
							>
								{learnIndex < lesson.learnSequence.length - 1
									? "Next"
									: "Start quiz"}
							</button>
						</div>
					</>
				) : phase === "complete" ? (
					<LessonCompleteCard
						lessonStreak={lessonStreak}
						lives={lives}
						maxLives={MAX_LIVES}
						onNextLesson={handleNextLesson}
					/>
				) : phase === "gameOver" ? (
					<LessonStartOverCard
						lessonStreak={lessonStreak}
						maxLives={MAX_LIVES}
						onStartOver={handleStartOver}
					/>
				) : (
					question && (
						<>
							<div className={quizStyles.gameStatus}>
								<div
									className={quizStyles.lives}
									aria-label={`${lives} of ${MAX_LIVES} lives remaining`}
								>
									{Array.from({ length: MAX_LIVES }, (_, index) => (
										<span
											key={index}
											className={`${quizStyles.life} ${
												index < lives
													? quizStyles.lifeActive
													: quizStyles.lifeLost
											}`}
											aria-hidden="true"
										/>
									))}
								</div>
								<span
									className={quizStyles.gameStatusDivider}
									aria-hidden="true"
								/>
								<p className={quizStyles.streak}>
									Lesson streak: {lessonStreak}
								</p>
							</div>

							<div className={quizStyles.quizMaterialSection}>
								<p className={formStyles.formLabel}>Raw material</p>
								<div className={quizStyles.materialNames}>
									{question.displayNames.map((name) => (
										<h2 key={name} className={quizStyles.materialName}>
											{toTitleCaseWords(name)}
										</h2>
									))}
								</div>
								<p className={quizStyles.materialCas}>
									CAS: {question.material.cas?.join(", ") ?? "—"}
								</p>
							</div>

							<div className={quizStyles.quizOptionsSection}>
								<p className={quizStyles.prompt}>
									Which note belongs to this material?
								</p>
								<ul className={quizStyles.options}>
									{question.options.map((option, index) => (
										<li key={option}>
											<button
												type="button"
												className={optionClass(
													option,
													selected,
													question.correctNote,
												)}
												disabled={selected !== null}
												onClick={() => handleSelect(option)}
											>
												<span className={quizStyles.optionLetter}>
													{getOptionLetter(index)})
												</span>
												{toTitleCaseWords(option)}
											</button>
										</li>
									))}
								</ul>
							</div>

							{selected && (
								<QuizAnswerReveal
									material={question.material}
									correctNote={question.correctNote}
								/>
							)}

							{selected && isCorrect && (
								<div className={quizStyles.gameActions}>
									<button
										type="button"
										className={formStyles.formSubmitButton}
										onClick={handleNext}
									>
										{isLastQuizQuestion ? "Finish" : "Next"}
									</button>
								</div>
							)}

							{selected && !isCorrect && lives > 0 && (
								<div className={quizStyles.gameActions}>
									<button
										type="button"
										className={formStyles.formSubmitButton}
										onClick={handleNext}
									>
										{isLastQuizQuestion ? "Finish" : "Next"}
									</button>
								</div>
							)}
						</>
					)
				)}
			</div>
		</section>
	);
}
