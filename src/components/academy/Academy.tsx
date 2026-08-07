import { useEffect, useRef, useState } from "react";
import type { MaterialRecord, SourceName } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import styles from "./Academy.module.css";
import shared from "./shared.module.css";
import {
	POOL_SIZE,
	applyMasteryDelta,
	filterLessonMaterials,
	generateQuestionForMaterial,
	getMasteryValue,
	getMaterialProducerSources,
	getProducerMaterials,
	getSourceCardKey,
	lessonFormatForLesson,
	materialMeetsMinNotes,
	pickRandomMaterials,
	quizFormatForLesson,
	shuffleMaterials,
	type LessonQuizEvent,
	type MaterialMasteryMap,
	normalizeMaterialKey,
	type QuizQuestion,
} from "@/components/academy/utils";
import { toTitleCaseWords } from "@/utils/display-names";
import ProducerLogo from "@/components/svgs/ProducerLogo";
import {
	applyLessonPass,
	buildCurriculum,
	findLatestUnlockedLessonId,
	findLesson,
	findSection,
} from "./curriculum";
import { AcademyHome, AcademySectionView } from "./AcademyMap";
import LessonCompleteCard from "./LessonCompleteCard";
import LessonPickGrid from "./LessonPickGrid";
import LessonStartOverCard from "./LessonStartOverCard";
import MaterialsOverview from "./MaterialsOverview";
import QuizAnswerReveal from "./QuizAnswerReveal";

const materials = getProducerMaterials();
const MAX_LIVES = 5;
const OPTION_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const LESSONS_PER_LEVEL = 5;
const MAX_LEVEL = 3;

const INITIAL_UNIT = "Florals";
const INITIAL_LESSON_INDEX = 1;
const INITIAL_FORMAT = lessonFormatForLesson(
	INITIAL_UNIT,
	INITIAL_LESSON_INDEX,
);

const RELIABLE_SOURCES = new Set<SourceName>([
	"Givaudan",
	"Firmenich",
	"IFF",
	"Symrise",
]);

type AcademyScreen = "home" | "section" | "overview" | "play";
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

