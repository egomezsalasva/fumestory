import { useEffect, useState } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";
import shared from "./shared.module.css";
import {
	getMaterialDisplayNames,
	getMasteryValue,
	MASTERY_TARGET,
	normalizeMaterialKey,
	type LessonQuizEvent,
	type MaterialMasteryMap,
} from "@/components/academy/utils";
import {
	capitalizeWordStartsIfLower,
	toTitleCaseWords,
} from "@/utils/display-names";
import {
	hexToRgba,
	NEUTRAL_CATEGORY_COLOR,
	resolveCategoryColor,
} from "@/utils/curated-category-colors";

type CompleteStep = "lesson" | "materials";

type CategoryProgress = {
	family: string;
	label: string;
	known: number;
	total: number;
	color: string;
};

type LessonCompleteCardProps = {
	level: number;
	lessonInLevel: number;
	lessonsPerLevel: number;
	previousKnownCount: number;
	knownMaterialsCount: number;
	allReliableMaterialsCount: number;
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	previousLearnedKeys: ReadonlySet<string>;
	lessonMaterials: MaterialRecord[];
	lessonStartMastery: MaterialMasteryMap;
	materialMastery: MaterialMasteryMap;
	lessonQuizEvents: LessonQuizEvent[];
	lives: number;
	maxLives: number;
	onNextLesson: () => void;
	promotedToLevel: number | null;
};

const LESSON_SCREEN_DURATION_MS = 1500;
const KNOWN_COUNT_ANIMATION_MS = 1200;
const MASTERY_BAR_ANIMATION_MS = 600;
const MASTERY_ROW_PAUSE_MS = 100;
const MASTERY_ROW_CYCLE_MS = MASTERY_BAR_ANIMATION_MS + MASTERY_ROW_PAUSE_MS;
const LESSON_SEGMENT_FILL_MS = 1200;

function getCategoryProgress(
	materials: MaterialRecord[],
	learnedKeys: ReadonlySet<string>,
): CategoryProgress[] {
	const map = new Map<string, { known: number; total: number }>();

	for (const material of materials) {
		const family = material.olfactiveFamily?.[0]?.trim().toLowerCase();
		if (!family) continue;

		const entry = map.get(family) ?? { known: 0, total: 0 };
		entry.total += 1;
		if (learnedKeys.has(normalizeMaterialKey(material))) {
			entry.known += 1;
		}
		map.set(family, entry);
	}

	return [...map.entries()]
		.map(([family, { known, total }]) => ({
			family,
			label: toTitleCaseWords(family),
			known,
			total,
			color: resolveCategoryColor(family),
		}))
		.sort((a, b) => a.family.localeCompare(b.family));
}

function AnimatedNumber({
	from,
	to,
	duration = KNOWN_COUNT_ANIMATION_MS,
	delayMs = 0,
	className,
}: {
	from: number;
	to: number;
	duration?: number;
	delayMs?: number;
	className?: string;
}) {
	const [value, setValue] = useState(from);

	useEffect(() => {
		setValue(from);
		let rafId = 0;

		const delayTimer = window.setTimeout(() => {
			const start = performance.now();

			const tick = (now: number) => {
				const progress = Math.min(1, (now - start) / duration);
				setValue(Math.round(from + (to - from) * progress));

				if (progress < 1) {
					rafId = requestAnimationFrame(tick);
				}
			};

			rafId = requestAnimationFrame(tick);
		}, delayMs);

		return () => {
			window.clearTimeout(delayTimer);
			cancelAnimationFrame(rafId);
		};
	}, [from, to, duration, delayMs]);

	return <span className={className}>{value}</span>;
}

