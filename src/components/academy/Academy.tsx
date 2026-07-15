import { useState } from "react";
import type { MaterialRecord, SourceName } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import academyStyles from "./Academy.module.css";
import {
	LESSON_SIZE,
	applyMasteryDelta,
	generateQuestionForMaterial,
	getMasteryValue,
	getProducerMaterials,
	shuffleMaterials,
	type LessonQuizEvent,
	type MaterialMasteryMap,
	normalizeMaterialKey,
	type QuizQuestion,
} from "@/components/academy/utils";
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

type CompleteSnapshot = {
	previousKnownCount: number;
	newKnownCount: number;
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
	const base = `${formStyles.feedbackNoRatingButton} ${academyStyles.optionButton}`;

	if (!selected) {
		return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
	}

	const isCorrectOption = option.toLowerCase() === correctNote.toLowerCase();
	const isSelectedWrong =
		option === selected && selected.toLowerCase() !== correctNote.toLowerCase();

	if (isCorrectOption) {
		return `${base} ${academyStyles.optionCorrect}`;
	}

	if (isSelectedWrong) {
		return `${base} ${academyStyles.optionWrong}`;
	}

	return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
}

export default function Academy() {
	const [phase, setPhase] = useState<LessonPhase>("learn");
	const [lesson, setLesson] = useState<LessonState>(() => createLesson(1));
	const [quizSequence, setQuizSequence] = useState<MaterialRecord[]>([]);
	const [learnIndex, setLearnIndex] = useState(0);
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
		setLessonStartMastery({});
		setLessonQuizEvents([]);
		setCompleteSnapshot(null);
	}

	function completeLesson() {
		const previousKnownCount = learnedMaterialKeys.size;
		const nextLearnedKeys = new Set(learnedMaterialKeys);

		for (const material of lesson.lessonSet) {
			nextLearnedKeys.add(normalizeMaterialKey(material));
		}

		setCompleteSnapshot({
			previousKnownCount,
			newKnownCount: nextLearnedKeys.size,
			lessonMaterials: lesson.lessonSet,
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

		const startMastery: MaterialMasteryMap = {};
		for (const material of lesson.lessonSet) {
			const key = normalizeMaterialKey(material);
			startMastery[key] = getMasteryValue(materialMastery, key);
		}

		const sequence = shuffleMaterials(lesson.lessonSet);
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
	const currentLearnMaterial = lesson.learnSequence[learnIndex];

	return (
		<section className={academyStyles.quizSection}>
			<div
				className={`${formStyles.formContainer} ${academyStyles.quizContainer}`}
			>
				{phase === "learn" ? (
					<>
						<LessonLearnCard
							key={normalizeMaterialKey(currentLearnMaterial)}
							material={currentLearnMaterial}
							cardIndex={learnIndex}
							totalCards={lesson.learnSequence.length}
						/>
						<div className={academyStyles.gameActions}>
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
				) : phase === "complete" && completeSnapshot ? (
					<LessonCompleteCard
						level={completedLevel}
						lessonInLevel={completedLessonInLevel}
						lessonsPerLevel={LESSONS_PER_LEVEL}
						previousKnownCount={completeSnapshot.previousKnownCount}
						knownMaterialsCount={completeSnapshot.newKnownCount}
						allReliableMaterialsCount={allReliableMaterialsCount}
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
							<div className={academyStyles.gameStatus}>
								<div
									className={academyStyles.lives}
									aria-label={`${lives} of ${MAX_LIVES} lives remaining`}
								>
									{Array.from({ length: MAX_LIVES }, (_, index) => (
										<span
											key={index}
											className={`${academyStyles.life} ${
												index < lives
													? academyStyles.lifeActive
													: academyStyles.lifeLost
											}`}
											aria-hidden="true"
										/>
									))}
								</div>
								<span
									className={academyStyles.gameStatusDivider}
									aria-hidden="true"
								/>
								<p className={academyStyles.streak}>
									{currentLevel === 3
										? `Lesson streak: ${lessonStreak}`
										: `Lesson ${currentLevel} - ${currentLessonInLevel}/${LESSONS_PER_LEVEL}`}
								</p>
							</div>

							<div className={academyStyles.quizMaterialSection}>
								<p
									className={formStyles.formLabel}
									style={{ textAlign: "center" }}
								>
									Raw material
								</p>
								<div className={academyStyles.materialNames}>
									{question.displayNames.map((name) => (
										<h2 key={name} className={academyStyles.materialName}>
											{toTitleCaseWords(name)}
										</h2>
									))}
								</div>
								<p className={academyStyles.materialCas}>
									CAS: {question.material.cas?.join(", ") ?? "—"}
								</p>
							</div>

							<div className={academyStyles.quizOptionsSection}>
								<p className={academyStyles.prompt}>
									Which note belongs to this material?
								</p>
								<ul className={academyStyles.options}>
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
												<span className={academyStyles.optionLetter}>
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
								<div className={academyStyles.gameActions}>
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
								<div className={academyStyles.gameActions}>
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
