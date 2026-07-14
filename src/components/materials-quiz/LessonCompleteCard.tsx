import { useEffect, useState } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialDisplayNames,
	getMasteryValue,
	MASTERY_TARGET,
	normalizeMaterialKey,
	type LessonQuizEvent,
	type MaterialMasteryMap,
} from "@/components/materials-quiz/utils";
import { capitalizeWordStartsIfLower } from "@/utils/display-names";

type CompleteStep = "lesson" | "materials";

type LessonCompleteCardProps = {
	level: number;
	lessonInLevel: number;
	lessonsPerLevel: number;
	previousKnownCount: number;
	knownMaterialsCount: number;
	allReliableMaterialsCount: number;
	lessonMaterials: MaterialRecord[];
	lessonStartMastery: MaterialMasteryMap;
	materialMastery: MaterialMasteryMap;
	lessonQuizEvents: LessonQuizEvent[];
	lives: number;
	maxLives: number;
	onNextLesson: () => void;
	promotedToLevel: number | null;
};

const LESSON_SCREEN_DURATION_MS = 1000;
const KNOWN_COUNT_ANIMATION_MS = 1200;
const MASTERY_EVENT_STEP_MS = 200;
const MASTERY_ROW_STAGGER_MS = 150;

function AnimatedNumber({
	from,
	to,
	duration = KNOWN_COUNT_ANIMATION_MS,
	className,
}: {
	from: number;
	to: number;
	duration?: number;
	className?: string;
}) {
	const [value, setValue] = useState(from);

	useEffect(() => {
		setValue(from);
		const start = performance.now();
		let rafId = 0;

		const tick = (now: number) => {
			const progress = Math.min(1, (now - start) / duration);
			setValue(Math.round(from + (to - from) * progress));

			if (progress < 1) {
				rafId = requestAnimationFrame(tick);
			}
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [from, to, duration]);

	return <span className={className}>{value}</span>;
}

function MaterialMasteryRow({
	label,
	startValue,
	targetValue,
	events,
	animationDelayMs = 0,
}: {
	label: string;
	startValue: number;
	targetValue: number;
	events: LessonQuizEvent[];
	animationDelayMs?: number;
}) {
	const [displayValue, setDisplayValue] = useState(startValue);
	const eventKey = events.map((event) => event.delta).join(",");

	useEffect(() => {
		setDisplayValue(startValue);

		let cancelled = false;
		const timeouts: ReturnType<typeof setTimeout>[] = [];

		const schedule = (fn: () => void, delay: number) => {
			timeouts.push(
				setTimeout(() => {
					if (cancelled) return;
					fn();
				}, delay),
			);
		};

		let value = startValue;
		let at = animationDelayMs;

		for (const event of events) {
			schedule(() => {
				value = Math.min(MASTERY_TARGET, Math.max(0, value + event.delta));
				setDisplayValue(value);
			}, at);
			at += MASTERY_EVENT_STEP_MS;
		}

		schedule(() => {
			setDisplayValue(targetValue);
		}, at);

		return () => {
			cancelled = true;
			for (const id of timeouts) clearTimeout(id);
		};
	}, [startValue, targetValue, animationDelayMs, eventKey, events]);

	const isComplete = displayValue >= MASTERY_TARGET;

	return (
		<div
			className={`${quizStyles.materialMasteryRow} ${
				isComplete ? quizStyles.materialMasteryComplete : ""
			}`}
		>
			<p className={quizStyles.materialMasteryLabel}>{label}</p>
			<div className={quizStyles.materialMasteryTrack}>
				<div className={quizStyles.materialMasteryTrackInner}>
					{Array.from({ length: MASTERY_TARGET }, (_, index) => (
						<span
							key={index}
							className={`${quizStyles.materialMasterySegment} ${
								index < displayValue
									? quizStyles.materialMasterySegmentFilled
									: ""
							}`}
						/>
					))}
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
		<div className={quizStyles.lessonCompleteCard}>
			<p className={quizStyles.lessonCompleteLevel}>Level {level}</p>
			<p className={quizStyles.lessonCompleteStreak}>
				Lesson {lessonInLevel}/{lessonsPerLevel}
			</p>

			<div
				className={quizStyles.lessonProgressTrack}
				aria-label={`Lesson ${lessonInLevel} of ${lessonsPerLevel} complete`}
			>
				{Array.from({ length: lessonsPerLevel }, (_, index) => (
					<span
						key={index}
						className={`${quizStyles.lessonProgressSegment} ${
							index < lessonInLevel
								? quizStyles.lessonProgressSegmentFilled
								: ""
						}`}
						style={
							index < lessonInLevel
								? { animationDelay: `${index * 120}ms` }
								: undefined
						}
					/>
				))}
			</div>

			{promotedToLevel ? (
				<p className={quizStyles.lessonCompleteStreak}>
					Congrats! You moved up to level {promotedToLevel}!
				</p>
			) : null}

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
		</div>
	);
}

function LessonCompleteMaterials({
	previousKnownCount,
	knownMaterialsCount,
	allReliableMaterialsCount,
	lessonMaterials,
	lessonStartMastery,
	materialMastery,
	lessonQuizEvents,
	onNextLesson,
}: {
	previousKnownCount: number;
	knownMaterialsCount: number;
	allReliableMaterialsCount: number;
	lessonMaterials: MaterialRecord[];
	lessonStartMastery: MaterialMasteryMap;
	materialMastery: MaterialMasteryMap;
	lessonQuizEvents: LessonQuizEvent[];
	onNextLesson: () => void;
}) {
	return (
		<div className={quizStyles.lessonCompleteCard}>
			<div className={quizStyles.lessonCompleteKnownCountContainer}>
				<p className={quizStyles.lessonCompleteKnownLabel}>You now know</p>
				<p className={quizStyles.lessonCompleteKnownCount}>
					<AnimatedNumber
						from={previousKnownCount}
						to={knownMaterialsCount}
						duration={KNOWN_COUNT_ANIMATION_MS}
						className={quizStyles.lessonStreakAchieved}
					/>
					/{allReliableMaterialsCount}
				</p>
				<p className={quizStyles.lessonCompleteKnownSubLabel}>materials</p>
			</div>

			<div className={quizStyles.lessonCompleteMaterialsList}>
				{lessonMaterials.map((material, index) => {
					const materialKey = normalizeMaterialKey(material);
					const displayName =
						getMaterialDisplayNames(material)[0] ?? material.canonicalName;
					const startValue = getMasteryValue(lessonStartMastery, materialKey);
					const targetValue = getMasteryValue(materialMastery, materialKey);
					const materialEvents = lessonQuizEvents.filter(
						(event) => event.materialKey === materialKey,
					);

					return (
						<MaterialMasteryRow
							key={materialKey}
							label={capitalizeWordStartsIfLower(displayName)}
							startValue={startValue}
							targetValue={targetValue}
							events={materialEvents}
							animationDelayMs={
								KNOWN_COUNT_ANIMATION_MS + index * MASTERY_ROW_STAGGER_MS
							}
						/>
					);
				})}
			</div>

			<p className={quizStyles.lessonStartOverMessage}>
				Great job, let's keep learning.
			</p>

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

export default function LessonCompleteCard({
	level,
	lessonInLevel,
	lessonsPerLevel,
	previousKnownCount,
	knownMaterialsCount,
	allReliableMaterialsCount,
	lessonMaterials,
	lessonStartMastery,
	materialMastery,
	lessonQuizEvents,
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
			lessonMaterials={lessonMaterials}
			lessonStartMastery={lessonStartMastery}
			materialMastery={materialMastery}
			lessonQuizEvents={lessonQuizEvents}
			onNextLesson={onNextLesson}
		/>
	);
}