function MaterialMasteryCard({
	material,
	targetValue,
	animationDelayMs = 0,
}: {
	material: MaterialRecord;
	targetValue: number;
	animationDelayMs?: number;
}) {
	const familyParent = material.olfactiveFamily?.[0];
	const color = familyParent
		? resolveCategoryColor(familyParent)
		: NEUTRAL_CATEGORY_COLOR;
	const displayName =
		getMaterialDisplayNames(material)[0] ?? material.canonicalName;
	const label = capitalizeWordStartsIfLower(displayName);
	const targetScale = targetValue / MASTERY_TARGET;
	const [fillScale, setFillScale] = useState(0);

	useEffect(() => {
		setFillScale(0);
		if (targetValue === 0) return;

		const timer = setTimeout(() => {
			setFillScale(targetScale);
		}, animationDelayMs);

		return () => clearTimeout(timer);
	}, [targetValue, targetScale, animationDelayMs]);

	const isComplete = targetValue >= MASTERY_TARGET && fillScale >= targetScale;

	return (
		<div
			className={`${styles.materialMasteryCard} ${
				isComplete ? styles.materialMasteryComplete : ""
			}`}
			style={{
				background: `linear-gradient(${hexToRgba(color, 0.4)}, ${hexToRgba(color, 0.4)}), #0b172d`,
				borderColor: hexToRgba(color, 0.55),
			}}
		>
			<p className={styles.materialMasteryLabel}>{label}</p>
			<div className={styles.materialMasteryTrack}>
				<div className={styles.materialMasteryTrackInner}>
					{Array.from({ length: MASTERY_TARGET }, (_, index) => (
						<span key={index} className={styles.materialMasterySegment} />
					))}
					<span
						className={styles.materialMasteryFill}
						style={{
							transform: `scaleX(${fillScale})`,
							transitionDuration: `${MASTERY_BAR_ANIMATION_MS}ms`,
							background: hexToRgba(color, 0.85),
						}}
					/>
				</div>
			</div>
		</div>
	);
}

function LessonCompleteSummary({
	level,
	lessonInLevel,
	lessonsPerLevel,
	lives,
	maxLives,
	promotedToLevel,
}: {
	level: number;
	lessonInLevel: number;
	lessonsPerLevel: number;
	lives: number;
	maxLives: number;
	promotedToLevel: number | null;
}) {
	return (
		<div className={styles.lessonCompleteCard}>
			<p className={styles.lessonCompleteLevel}>Level {level}</p>
			<p className={styles.lessonCompleteStreak}>
				Lesson {lessonInLevel}/{lessonsPerLevel}
			</p>

			<div
				className={styles.lessonProgressTrack}
				aria-label={`Lesson ${lessonInLevel} of ${lessonsPerLevel} complete`}
			>
				{Array.from({ length: lessonsPerLevel }, (_, index) => {
					const isCompleted = index < lessonInLevel;
					const isPreviouslyCompleted = index < lessonInLevel - 1;

					return (
						<span key={index} className={styles.lessonProgressSegment}>
							{isCompleted ? (
								<span
									className={`${styles.lessonProgressSegmentFill}${
										isPreviouslyCompleted
											? ` ${styles.lessonProgressSegmentFillStatic}`
											: ""
									}`}
									style={
										!isPreviouslyCompleted
											? { animationDuration: `${LESSON_SEGMENT_FILL_MS}ms` }
											: undefined
									}
								/>
							) : null}
						</span>
					);
				})}
			</div>

			{promotedToLevel ? (
				<p className={styles.lessonCompleteStreak}>
					Congrats! You moved up to level {promotedToLevel}!
				</p>
			) : null}

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
	);
}

