import { useState } from "react";
import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	generateQuestion,
	getProducerMaterials,
} from "@/components/materials-quiz/utils";
import { toTitleCaseWords } from "@/utils/display-names";
import QuizAnswerReveal from "./QuizAnswerReveal";

const materials = getProducerMaterials();
const MAX_LIVES = 3;
const OPTION_LETTERS = ["a", "b", "c", "d"] as const;

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
	const [question, setQuestion] = useState(() => generateQuestion(materials));
	const [selected, setSelected] = useState<string | null>(null);
	const [streak, setStreak] = useState(0);
	const [lives, setLives] = useState(MAX_LIVES);

	const isCorrect =
		selected !== null &&
		selected.toLowerCase() === question.correctNote.toLowerCase();

	function handleSelect(option: string) {
		if (selected !== null) return;

		setSelected(option);

		if (option.toLowerCase() === question.correctNote.toLowerCase()) {
			setStreak((current) => current + 1);
		} else {
			if (lives <= 1) {
				setStreak(0);
			}
			setLives((current) => current - 1);
		}
	}

	function handleNext() {
		setQuestion(generateQuestion(materials));
		setSelected(null);
	}

	function handleStartOver() {
		setStreak(0);
		setLives(MAX_LIVES);
		setQuestion(generateQuestion(materials));
		setSelected(null);
	}

	return (
		<section className={quizStyles.quizSection}>
			<div
				className={`${formStyles.formContainer} ${quizStyles.quizContainer}`}
			>
				<div className={quizStyles.gameStatus}>
					<div
						className={quizStyles.lives}
						aria-label={`${lives} of ${MAX_LIVES} lives remaining`}
					>
						{Array.from({ length: MAX_LIVES }, (_, index) => (
							<span
								key={index}
								className={`${quizStyles.life} ${
									index < lives ? quizStyles.lifeActive : quizStyles.lifeLost
								}`}
								aria-hidden="true"
							/>
						))}
					</div>
					<span className={quizStyles.gameStatusDivider} aria-hidden="true" />
					<p className={quizStyles.streak}>Streak: {streak}</p>
				</div>

				<div className={quizStyles.quizMaterialSection}>
					<p className={formStyles.formLabel}>Raw material</p>
					<div className={quizStyles.materialNames}>
						{question.displayNames.map((name) => (
							<h2 key={name} className={quizStyles.materialName}>
								{name}
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
							Next
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
							Next
						</button>
					</div>
				)}

				{selected && !isCorrect && lives === 0 && (
					<div className={quizStyles.gameActions}>
						<button
							type="button"
							className={formStyles.formSubmitButton}
							onClick={handleStartOver}
						>
							Start over
						</button>
					</div>
				)}
			</div>
		</section>
	);
}