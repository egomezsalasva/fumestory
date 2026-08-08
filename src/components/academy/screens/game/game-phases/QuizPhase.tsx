import type { QuizQuestion } from "@/components/academy/utils";
import {
	getMaterialProducerSources,
	getSourceCardKey,
} from "@/components/academy/utils";
import formStyles from "@/components/Form.module.css";
import ProducerLogo from "@/components/svgs/ProducerLogo";
import { toTitleCaseWords } from "@/utils/display-names";
import QuizAnswerReveal from "../QuizAnswerReveal";
import {
	getOptionLetter,
	isSelectionCorrect,
	optionClass,
} from "../../../session/quizSelection";
import styles from "../../../Academy.module.css";
import shared from "../../../shared.module.css";

type QuizPhaseProps = {
	question: QuizQuestion;
	quizIndex: number;
	selected: string[];
	locked: boolean;
	lives: number;
	maxLives: number;
	isLastQuizQuestion: boolean;
	onToggleOption: (option: string) => void;
	onNext: () => void;
};

export default function QuizPhase({
	question,
	quizIndex,
	selected,
	locked,
	lives,
	maxLives,
	isLastQuizQuestion,
	onToggleOption,
	onNext,
}: QuizPhaseProps) {
	const requiredCount = question.format.correct;
	const isCorrect =
		locked && isSelectionCorrect(selected, question.correctNotes);

	return (
		<>
			<div className={styles.gameStatus}>
				<div
					className={shared.lives}
					aria-label={`${lives} of ${maxLives} lives remaining`}
				>
					{Array.from({ length: maxLives }, (_, index) => (
						<span
							key={index}
							className={`${shared.life} ${
								index < lives ? shared.lifeActive : shared.lifeLost
							}`}
							aria-hidden="true"
						/>
					))}
				</div>
			</div>

			<div className={styles.quizMaterialSection}>
				<div className={shared.materialNames}>
					{question.displayNames.map((name) => (
						<h2 key={name} className={shared.materialName}>
							{toTitleCaseWords(name)}
						</h2>
					))}
				</div>
				<div
					className={`${shared.producerLogos} ${shared.producerLogosReveal}`}
					aria-hidden="true"
				>
					{getMaterialProducerSources(question.material).map((source) => (
						<ProducerLogo
							key={getSourceCardKey(source)}
							sourceName={source.sourceName}
						/>
					))}
				</div>
			</div>

			<div className={styles.quizOptionsSection}>
				<p
					key={quizIndex}
					className={styles.prompt}
					data-settled={selected.length > 0 || locked ? "true" : "false"}
				>
					{requiredCount === 1
						? "Which note belongs to this material?"
						: `Select ${requiredCount} notes that belong to this material (${selected.length}/${requiredCount})`}
				</p>
				<ul className={styles.options}>
					{question.options.map((option, index) => (
						<li key={option}>
							<button
								type="button"
								className={optionClass(
									option,
									selected,
									question.correctNotes,
									locked,
								)}
								disabled={locked}
								onClick={() => onToggleOption(option)}
							>
								<span className={styles.optionLetter}>
									{getOptionLetter(index)})
								</span>
								{toTitleCaseWords(option)}
							</button>
						</li>
					))}
				</ul>
			</div>

			{locked && !isCorrect ? (
				<QuizAnswerReveal
					material={question.material}
					correctNotes={question.correctNotes}
				/>
			) : null}

			{locked && isCorrect ? (
				<div className={shared.gameActions}>
					<button
						type="button"
						className={formStyles.formSubmitButton}
						onClick={onNext}
					>
						{isLastQuizQuestion ? "Finish" : "Next"}
					</button>
				</div>
			) : null}

			{locked && !isCorrect && lives > 0 ? (
				<div className={shared.gameActions}>
					<button
						type="button"
						className={formStyles.formSubmitButton}
						onClick={onNext}
					>
						{isLastQuizQuestion ? "Finish" : "Next"}
					</button>
				</div>
			) : null}
		</>
	);
}
