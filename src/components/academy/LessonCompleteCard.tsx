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

type CategoryProgress = {
	family: string;
	label: string;
	known: number;
	total: number;
	color: string;
};

type LessonCompleteCardProps = {
	previousKnownCount: number;
	knownMaterialsCount: number;
	allReliableMaterialsCount: number;
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	previousLearnedKeys: ReadonlySet<string>;
	lessonMaterials: MaterialRecord[];
	materialMastery: MaterialMasteryMap;
	onNextLesson: () => void;
	onOpenOverview: () => void;
};

const KNOWN_COUNT_ANIMATION_MS = 1200;
const MASTERY_BAR_ANIMATION_MS = 600;
const MASTERY_ROW_PAUSE_MS = 100;
const MASTERY_ROW_CYCLE_MS = MASTERY_BAR_ANIMATION_MS + MASTERY_ROW_PAUSE_MS;

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
	animationDelayMs,
}: {
	material: MaterialRecord;
	targetValue: number;
	animationDelayMs: number;
}) {
	const [fillScale, setFillScale] = useState(0);
	const displayNames = getMaterialDisplayNames(material);
	const familyParent = material.olfactiveFamily?.[0];
	const color = familyParent
		? resolveCategoryColor(familyParent)
		: NEUTRAL_CATEGORY_COLOR;
	const progress = Math.min(1, targetValue / MASTERY_TARGET);

	useEffect(() => {
		setFillScale(0);
		const timer = window.setTimeout(() => {
			setFillScale(progress);
		}, animationDelayMs);

		return () => window.clearTimeout(timer);
	}, [animationDelayMs, progress]);

	return (
		<div
			className={`${styles.materialMasteryCard}${
				targetValue >= MASTERY_TARGET
					? ` ${styles.materialMasteryComplete}`
					: ""
			}`}
			style={{
				background: `linear-gradient(${hexToRgba(color, 0.4)}, ${hexToRgba(color, 0.4)}), #0b172d`,
				borderColor: hexToRgba(color, 0.55),
			}}
		>
			<div className={styles.materialMasteryHeader}>
				<span className={styles.materialMasteryLabel}>
					{capitalizeWordStartsIfLower(
						displayNames[0] ?? material.canonicalName,
					)}
				</span>
			</div>
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

export default function LessonCompleteCard({
	previousKnownCount,
	knownMaterialsCount,
	allReliableMaterialsCount,
	materials,
	learnedMaterialKeys,
	previousLearnedKeys,
	lessonMaterials,
	materialMastery,
	onNextLesson,
	onOpenOverview,
}: LessonCompleteCardProps) {
	const categories = getCategoryProgress(materials, learnedMaterialKeys);
	const previousByFamily = new Map(
		getCategoryProgress(materials, previousLearnedKeys).map((cat) => [
			cat.family,
			cat.known,
		]),
	);

	const lessonFamilies = new Set(
		lessonMaterials
			.map((m) => m.olfactiveFamily?.[0]?.trim().toLowerCase())
			.filter((family): family is string => Boolean(family)),
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
							data-in-lesson={lessonFamilies.has(cat.family)}
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

				<button
					type="button"
					className={styles.overviewShortcutCard}
					aria-label="Materials overview"
					onClick={onOpenOverview}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z" />
					</svg>
				</button>
			</div>

			<p className={styles.lessonCompleteMaterialsHeading}>
				Materials You Studied
			</p>
			<div
				className={styles.lessonCompleteMaterialsList}
				data-count={lessonMaterials.length}
			>
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
					Continue
				</button>
			</div>
		</div>
	);
}