function LessonCompleteMaterials({
	previousKnownCount,
	knownMaterialsCount,
	allReliableMaterialsCount,
	materials,
	learnedMaterialKeys,
	previousLearnedKeys,
	lessonMaterials,
	materialMastery,
	onNextLesson,
}: {
	previousKnownCount: number;
	knownMaterialsCount: number;
	allReliableMaterialsCount: number;
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	previousLearnedKeys: ReadonlySet<string>;
	lessonMaterials: MaterialRecord[];
	materialMastery: MaterialMasteryMap;
	onNextLesson: () => void;
}) {
	const categories = getCategoryProgress(materials, learnedMaterialKeys);
	const previousByFamily = new Map(
		getCategoryProgress(materials, previousLearnedKeys).map((cat) => [
			cat.family,
			cat.known,
		]),
	);

	const updatedFamilies = categories
		.filter((cat) => cat.known > (previousByFamily.get(cat.family) ?? 0))
		.map((cat) => cat.family);

	const categoryAnimStartMs = KNOWN_COUNT_ANIMATION_MS;
	const masteryAnimStartMs =
		KNOWN_COUNT_ANIMATION_MS +
		updatedFamilies.length * KNOWN_COUNT_ANIMATION_MS;

	return (
		<div className={styles.lessonCompleteCard}>
			<div className={styles.lessonCompleteKnownCountContainer}>
				<p className={styles.lessonCompleteKnownLabel}>You now know</p>
				<p className={styles.lessonCompleteKnownCount}>
					<AnimatedNumber
						from={previousKnownCount}
						to={knownMaterialsCount}
						duration={KNOWN_COUNT_ANIMATION_MS}
						className={styles.lessonStreakAchieved}
					/>
					/{allReliableMaterialsCount}
				</p>
				<p className={styles.lessonCompleteKnownSubLabel}>materials</p>
			</div>

			<div className={styles.categoryProgressGrid}>
				{categories.map((cat) => {
					const previousKnown = previousByFamily.get(cat.family) ?? 0;
					const updated = cat.known > previousKnown;
					const updatedIndex = updatedFamilies.indexOf(cat.family);

					return (
						<div
							key={cat.family}
							className={styles.categoryProgressCard}
							data-updated={updated}
							style={{
								background: `linear-gradient(${hexToRgba(cat.color, 0.4)}, ${hexToRgba(cat.color, 0.4)}), #0b172d`,
								borderColor: hexToRgba(cat.color, 0.55),
							}}
							title={cat.label}
							aria-label={`${cat.label}: ${cat.known} of ${cat.total}`}
						>
							<span className={styles.categoryProgressCount}>
								{updated ? (
									<AnimatedNumber
										from={previousKnown}
										to={cat.known}
										duration={KNOWN_COUNT_ANIMATION_MS}
										delayMs={
											categoryAnimStartMs +
											updatedIndex * KNOWN_COUNT_ANIMATION_MS
										}
									/>
								) : (
									cat.known
								)}
								/{cat.total}
							</span>
							<span className={styles.categoryProgressLabel}>{cat.label}</span>
						</div>
					);
				})}
			</div>

			<p className={styles.lessonCompleteMaterialsHeading}>
				Materials You Studied
			</p>
			<div className={styles.lessonCompleteMaterialsList}>
				{lessonMaterials.map((material, index) => {
					const materialKey = normalizeMaterialKey(material);
					const targetValue = getMasteryValue(materialMastery, materialKey);

					return (
						<MaterialMasteryCard
							key={materialKey}
							material={material}
							targetValue={targetValue}
							animationDelayMs={
								masteryAnimStartMs + index * MASTERY_ROW_CYCLE_MS
							}
						/>
					);
				})}
			</div>

			<p className={styles.lessonStartOverMessage}>
				Great job, let's keep learning.
			</p>

			<div className={shared.gameActions}>
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

export default function LessonCompleteCard({
	level,
	lessonInLevel,
	lessonsPerLevel,
	previousKnownCount,
	knownMaterialsCount,
	allReliableMaterialsCount,
	materials,
	learnedMaterialKeys,
	previousLearnedKeys,
	lessonMaterials,
	materialMastery,
	lives,
	maxLives,
	onNextLesson,
	promotedToLevel,
}: LessonCompleteCardProps) {
	const [step, setStep] = useState<CompleteStep>("lesson");

	useEffect(() => {
		const timer = setTimeout(() => {
			setStep("materials");
		}, LESSON_SCREEN_DURATION_MS);

		return () => clearTimeout(timer);
	}, []);

	if (step === "lesson") {
		return (
			<LessonCompleteSummary
				level={level}
				lessonInLevel={lessonInLevel}
				lessonsPerLevel={lessonsPerLevel}
				lives={lives}
				maxLives={maxLives}
				promotedToLevel={promotedToLevel}
			/>
		);
	}

	return (
		<LessonCompleteMaterials
			previousKnownCount={previousKnownCount}
			knownMaterialsCount={knownMaterialsCount}
			allReliableMaterialsCount={allReliableMaterialsCount}
			materials={materials}
			learnedMaterialKeys={learnedMaterialKeys}
			previousLearnedKeys={previousLearnedKeys}
			lessonMaterials={lessonMaterials}
			materialMastery={materialMastery}
			onNextLesson={onNextLesson}
		/>
	);
}
