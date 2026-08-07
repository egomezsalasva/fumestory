import { useEffect, useRef, useState, type CSSProperties } from "react";
import type {
	CurriculumLesson,
	CurriculumSection,
	UnitColors,
} from "./curriculum";
import { REPEATS_TO_MASTER, getSectionLessonProgress } from "./curriculum";
import { hexToRgba } from "@/utils/curated-category-colors";
import styles from "./AcademyMap.module.css";

type AcademyHomeProps = {
	sections: CurriculumSection[];
	onOpenSection: (sectionId: string) => void;
};

export function AcademyHome({ sections, onOpenSection }: AcademyHomeProps) {
	return (
		<div className={styles.map}>
			<h1 className={styles.title}>Academy</h1>
			<div className={styles.sectionList}>
				{sections.map((section) => (
					<SectionCard
						key={section.id}
						section={section}
						onClick={() => {
							if (section.status !== "locked") {
								onOpenSection(section.id);
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}

type AcademySectionViewProps = {
	section: CurriculumSection;
	sections: CurriculumSection[];
	onBack: () => void;
	onOpenOverview: () => void;
	onOpenLesson: (lessonId: string) => void;
};

export function AcademySectionView({
	section,
	sections,
	onBack,
	onOpenOverview,
	onOpenLesson,
}: AcademySectionViewProps) {
	const [activeUnitId, setActiveUnitId] = useState(section.units[0]?.id ?? "");
	const headerRef = useRef<HTMLDivElement>(null);
	const unitRefs = useRef(new Map<string, HTMLElement>());

	useEffect(() => {
		const updateActiveUnit = () => {
			const marker = headerRef.current?.getBoundingClientRect().bottom ?? 0;

			let nextId = section.units[0]?.id ?? "";
			for (const unit of section.units) {
				const node = unitRefs.current.get(unit.id);
				if (!node) continue;
				if (node.getBoundingClientRect().top <= marker) {
					nextId = unit.id;
				}
			}

			setActiveUnitId((prev) => (prev === nextId ? prev : nextId));
		};

		updateActiveUnit();
		window.addEventListener("scroll", updateActiveUnit, { passive: true });
		window.addEventListener("resize", updateActiveUnit);
		return () => {
			window.removeEventListener("scroll", updateActiveUnit);
			window.removeEventListener("resize", updateActiveUnit);
		};
	}, [section]);

	const activeUnit =
		section.units.find((unit) => unit.id === activeUnitId) ?? section.units[0];
	const unitLocked = activeUnit?.status === "locked";
	const nextSection =
		sections.find((item) => item.sectionIndex === section.sectionIndex + 1) ??
		null;

	return (
		<div className={styles.map}>
			<div className={styles.sectionHeader} ref={headerRef}>
				<SectionCard
					section={section}
					title={
						activeUnit ? `${section.title}, ${activeUnit.title}` : section.title
					}
					meta={activeUnit?.description}
					colors={activeUnit?.colors ?? null}
					unitLocked={unitLocked}
					onClick={onBack}
					onOpenOverview={onOpenOverview}
				/>
			</div>

			{section.units.map((unit) => {
				const priorAllMastered = unit.lessons
					.slice(0, -1)
					.every((lesson) => lesson.repeats >= REPEATS_TO_MASTER);

				return (
					<section
						key={unit.id}
						className={styles.unitBlock}
						data-unit-id={unit.id}
						ref={(node) => {
							if (node) unitRefs.current.set(unit.id, node);
							else unitRefs.current.delete(unit.id);
						}}
					>
						<h2 className={styles.unitTitle}>
							<span className={styles.unitTitleLine} aria-hidden="true" />
							<span className={styles.unitTitleText}>{unit.description}</span>
							<span className={styles.unitTitleLine} aria-hidden="true" />
						</h2>
						<ol className={styles.lessonPath}>
							{unit.lessons.map((lesson, index) => {
								const isLastInUnit = index === unit.lessons.length - 1;
								const canReplay =
									isLastInUnit &&
									lesson.repeats >= REPEATS_TO_MASTER &&
									priorAllMastered;

								return (
									<li key={lesson.id} className={styles.lessonPathItem}>
										{index > 0 ? (
											<span
												className={styles.lessonConnector}
												aria-hidden="true"
											/>
										) : null}
										<LessonNode
											lesson={lesson}
											colors={unit.colors}
											unitLocked={unit.status === "locked"}
											canReplay={canReplay}
											onOpenLesson={onOpenLesson}
										/>
									</li>
								);
							})}
						</ol>
					</section>
				);
			})}

			{nextSection ? (
				<div className={styles.nextSection}>
					<SectionCard section={nextSection} onClick={() => {}} />
				</div>
			) : null}
		</div>
	);
}

function SectionCard({
	section,
	title,
	meta,
	colors = null,
	unitLocked = false,
	onClick,
	onOpenOverview,
}: {
	section: CurriculumSection;
	title?: string;
	meta?: string;
	colors?: UnitColors | null;
	unitLocked?: boolean;
	onClick: () => void;
	onOpenOverview?: () => void;
}) {
	const locked = section.status === "locked";
	const isHomeCard = title == null;
	const { done, total } = getSectionLessonProgress(section);
	const progress = total > 0 ? done / total : 0;

	const activeColors = colors && !unitLocked && !locked ? colors : null;
	const cardStyle = activeColors
		? { borderColor: hexToRgba(activeColors.accent, 0.55) }
		: undefined;
	const metaStyle = activeColors
		? { color: hexToRgba(activeColors.accent, 0.75) }
		: undefined;

	const body = (
		<>
			<span className={styles.sectionTitle}>
				{title ?? section.title}
				{unitLocked ? (
					<span className={styles.sectionTitleLocked}> - Locked</span>
				) : null}
			</span>
			<span className={styles.sectionMeta} style={metaStyle}>
				{meta ?? section.subtitle}
			</span>
			{locked ? (
				<span className={styles.sectionLock}>Locked</span>
			) : isHomeCard ? (
				<span
					className={styles.sectionProgress}
					aria-label={`${done} of ${total} lessons started`}
				>
					<span className={styles.sectionProgressInner}>
						{Array.from({ length: total }, (_, index) => (
							<span key={index} className={styles.sectionProgressSegment} />
						))}
						<span
							className={styles.sectionProgressFill}
							style={{ transform: `scaleX(${progress})` }}
						/>
					</span>
				</span>
			) : null}
		</>
	);

	if (onOpenOverview) {
		return (
			<div
				className={styles.sectionCard}
				data-status={section.status}
				data-unit-locked={unitLocked ? "true" : "false"}
				data-has-overview="true"
				style={cardStyle}
			>
				<button
					type="button"
					className={styles.sectionCardMain}
					onClick={onClick}
				>
					{body}
				</button>
				<button
					type="button"
					className={styles.overviewButton}
					aria-label="Materials overview"
					onClick={onOpenOverview}
				>
					<span className={styles.overviewCardIcon} aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5z" />
						</svg>
					</span>
				</button>
			</div>
		);
	}

	return (
		<button
			type="button"
			className={styles.sectionCard}
			data-status={section.status}
			data-unit-locked={unitLocked ? "true" : "false"}
			disabled={locked}
			style={cardStyle}
			onClick={() => {
				if (!locked) onClick();
			}}
		>
			{body}
		</button>
	);
}

function LessonNode({
	lesson,
	colors,
	unitLocked,
	canReplay,
	onOpenLesson,
}: {
	lesson: CurriculumLesson;
	colors: UnitColors | null;
	unitLocked: boolean;
	canReplay: boolean;
	onOpenLesson: (lessonId: string) => void;
}) {
	const locked = lesson.status === "locked";
	const mastered = lesson.repeats >= REPEATS_TO_MASTER;
	const lockedOut = locked || (mastered && !canReplay);
	const repeats = Math.min(lesson.repeats, REPEATS_TO_MASTER);

	let faceStyle: CSSProperties | undefined;
	if (colors && !unitLocked) {
		if (mastered) {
			faceStyle = {
				["--lesson-metal" as string]: colors.accent,
				borderColor: hexToRgba(colors.accent, 0.75),
			};
		} else {
			faceStyle = {
				background: colors.face,
				borderColor: hexToRgba(colors.accent, 0.55),
			};
		}
	}

	return (
		<button
			type="button"
			id={lesson.id}
			className={styles.lessonNode}
			data-status={lesson.status}
			data-mastered={mastered ? "true" : "false"}
			data-replayable={canReplay ? "true" : "false"}
			disabled={lockedOut}
			style={faceStyle}
			onClick={() => {
				if (!lockedOut) onOpenLesson(lesson.id);
			}}
		>
			<span className={styles.lessonNodeTitle}>{lesson.title}</span>
			{locked ? (
				<span className={styles.lessonStatus}>Locked</span>
			) : canReplay ? (
				<span className={styles.lessonReplay} aria-label="Replay lesson">
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
					</svg>
				</span>
			) : (
				<span
					className={styles.lessonProgress}
					aria-label={`${repeats} of ${REPEATS_TO_MASTER} repeats`}
				>
					<span className={styles.lessonProgressInner}>
						{Array.from({ length: REPEATS_TO_MASTER }, (_, index) => (
							<span key={index} className={styles.lessonProgressSegment} />
						))}
						<span
							className={styles.lessonProgressFill}
							style={{
								transform: `scaleX(${repeats / REPEATS_TO_MASTER})`,
							}}
						/>
					</span>
				</span>
			)}
		</button>
	);
}
