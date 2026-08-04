import { useState } from "react";
import type { MaterialRecord, SourceName } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import styles from "./Academy.module.css";
import shared from "./shared.module.css";
import {
	LESSON_SIZE,
	POOL_SIZE,
	applyMasteryDelta,
	generateQuestionForMaterial,
	getMasteryValue,
	getProducerMaterials,
	pickRandomMaterials,
	shuffleMaterials,
	type LessonQuizEvent,
	type MaterialMasteryMap,
	normalizeMaterialKey,
	type QuizQuestion,
} from "@/components/academy/utils";
import { toTitleCaseWords } from "@/utils/display-names";
import LessonCompleteCard from "./LessonCompleteCard";
import LessonPickGrid from "./LessonPickGrid";
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
	pool: MaterialRecord[];
	pickedKeys: string[];
};

type CompleteSnapshot = {
	previousKnownCount: number;
	newKnownCount: number;
	previousLearnedKeys: string[];
	lessonMaterials: MaterialRecord[];
	lessonStartMastery: MaterialMasteryMap;
};

function getOptionLetter(index: number): string {
	return OPTION_LETTERS[index] ?? String.fromCharCode(97 + index);
}

function normalizeNote(note: string): string {
	return note.trim().toLowerCase().replace(/\s+/g, " ");
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

function createLesson(level: Level): LessonState {
	const levelMaterials = materials.filter((m) => isMaterialInLevel(m, level));
	const source =
		levelMaterials.length >= POOL_SIZE ? levelMaterials : materials;

	return {
		pool: pickRandomMaterials(source, POOL_SIZE),
		pickedKeys: [],
	};
}

function getPickedMaterials(lesson: LessonState): MaterialRecord[] {
	return lesson.pickedKeys
		.map((key) =>
			lesson.pool.find((material) => normalizeMaterialKey(material) === key),
		)
		.filter((material): material is MaterialRecord => material != null);
}

function optionClass(
	option: string,
	selected: string | null,
	correctNote: string,
): string {
	const base = `${formStyles.feedbackNoRatingButton} ${styles.optionButton}`;

	if (!selected) {
		return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
	}

	const isCorrectOption = option.toLowerCase() === correctNote.toLowerCase();
	const isSelectedWrong =
		option === selected && selected.toLowerCase() !== correctNote.toLowerCase();

	if (isCorrectOption) {
		return `${base} ${styles.optionCorrect}`;
	}

	if (isSelectedWrong) {
		return `${base} ${styles.optionWrong}`;
	}

	return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
}

export default function Academy() {
	const [phase, setPhase] = useState<LessonPhase>("learn");
	const [lesson, setLesson] = useState<LessonState>(() => createLesson(1));
	const [expandedKey, setExpandedKey] = useState<string | null>(null);
	const [quizSequence, setQuizSequence] = useState<MaterialRecord[]>([]);
	const [quizIndex, setQuizIndex] = useState(0);
	const [question, setQuestion] = useState<QuizQuestion | null>(null);
	const [selected, setSelected] = useState<string | null>(null);

	const [progressLessons, setProgressLessons] = useState(0);
	const [lessonStreak, setLessonStreak] = useState(0);
	const [gameOverStreak, setGameOverStreak] = useState(0);
	const [lives, setLives] = useState(MAX_LIVES);

	const [learnedMaterialKeys, setLearnedMaterialKeys] = useState<Set<string>>(
		() => new Set(),
	);
	const [materialMastery, setMaterialMastery] = useState<MaterialMasteryMap>(
		{},
	);
	const [lessonStartMastery, setLessonStartMastery] =
		useState<MaterialMasteryMap>({});
	const [lessonQuizEvents, setLessonQuizEvents] = useState<LessonQuizEvent[]>(
		[],
	);
	const [completeSnapshot, setCompleteSnapshot] =
		useState<CompleteSnapshot | null>(null);

	const currentLevel = levelForCompletedLessons(progressLessons);
	const currentLessonInLevel = (progressLessons % LESSONS_PER_LEVEL) + 1;
	const currentLevelBaseLessons = (currentLevel - 1) * LESSONS_PER_LEVEL;

	const allReliableMaterialsCount = materials.length;
	const picksReady = lesson.pickedKeys.length >= LESSON_SIZE;

	const isCorrect =
		question !== null &&
		selected !== null &&
		selected.toLowerCase() === question.correctNote.toLowerCase();

	const isLastQuizQuestion = quizIndex >= quizSequence.length - 1;

	function startNewLesson(level: Level = currentLevel) {
		setLesson(createLesson(level));
		setExpandedKey(null);
		setQuizSequence([]);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected(null);
		setLessonStartMastery({});
		setLessonQuizEvents([]);
		setCompleteSnapshot(null);
	}

	function completeLesson() {
		const quizMaterials = getPickedMaterials(lesson);
		const previousKnownCount = learnedMaterialKeys.size;
		const nextLearnedKeys = new Set(learnedMaterialKeys);

		for (const material of quizMaterials) {
			nextLearnedKeys.add(normalizeMaterialKey(material));
		}

		setCompleteSnapshot({
			previousKnownCount,
			newKnownCount: nextLearnedKeys.size,
			previousLearnedKeys: [...learnedMaterialKeys],
			lessonMaterials: quizMaterials,
			lessonStartMastery,
		});

		setLearnedMaterialKeys(nextLearnedKeys);

		setProgressLessons((current) => {
			const next = current + 1;
			const oldLevel = levelForCompletedLessons(current);
			const newLevel = levelForCompletedLessons(next);

			if (newLevel > oldLevel) {
				setLives(MAX_LIVES);
			}

			return next;
		});

		setLessonStreak((current) => current + 1);
		setPhase("complete");
		setQuestion(null);
		setSelected(null);
	}

	function handleToggleMaterial(material: MaterialRecord) {
		const key = normalizeMaterialKey(material);
		const alreadyPicked = lesson.pickedKeys.includes(key);
		const picksFull = lesson.pickedKeys.length >= LESSON_SIZE;

		if (expandedKey === key) {
			setExpandedKey(null);
			return;
		}

		if (picksFull && !alreadyPicked) return;

		setLesson((current) => {
			if (current.pickedKeys.includes(key)) return current;
			if (current.pickedKeys.length >= LESSON_SIZE) return current;
			return {
				...current,
				pickedKeys: [...current.pickedKeys, key],
			};
		});
		setExpandedKey(key);
	}

	function handleStartQuiz() {
		const quizMaterials = getPickedMaterials(lesson);
		if (quizMaterials.length < LESSON_SIZE) return;

		const startMastery: MaterialMasteryMap = {};
		for (const material of quizMaterials) {
			const key = normalizeMaterialKey(material);
			startMastery[key] = getMasteryValue(materialMastery, key);
		}

		const sequence = shuffleMaterials(quizMaterials);
		setExpandedKey(null);
		setQuizSequence(sequence);
		setQuizIndex(0);
		setLessonStartMastery(startMastery);
		setLessonQuizEvents([]);
		setPhase("quiz");
		setQuestion(generateQuestionForMaterial(sequence[0], materials));
		setSelected(null);
	}

	function handleSelect(option: string) {
		if (selected !== null || question === null) return;

		setSelected(option);

		const isAnswerCorrect =
			option.toLowerCase() === question.correctNote.toLowerCase();
		const materialKey = normalizeMaterialKey(question.material);
		const delta: 1 | -1 = isAnswerCorrect ? 1 : -1;

		setMaterialMastery((current) =>
			applyMasteryDelta(current, materialKey, delta),
		);
		setLessonQuizEvents((current) => [...current, { materialKey, delta }]);

		if (!isAnswerCorrect) {
			const nextLives = lives - 1;
			setLives(nextLives);

			if (nextLives === 0) {
				setGameOverStreak(lessonStreak);
				setLessonStreak(0);
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

	return (
		<section className={styles.quizSection}>
			<div className={`${formStyles.formContainer} ${styles.quizContainer}`}>
				{phase === "learn" ? (
					<>
						<h2 className={styles.learnProgress}>
							Pick 3 Material Cards to Study
						</h2>
						<LessonPickGrid
							materials={lesson.pool}
							pickedKeys={lesson.pickedKeys}
							expandedKey={expandedKey}
							onToggle={handleToggleMaterial}
						/>
						{picksReady && !expandedKey ? (
							<div className={shared.gameActions}>
								<button
									type="button"
									className={formStyles.formSubmitButton}
									onClick={handleStartQuiz}
								>
									Start quiz
								</button>
							</div>
						) : null}
					</>
				) : phase === "complete" && completeSnapshot ? (
					<LessonCompleteCard
						level={completedLevel}
						lessonInLevel={completedLessonInLevel}
						lessonsPerLevel={LESSONS_PER_LEVEL}
						previousKnownCount={completeSnapshot.previousKnownCount}
						knownMaterialsCount={completeSnapshot.newKnownCount}
						allReliableMaterialsCount={allReliableMaterialsCount}
						materials={materials}
						learnedMaterialKeys={learnedMaterialKeys}
						previousLearnedKeys={new Set(completeSnapshot.previousLearnedKeys)}
						lessonMaterials={completeSnapshot.lessonMaterials}
						lessonStartMastery={completeSnapshot.lessonStartMastery}
						materialMastery={materialMastery}
						lessonQuizEvents={lessonQuizEvents}
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
							<div className={styles.gameStatus}>
								<div
									className={shared.lives}
									aria-label={`${lives} of ${MAX_LIVES} lives remaining`}
								>
									{Array.from({ length: MAX_LIVES }, (_, index) => (
										<span
											key={index}
											className={`${shared.life} ${
												index < lives ? shared.lifeActive : shared.lifeLost
											}`}
											aria-hidden="true"
										/>
									))}
								</div>
								<span className={styles.gameStatusDivider} aria-hidden="true" />
								<p className={styles.streak}>
									{currentLevel === 3
										? `Lesson streak: ${lessonStreak}`
										: `Lesson ${currentLevel} - ${currentLessonInLevel}/${LESSONS_PER_LEVEL}`}
								</p>
							</div>

							<div className={styles.quizMaterialSection}>
								<p
									className={formStyles.formLabel}
									style={{ textAlign: "center" }}
								>
									Raw material
								</p>
								<div className={shared.materialNames}>
									{question.displayNames.map((name) => (
										<h2 key={name} className={shared.materialName}>
											{toTitleCaseWords(name)}
										</h2>
									))}
								</div>
								<p className={shared.materialCas}>
									CAS: {question.material.cas?.join(", ") ?? "—"}
								</p>
								{question.material.olfactiveFamily ? (
									<p className={shared.materialFamily}>
										{question.material.olfactiveFamily
											.map(toTitleCaseWords)
											.join(" · ")}
									</p>
								) : null}
							</div>

							<div className={styles.quizOptionsSection}>
								<p className={styles.prompt}>
									Which note belongs to this material?
								</p>
								<ul className={styles.options}>
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
												<span className={styles.optionLetter}>
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
								<div className={shared.gameActions}>
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
								<div className={shared.gameActions}>
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