function noteKey(note: string): string {
	return note.toLowerCase();
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

function getMaterialFamily(material: MaterialRecord): string | null {
	const family = material.olfactiveFamily?.[0]?.trim().toLowerCase();
	return family || null;
}

function materialInFamilies(
	material: MaterialRecord,
	families: string[],
): boolean {
	const family = getMaterialFamily(material);
	return family != null && families.includes(family);
}

function levelForCompletedLessons(completedLessons: number): Level {
	const computed = Math.floor(completedLessons / LESSONS_PER_LEVEL) + 1;
	return Math.min(MAX_LEVEL, Math.max(1, computed)) as Level;
}

function isMaterialInLevel(material: MaterialRecord, level: Level): boolean {
	const noteCount = countReliableNotes(material);

	if (level === 1) return noteCount <= 5;
	if (level === 2) return noteCount > 5 && noteCount < 10;
	return noteCount >= 10;
}

function pickUpTo(pool: MaterialRecord[], count: number): MaterialRecord[] {
	if (count <= 0 || pool.length === 0) return [];
	return pickRandomMaterials(pool, Math.min(count, pool.length));
}

/**
 * Up to 6 from focus; fill to POOL_SIZE (9) from leftover focus + earlier families
 * (so ~3 can be prior categories). Filtered by level + minNotes for this rung.
 */
function createLesson(
	level: Level,
	families: string[],
	focusFamily: string,
	lessonSize: number,
	minNotes: number,
): LessonState {
	const eligible = filterLessonMaterials(
		materials.filter(
			(material) =>
				isMaterialInLevel(material, level) &&
				materialInFamilies(material, families) &&
				materialMeetsMinNotes(material, minNotes),
		),
	);

	if (eligible.length < lessonSize) {
		return { pool: [], pickedKeys: [] };
	}

	const poolSize = Math.min(POOL_SIZE, eligible.length);
	const focusPool = eligible.filter(
		(material) => getMaterialFamily(material) === focusFamily,
	);
	const priorPool = eligible.filter(
		(material) => getMaterialFamily(material) !== focusFamily,
	);

	const focusCount = Math.min(6, focusPool.length, poolSize);
	const focusPicked = pickUpTo(focusPool, focusCount);
	const focusKeys = new Set(focusPicked.map(normalizeMaterialKey));

	const fillPool = [
		...focusPool.filter(
			(material) => !focusKeys.has(normalizeMaterialKey(material)),
		),
		...priorPool,
	];
	const need = Math.max(0, poolSize - focusPicked.length);
	const rest = pickUpTo(fillPool, need);

	return {
		pool: shuffleMaterials([...focusPicked, ...rest]),
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

function isSelectionCorrect(
	selected: string[],
	correctNotes: string[],
): boolean {
	if (selected.length !== correctNotes.length) return false;
	const correctKeys = new Set(correctNotes.map(noteKey));
	return selected.every((note) => correctKeys.has(noteKey(note)));
}

function optionClass(
	option: string,
	selected: string[],
	correctNotes: string[],
	locked: boolean,
): string {
	const base = `${formStyles.feedbackNoRatingButton} ${styles.optionButton}`;
	const isPicked = selected.some((note) => noteKey(note) === noteKey(option));
	const isCorrectOption = correctNotes.some(
		(note) => noteKey(note) === noteKey(option),
	);

	if (!locked) {
		if (isPicked) {
			return `${base} ${formStyles.feedbackNoRatingButtonActive}`;
		}
		return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
	}

	if (isCorrectOption) {
		return `${base} ${styles.optionCorrect}`;
	}

	if (isPicked && !isCorrectOption) {
		return `${base} ${styles.optionWrong}`;
	}

	return `${base} ${formStyles.feedbackNoRatingButtonInactive} ${styles.optionDimmed}`;
}

export default function Academy() {
	const [screen, setScreen] = useState<AcademyScreen>("home");
	const [curriculum, setCurriculum] = useState(() => buildCurriculum());
	const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
	const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
	const [activeLessonIndex, setActiveLessonIndex] =
		useState(INITIAL_LESSON_INDEX);
	const [activeUnitDescription, setActiveUnitDescription] =
		useState(INITIAL_UNIT);
	const [lessonFamilies, setLessonFamilies] = useState<string[]>(["floral"]);
	const [lessonFocusFamily, setLessonFocusFamily] = useState("floral");
	const [lessonSize, setLessonSize] = useState(INITIAL_FORMAT.picks);
	const [lessonMinNotes, setLessonMinNotes] = useState(INITIAL_FORMAT.minNotes);

	const [phase, setPhase] = useState<LessonPhase>("learn");
	const [lesson, setLesson] = useState<LessonState>(() =>
		createLesson(
			1,
			["floral"],
			"floral",
			INITIAL_FORMAT.picks,
			INITIAL_FORMAT.minNotes,
		),
	);
	const [expandedKey, setExpandedKey] = useState<string | null>(null);
	const [quizSequence, setQuizSequence] = useState<MaterialRecord[]>([]);
	const [quizIndex, setQuizIndex] = useState(0);
	const [question, setQuestion] = useState<QuizQuestion | null>(null);
	const [selected, setSelected] = useState<string[]>([]);
	const [locked, setLocked] = useState(false);

	const [progressLessons, setProgressLessons] = useState(0);
	const [lessonStreak, setLessonStreak] = useState(0);
	const [gameOverStreak, setGameOverStreak] = useState(0);
	const [lives, setLives] = useState(MAX_LIVES);

	const [learnedMaterialKeys, setLearnedMaterialKeys] = useState<Set<string>>(
		() => new Set(),
	);
	const [seenMaterialKeys, setSeenMaterialKeys] = useState<Set<string>>(
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

	const sectionScrollY = useRef(0);
	const scrollToLessonId = useRef<string | null>(null);

	useEffect(() => {
		if (screen !== "section") return;

		const lessonId = scrollToLessonId.current;
		if (lessonId) {
			scrollToLessonId.current = null;
			const frame = requestAnimationFrame(() => {
				document.getElementById(lessonId)?.scrollIntoView({
					block: "center",
					behavior: "auto",
				});
			});
			return () => cancelAnimationFrame(frame);
		}

		const y = sectionScrollY.current;
		const frame = requestAnimationFrame(() => {
			window.scrollTo({ top: y, left: 0, behavior: "auto" });
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, curriculum]);

	// Enter learn / quiz / complete (and each new quiz question) → top
	useEffect(() => {
		if (screen !== "play") return;
		if (phase !== "learn" && phase !== "quiz" && phase !== "complete") return;

		const frame = requestAnimationFrame(() => {
			window.scrollTo({ top: 0, left: 0, behavior: "auto" });
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, phase, quizIndex]);

	// After options selected / answer locked → bottom (Next / reveal)
	useEffect(() => {
		if (screen !== "play" || phase !== "quiz") return;
		if (selected.length === 0 && !locked) return;

		const frame = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				window.scrollTo({
					top: document.documentElement.scrollHeight,
					left: 0,
					behavior: "smooth",
				});
			});
		});
		return () => cancelAnimationFrame(frame);
	}, [screen, phase, selected.length, locked]);

	const activeSection = activeSectionId
		? findSection(curriculum, activeSectionId)
		: null;

	const currentLevel = levelForCompletedLessons(progressLessons);
	const currentLevelBaseLessons = (currentLevel - 1) * LESSONS_PER_LEVEL;

	const allReliableMaterialsCount = materials.length;
	const picksReady = lesson.pickedKeys.length >= lessonSize;

	const isCorrect =
		question !== null &&
		locked &&
		isSelectionCorrect(selected, question.correctNotes);

	const isLastQuizQuestion = quizIndex >= quizSequence.length - 1;
	const requiredCount = question?.format.correct ?? 1;
	const lessonQuizFormat = quizFormatForLesson(
		activeUnitDescription,
		activeLessonIndex,
	);

	function startNewLesson(
		level: Level,
		families: string[],
		focusFamily: string,
		size: number,
		minNotes: number,
	) {
		setLessonFamilies(families);
		setLessonFocusFamily(focusFamily);
		setLessonSize(size);
		setLessonMinNotes(minNotes);
		setLesson(createLesson(level, families, focusFamily, size, minNotes));
		setExpandedKey(null);
		setQuizSequence([]);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected([]);
		setLocked(false);
		setLessonStartMastery({});
		setLessonQuizEvents([]);
		setCompleteSnapshot(null);
	}

	function completeLesson() {
		const quizMaterials = getPickedMaterials(lesson);
		const previousKnownCount = learnedMaterialKeys.size;
		const nextLearnedKeys = new Set(learnedMaterialKeys);

		for (const material of quizMaterials) {
			const key = normalizeMaterialKey(material);
			if (getMasteryValue(materialMastery, key) > 0) {
				nextLearnedKeys.add(key);
			} else {
				nextLearnedKeys.delete(key);
			}
		}

		if (activeLessonId) {
			setCurriculum((current) => applyLessonPass(current, activeLessonId));
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
		setSelected([]);
		setLocked(false);
	}

	function handleToggleMaterial(material: MaterialRecord) {
		const key = normalizeMaterialKey(material);
		const alreadyPicked = lesson.pickedKeys.includes(key);
		const picksFull = lesson.pickedKeys.length >= lessonSize;

		if (expandedKey === key) {
			setExpandedKey(null);
			return;
		}

		if (picksFull && !alreadyPicked) return;

		setLesson((current) => {
			if (current.pickedKeys.includes(key)) return current;
			if (current.pickedKeys.length >= lessonSize) return current;
			return {
				...current,
				pickedKeys: [...current.pickedKeys, key],
			};
		});
		setExpandedKey(key);
	}

	function handleStartQuiz() {
		const quizMaterials = getPickedMaterials(lesson);
		if (quizMaterials.length < lessonSize) return;

		setSeenMaterialKeys((current) => {
			const next = new Set(current);
			for (const material of quizMaterials) {
				next.add(normalizeMaterialKey(material));
			}
			return next;
		});

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
		setQuestion(
			generateQuestionForMaterial(
				sequence[0],
				materials,
				materialMastery,
				lessonQuizFormat,
			),
		);
		setSelected([]);
		setLocked(false);
	}

	function submitAnswer(nextSelected: string[], current: QuizQuestion) {
		setLocked(true);

		const answerCorrect = isSelectionCorrect(
			nextSelected,
			current.correctNotes,
		);
		const materialKey = normalizeMaterialKey(current.material);
		const delta: 1 | -1 = answerCorrect ? 1 : -1;

		setMaterialMastery((mastery) =>
			applyMasteryDelta(mastery, materialKey, delta),
		);
		setLessonQuizEvents((events) => [...events, { materialKey, delta }]);

		if (!answerCorrect) {
			const nextLives = lives - 1;
			setLives(nextLives);

			if (nextLives === 0) {
				setGameOverStreak(lessonStreak);
				setLessonStreak(0);
				setProgressLessons(currentLevelBaseLessons);
				setPhase("gameOver");
				setQuestion(null);
				setSelected([]);
				setLocked(false);
			}
		}
	}

	function handleToggleOption(option: string) {
		if (locked || question === null) return;

		const already = selected.some((note) => noteKey(note) === noteKey(option));
		let nextSelected: string[];

		if (already) {
			nextSelected = selected.filter(
				(note) => noteKey(note) !== noteKey(option),
			);
			setSelected(nextSelected);
			return;
		}

		if (selected.length >= question.format.correct) return;

		nextSelected = [...selected, option];
		setSelected(nextSelected);

		if (nextSelected.length === question.format.correct) {
			submitAnswer(nextSelected, question);
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
			generateQuestionForMaterial(
				quizSequence[nextIndex],
				materials,
				materialMastery,
				lessonQuizFormat,
			),
		);
		setSelected([]);
		setLocked(false);
	}

	function handleReturnToSection(options?: { toLatestUnlocked?: boolean }) {
		if (options?.toLatestUnlocked) {
			const section = activeSectionId
				? findSection(curriculum, activeSectionId)
				: null;
			if (section) {
				scrollToLessonId.current = findLatestUnlockedLessonId(section);
			}
		}

		setActiveLessonId(null);
		setExpandedKey(null);
		setQuizSequence([]);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected([]);
		setLocked(false);
		setLessonStartMastery({});
		setLessonQuizEvents([]);
		setCompleteSnapshot(null);
		setScreen("section");
	}

	function handleOpenOverviewFromComplete() {
		setActiveLessonId(null);
		setExpandedKey(null);
		setQuizSequence([]);
		setQuizIndex(0);
		setPhase("learn");
		setQuestion(null);
		setSelected([]);
		setLocked(false);
		setLessonStartMastery({});
		setLessonQuizEvents([]);
		setCompleteSnapshot(null);
		sectionScrollY.current = window.scrollY;
		scrollToLessonId.current = null;
		setScreen("overview");
	}

	function handleStartOver() {
		setGameOverStreak(0);
		setLives(MAX_LIVES);
		setLessonStreak(0);
		setProgressLessons(currentLevelBaseLessons);
		startNewLesson(
			currentLevel,
			lessonFamilies,
			lessonFocusFamily,
			lessonSize,
			lessonMinNotes,
		);
	}

	function handleOpenSection(sectionId: string) {
		sectionScrollY.current = 0;
		scrollToLessonId.current = null;
		setActiveSectionId(sectionId);
		setScreen("section");
	}

	function handleOpenLesson(lessonId: string) {
		const found = findLesson(curriculum, lessonId);
		if (!found) return;

		sectionScrollY.current = window.scrollY;
		scrollToLessonId.current = null;

		const unitDescription = found.unit.description;
		const lessonIndex = found.lesson.lessonIndex;
		const format = lessonFormatForLesson(unitDescription, lessonIndex);

		setActiveLessonId(lessonId);
		setActiveLessonIndex(lessonIndex);
		setActiveUnitDescription(unitDescription);
		const level = Math.min(
			MAX_LEVEL,
			Math.max(1, found.section.sectionIndex),
		) as Level;
		startNewLesson(
			level,
			found.unit.families,
			found.unit.focusFamily,
			format.picks,
			format.minNotes,
		);
		setScreen("play");
	}

	if (screen === "home") {
		return (
			<section className={styles.quizSection}>
				<AcademyHome sections={curriculum} onOpenSection={handleOpenSection} />
			</section>
		);
	}

	if (screen === "overview") {
		return (
			<section className={styles.quizSection}>
				<div className={`${formStyles.formContainer} ${styles.quizContainer}`}>
					<MaterialsOverview
						materials={materials}
						learnedMaterialKeys={learnedMaterialKeys}
						seenMaterialKeys={seenMaterialKeys}
						materialMastery={materialMastery}
						onBack={() => setScreen("section")}
					/>
				</div>
			</section>
		);
	}

	if (screen === "section" && activeSection) {
		return (
			<section className={styles.quizSection}>
				<AcademySectionView
					section={activeSection}
					sections={curriculum}
					onBack={() => {
						setActiveSectionId(null);
						setScreen("home");
					}}
					onOpenOverview={() => {
						sectionScrollY.current = window.scrollY;
						scrollToLessonId.current = null;
						setScreen("overview");
					}}
					onOpenLesson={handleOpenLesson}
				/>
			</section>
		);
	}

	return (
		<section className={styles.quizSection}>
			<div className={`${formStyles.formContainer} ${styles.quizContainer}`}>
				{phase !== "complete" ? (
					<button
						type="button"
						className={styles.exitLesson}
						aria-label="Back to section map"
						onClick={() => handleReturnToSection()}
					>
						×
					</button>
				) : null}

				{phase === "learn" ? (
					<>
						<h2 className={styles.learnProgress}>
							Pick {lessonSize} Material Card{lessonSize === 1 ? "" : "s"}
						</h2>
						<LessonPickGrid
							materials={lesson.pool}
							pickedKeys={lesson.pickedKeys}
							expandedKey={expandedKey}
							lessonSize={lessonSize}
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
						previousKnownCount={completeSnapshot.previousKnownCount}
						knownMaterialsCount={completeSnapshot.newKnownCount}
						allReliableMaterialsCount={allReliableMaterialsCount}
						materials={materials}
						learnedMaterialKeys={learnedMaterialKeys}
						previousLearnedKeys={new Set(completeSnapshot.previousLearnedKeys)}
						lessonMaterials={completeSnapshot.lessonMaterials}
						materialMastery={materialMastery}
						onNextLesson={() =>
							handleReturnToSection({ toLatestUnlocked: true })
						}
						onOpenOverview={handleOpenOverviewFromComplete}
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
									{getMaterialProducerSources(question.material).map(
										(source) => (
											<ProducerLogo
												key={getSourceCardKey(source)}
												sourceName={source.sourceName}
											/>
										),
									)}
								</div>
							</div>

							<div className={styles.quizOptionsSection}>
								<p
									key={quizIndex}
									className={styles.prompt}
									data-settled={
										selected.length > 0 || locked ? "true" : "false"
									}
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
												onClick={() => handleToggleOption(option)}
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

							{locked && !isCorrect && (
								<QuizAnswerReveal
									material={question.material}
									correctNotes={question.correctNotes}
								/>
							)}

							{locked && isCorrect && (
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

							{locked && !isCorrect && lives > 0 && (
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
