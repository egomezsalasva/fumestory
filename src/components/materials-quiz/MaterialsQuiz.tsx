import { useState } from "react";
import type { MaterialRecord, SourceName } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	LESSON_SIZE,
	generateQuestionForMaterial,
	getProducerMaterials,
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
const LESSONS_PER_LEVEL = 5;
const MAX_LEVEL = 3;

const RELIABLE_SOURCES = new Set<SourceName>([
	"Givaudan",
	"Firmenich",
	"IFF",
	"Symrise",
]);

type LessonPhase = "learn" | "quiz" | "complete" | "gameOver";
type Level = 1 | 2 | 3;

type LessonState = {
	lessonSet: MaterialRecord[];
	learnSequence: MaterialRecord[];
};

function getOptionLetter(index: number): string {
	return OPTION_LETTERS[index] ?? String.fromCharCode(97 + index);
}

function normalizeNote(note: string): string {
	return note.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeMaterialKey(material: MaterialRecord): string {
	return material.canonicalName.trim().toLowerCase();
}

function countReliableNotes(material: MaterialRecord): number {
	const notes = new Set<string>();

	for (const source of material.sources ?? []) {
		if (!RELIABLE_SOURCES.has(source.sourceName)) continue;
		for (const note of source.data?.notes ?? []) {
			notes.add(normalizeNote(String(note)));
		}
	}

	return notes.size;
}

function levelForCompletedLessons(completedLessons: number): Level {
	const computed = Math.floor(completedLessons / LESSONS_PER_LEVEL) + 1;
	return Math.min(MAX_LEVEL, Math.max(1, computed)) as Level;
}

function isMaterialInLevel(material: MaterialRecord, level: Level): boolean {
	const noteCount = countReliableNotes(material);

	if (level === 1) return noteCount < 5;
	if (level === 2) return noteCount >= 5 && noteCount < 10;
	return noteCount >= 10;
}

// Local lesson picker to avoid global source-count filtering in pickRandomMaterials.ts
function pickLessonMaterials(
	pool: MaterialRecord[],
	count: number = LESSON_SIZE,
): MaterialRecord[] {
	if (pool.length < count) {
		throw new Error(
			`Need ${count} lesson materials but only ${pool.length} available`,
		);
	}

	const copy = [...pool];
	const picked: MaterialRecord[] = [];

	for (let i = 0; i < count; i++) {
		const index = Math.floor(Math.random() * copy.length);
		picked.push(copy[index]);
		copy.splice(index, 1);
	}

	return picked;
}

function createLesson(level: Level): LessonState {
	const levelMaterials = materials.filter((m) => isMaterialInLevel(m, level));
	const pool =
		levelMaterials.length >= LESSON_SIZE ? levelMaterials : materials;
	const lessonSet = pickLessonMaterials(pool);

	return {
		lessonSet,
		learnSequence: shuffleMaterials(lessonSet),
	};
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
	const [lesson, setLesson] = useState<LessonState>(() => createLesson(1));
	const [quizSequence, setQuizSequence] = useState<MaterialRecord[]>([]);
	const [learnIndex, setLearnIndex] = useState(0);
	const [quizIndex, setQuizIndex] = useState(0);
	const [question, setQuestion] = useState<QuizQuestion | null>(null);
	const [selected, setSelected] = useState<string | null>(null);

	// Level checkpoint progression (drives level + lesson number).
	const [progressLessons, setProgressLessons] = useState(0);

	// Run streak (carries through levels until game over).
	const [lessonStreak, setLessonStreak] = useState(0);
	const [gameOverStreak, setGameOverStreak] = useState(0);

	const [lives, setLives] = useState(MAX_LIVES);
	const [learnedMaterialKeys, setLearnedMaterialKeys] = useState<Set<string>>(
		() => new Set(),
	);

	const currentLevel = levelForCompletedLessons(progressLessons);
	const currentLessonInLevel = (progressLessons % LESSONS_PER_LEVEL) + 1;
	const currentLevelBaseLessons = (currentLevel - 1) * LESSONS_PER_LEVEL;

	const allReliableMaterialsCount = materials.length;
	const learnedUniqueCount = learnedMaterialKeys.size;

	const isCorrect =
		question !== null &&
		selected !== null &&
		selected.toLowerCase() === question.correctNote.toLowerCase();

	const isLastQuizQuestion = quizIndex >= quizSequence.length - 1;

	function startNewLesson(level: Level = currentLevel) {
		setLesson(createLesson(level));
		setQuizSequence([]);
		setLearnIndex(0);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected(null);
	}

	function completeLesson() {
		setLearnedMaterialKeys((current) => {
			const next = new Set(current);
			for (const material of lesson.lessonSet) {
				next.add(normalizeMaterialKey(material));
			}
			return next;
		});

		setProgressLessons((current) => {
			const next = current + 1;
			const oldLevel = levelForCompletedLessons(current);
			const newLevel = levelForCompletedLessons(next);

			// Restore lives whenever the user enters a new level.
			if (newLevel > oldLevel) {
				setLives(MAX_LIVES);
			}

			return next;
		});

		// Streak is independent from level and only resets on game over.
		setLessonStreak((current) => current + 1);

		setPhase("complete");
		setQuestion(null);
		setSelected(null);
	}

	function handleLearnBack() {
		if (learnIndex > 0) {
			setLearnIndex((current) => current - 1);
		}
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
				// Snapshot streak for game over card, then reset run streak.
				setGameOverStreak(lessonStreak);
				setLessonStreak(0);

				// Keep the same level, but reset to lesson 1 of that level.
				setProgressLessons(currentLevelBaseLessons);

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
		const nextLevel = levelForCompletedLessons(progressLessons);
		startNewLesson(nextLevel);
	}

	function handleStartOver() {
		setGameOverStreak(0);
		setLives(MAX_LIVES);
		setLessonStreak(0);

		// Ensure restart begins at lesson 1 for this same level.
		setProgressLessons(currentLevelBaseLessons);

		startNewLesson(currentLevel);
	}

	const completedLevel =
		progressLessons > 0
			? (Math.min(
					MAX_LEVEL,
					Math.floor((progressLessons - 1) / LESSONS_PER_LEVEL) + 1,
				) as Level)
			: 1;

	const completedLessonInLevel =
		progressLessons > 0 ? ((progressLessons - 1) % LESSONS_PER_LEVEL) + 1 : 1;

	const hasLeveledUp =
		progressLessons > 0 &&
		progressLessons % LESSONS_PER_LEVEL === 0 &&
		completedLevel < MAX_LEVEL;

	const promotedToLevel = hasLeveledUp ? completedLevel + 1 : null;

	const currentLearnMaterial = lesson.learnSequence[learnIndex];

	return (
		<section className={quizStyles.quizSection}>
			<div
				className={`${formStyles.formContainer} ${quizStyles.quizContainer}`}
			>
				{phase === "learn" ? (
					<>
						<LessonLearnCard
							key={normalizeMaterialKey(currentLearnMaterial)}
							material={currentLearnMaterial}
							cardIndex={learnIndex}
							totalCards={lesson.learnSequence.length}
						/>
						<div className={quizStyles.gameActions}>
							{learnIndex > 0 && (
								<button
									type="button"
									className={formStyles.formSubmitButton}
									onClick={handleLearnBack}
								>
									Back
								</button>
							)}
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
						level={completedLevel}
						lessonInLevel={completedLessonInLevel}
						lessonsPerLevel={LESSONS_PER_LEVEL}
						learnedUniqueCount={learnedUniqueCount}
						allReliableMaterialsCount={allReliableMaterialsCount}
						lives={lives}
						maxLives={MAX_LIVES}
						onNextLesson={handleNextLesson}
						promotedToLevel={promotedToLevel}
					/>
				) : phase === "gameOver" ? (
					<LessonStartOverCard
						lessonStreak={gameOverStreak}
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
									{currentLevel === 3
										? `Lesson streak: ${lessonStreak}`
										: `Lesson ${currentLevel} - ${currentLessonInLevel}/${LESSONS_PER_LEVEL}`}
								</p>
							</div>

							<div className={quizStyles.quizMaterialSection}>
								<p
									className={formStyles.formLabel}
									style={{ textAlign: "center" }}
								>
									Raw material
								</p>
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
