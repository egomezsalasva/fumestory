import { hexToRgba } from "@/utils/curated-category-colors";

export type LessonStatus = "locked" | "available" | "completed";
export type SectionStatus = "locked" | "available";
export type UnitStatus = "locked" | "available";

export const REPEATS_TO_MASTER = 5;

export type UnitColors = {
	accent: string;
	face: string;
};

export type CurriculumLesson = {
	id: string;
	title: string;
	unitIndex: number;
	lessonIndex: number;
	status: LessonStatus;
	repeats: number;
};

export type CurriculumUnit = {
	id: string;
	title: string;
	description: string;
	unitIndex: number;
	status: UnitStatus;
	colors: UnitColors | null;
	/** Primary family for this unit (map label / “mostly”). */
	focusFamily: string;
	/** Focus + all earlier focuses in this section (lesson pool). */
	families: string[];
	lessons: CurriculumLesson[];
};

export type CurriculumSection = {
	id: string;
	title: string;
	subtitle: string;
	sectionIndex: number;
	status: SectionStatus;
	units: CurriculumUnit[];
};

function solidColors(accent: string): UnitColors {
	return {
		accent,
		face: `linear-gradient(${hexToRgba(accent, 0.4)}, ${hexToRgba(accent, 0.4)}), #0b172d`,
	};
}

/**
 * Edit freely. Order matters: each unit’s pool = its focusFamily
 * plus every focusFamily listed above it in the same section.
 * lessonCount = how many lessons on the map for that unit.
 */
const CURRICULUM: {
	title: string;
	subtitle: string;
	status: SectionStatus;
	units: {
		description: string;
		colors: UnitColors | null;
		focusFamily: string;
		lessonCount: number;
	}[];
}[] = [
	{
		title: "Section 1",
		subtitle: "Easy Raw Materials - 5 notes or less each",
		status: "available",
		units: [
			{
				description: "Florals",
				colors: solidColors("#d4849a"),
				focusFamily: "floral",
				lessonCount: 6,
			},
			{
				description: "Fruity",
				colors: solidColors("#e07a5f"),
				focusFamily: "fruity",
				lessonCount: 6,
			},
			{
				description: "Citrus",
				colors: solidColors("#e8c84a"),
				focusFamily: "citrus",
				lessonCount: 6,
			},
			{
				description: "Woody",
				colors: solidColors("#8b6914"),
				focusFamily: "woody",
				lessonCount: 6,
			},
			{
				description: "Green",
				colors: solidColors("#4a8f5c"),
				focusFamily: "green",
				lessonCount: 5,
			},
			{
				description: "Herbal",
				colors: solidColors("#5f8f6a"),
				focusFamily: "herbal",
				lessonCount: 5,
			},
			{
				description: "Spices",
				colors: solidColors("#c45c26"),
				focusFamily: "spices",
				lessonCount: 5,
			},
			{
				description: "Amber",
				colors: solidColors("#FFC107"),
				focusFamily: "amber",
				lessonCount: 2,
			},
			{
				description: "Musk",
				colors: solidColors("#a78b9a"),
				focusFamily: "musk",
				lessonCount: 2,
			},
			{
				description: "Leather",
				colors: solidColors("#6b3a2a"),
				focusFamily: "leather",
				lessonCount: 1,
			},
			{
				description: "Gourmand",
				colors: solidColors("#c47a5a"),
				focusFamily: "gourmand",
				lessonCount: 1,
			},
			{
				description: "Aldehydic",
				colors: solidColors("#b8c4d4"),
				focusFamily: "aldehydic",
				lessonCount: 1,
			},
			{
				description: "Resinous / Balsamic",
				colors: solidColors("#9a6b2f"),
				focusFamily: "resinous / balsamic",
				lessonCount: 1,
			},
			{
				description: "Sulfurous",
				colors: solidColors("#a3a34a"),
				focusFamily: "sulfurous",
				lessonCount: 1,
			},
			{
				description: "More Florals",
				colors: solidColors("#d4849a"),
				focusFamily: "floral",
				lessonCount: 5,
			},
			{
				description: "More Fruity",
				colors: solidColors("#e07a5f"),
				focusFamily: "fruity",
				lessonCount: 5,
			},
			{
				description: "More Citrus",
				colors: solidColors("#e8c84a"),
				focusFamily: "citrus",
				lessonCount: 5,
			},
			{
				description: "More Woody",
				colors: solidColors("#8b6914"),
				focusFamily: "woody",
				lessonCount: 5,
			},
		],
	},
	{
		title: "Section 2",
		subtitle: "Medium Raw Materials - Between 5 to 10 notes each",
		status: "locked",
		units: [
			{
				description: "Medium Florals",
				colors: solidColors("#d4849a"),
				focusFamily: "floral",
				lessonCount: 4,
			},
			{
				description: "Medium Fruity",
				colors: solidColors("#e07a5f"),
				focusFamily: "fruity",
				lessonCount: 3,
			},
			{
				description: "Medium Citrus",
				colors: solidColors("#e8c84a"),
				focusFamily: "citrus",
				lessonCount: 3,
			},
			{
				description: "Medium Woody",
				colors: solidColors("#8b6914"),
				focusFamily: "woody",
				lessonCount: 3,
			},
			{
				description: "Medium Green",
				colors: solidColors("#4a8f5c"),
				focusFamily: "green",
				lessonCount: 2,
			},
			{
				description: "Medium Herbal",
				colors: solidColors("#5f8f6a"),
				focusFamily: "herbal",
				lessonCount: 2,
			},
			{
				description: "Medium Spices",
				colors: solidColors("#c45c26"),
				focusFamily: "spices",
				lessonCount: 2,
			},
			{
				description: "Medium Amber",
				colors: solidColors("#FFC107"),
				focusFamily: "amber",
				lessonCount: 2,
			},
			{
				description: "Medium Musk",
				colors: solidColors("#a78b9a"),
				focusFamily: "musk",
				lessonCount: 2,
			},
			{
				description: "Medium Leather",
				colors: solidColors("#6b3a2a"),
				focusFamily: "leather",
				lessonCount: 1,
			},
			{
				description: "Medium Gourmand",
				colors: solidColors("#c47a5a"),
				focusFamily: "gourmand",
				lessonCount: 1,
			},
			{
				description: "Medium Aldehydic",
				colors: solidColors("#b8c4d4"),
				focusFamily: "aldehydic",
				lessonCount: 1,
			},
			{
				description: "Medium Resinous / Balsamic",
				colors: solidColors("#9a6b2f"),
				focusFamily: "resinous / balsamic",
				lessonCount: 1,
			},
			{
				description: "Medium Sulfurous",
				colors: solidColors("#a3a34a"),
				focusFamily: "sulfurous",
				lessonCount: 1,
			},
		],
	},
	{
		title: "Section 3",
		subtitle: "Hard Raw Materials - 10 or more notes each",
		status: "locked",
		units: [
			{
				description: "Hard Florals",
				colors: solidColors("#d4849a"),
				focusFamily: "floral",
				lessonCount: 4,
			},
			{
				description: "Hard Fruity",
				colors: solidColors("#e07a5f"),
				focusFamily: "fruity",
				lessonCount: 3,
			},
			{
				description: "Hard Citrus",
				colors: solidColors("#e8c84a"),
				focusFamily: "citrus",
				lessonCount: 3,
			},
			{
				description: "Hard Woody",
				colors: solidColors("#8b6914"),
				focusFamily: "woody",
				lessonCount: 3,
			},
			{
				description: "Hard Green",
				colors: solidColors("#4a8f5c"),
				focusFamily: "green",
				lessonCount: 2,
			},
			{
				description: "Hard Herbal",
				colors: solidColors("#5f8f6a"),
				focusFamily: "herbal",
				lessonCount: 2,
			},
			{
				description: "Hard Spices",
				colors: solidColors("#c45c26"),
				focusFamily: "spices",
				lessonCount: 2,
			},
			{
				description: "Hard Amber",
				colors: solidColors("#FFC107"),
				focusFamily: "amber",
				lessonCount: 2,
			},
			{
				description: "Hard Leather",
				colors: solidColors("#6b3a2a"),
				focusFamily: "leather",
				lessonCount: 1,
			},
			{
				description: "Hard Gourmand",
				colors: solidColors("#c47a5a"),
				focusFamily: "gourmand",
				lessonCount: 1,
			},
			{
				description: "Hard Aldehydic",
				colors: solidColors("#b8c4d4"),
				focusFamily: "aldehydic",
				lessonCount: 1,
			},
			{
				description: "Hard Resinous / Balsamic",
				colors: solidColors("#9a6b2f"),
				focusFamily: "resinous / balsamic",
				lessonCount: 1,
			},
			{
				description: "Hard Sulfurous",
				colors: solidColors("#a3a34a"),
				focusFamily: "sulfurous",
				lessonCount: 1,
			},
		],
	},
];

export function buildCurriculum(): CurriculumSection[] {
	return CURRICULUM.map((section, sectionOffset) => {
		const sectionIndex = sectionOffset + 1;

		return {
			id: `section-${sectionIndex}`,
			title: section.title,
			subtitle: section.subtitle,
			sectionIndex,
			status: section.status,
			units: section.units.map((unit, unitOffset) => {
				const unitIndex = unitOffset + 1;
				const isFirstUnit = sectionIndex === 1 && unitIndex === 1;
				const families = section.units
					.slice(0, unitOffset + 1)
					.map((item) => item.focusFamily);

				return {
					id: `section-${sectionIndex}-unit-${unitIndex}`,
					title: `Unit ${unitIndex}`,
					description: unit.description,
					unitIndex,
					status: isFirstUnit ? "available" : "locked",
					colors: unit.colors,
					focusFamily: unit.focusFamily,
					families,
					lessons: Array.from(
						{ length: unit.lessonCount },
						(_, lessonOffset) => {
							const lessonIndex = lessonOffset + 1;
							const isFirstLesson =
								sectionIndex === 1 && unitIndex === 1 && lessonIndex === 1;

							return {
								id: `section-${sectionIndex}-unit-${unitIndex}-lesson-${lessonIndex}`,
								title: `Lesson ${lessonIndex}`,
								unitIndex,
								lessonIndex,
								status: isFirstLesson ? "available" : "locked",
								repeats: 0,
							};
						},
					),
				};
			}),
		};
	});
}

export function getSectionLessonProgress(section: CurriculumSection): {
	done: number;
	total: number;
} {
	const lessons = section.units.flatMap((unit) => unit.lessons);
	const total = lessons.length;
	const done = lessons.filter(
		(lesson) => lesson.repeats >= 1 || lesson.status === "completed",
	).length;

	return { done, total };
}

export function findSection(
	curriculum: CurriculumSection[],
	sectionId: string,
): CurriculumSection | null {
	return curriculum.find((section) => section.id === sectionId) ?? null;
}

export function findLesson(
	curriculum: CurriculumSection[],
	lessonId: string,
): {
	section: CurriculumSection;
	unit: CurriculumUnit;
	lesson: CurriculumLesson;
} | null {
	for (const section of curriculum) {
		for (const unit of section.units) {
			const lesson = unit.lessons.find((item) => item.id === lessonId);
			if (lesson) {
				return { section, unit, lesson };
			}
		}
	}
	return null;
}

/** After a successful lesson: +1 repeat (max 5), unlock next lesson; finish unit → unlock next unit. */
export function applyLessonPass(
	curriculum: CurriculumSection[],
	lessonId: string,
): CurriculumSection[] {
	return curriculum.map((section) => {
		const unitIndex = section.units.findIndex((unit) =>
			unit.lessons.some((lesson) => lesson.id === lessonId),
		);
		if (unitIndex < 0) return section;

		const units = section.units.map((unit, uIdx) => {
			if (uIdx !== unitIndex) return unit;

			const lessonIndex = unit.lessons.findIndex(
				(lesson) => lesson.id === lessonId,
			);
			if (lessonIndex < 0) return unit;

			const lessons = unit.lessons.map((lesson, lIdx) => {
				if (lIdx === lessonIndex) {
					return {
						...lesson,
						repeats: Math.min(REPEATS_TO_MASTER, lesson.repeats + 1),
						status: "completed" as const,
					};
				}
				if (lIdx === lessonIndex + 1 && lesson.status === "locked") {
					return { ...lesson, status: "available" as const };
				}
				return lesson;
			});

			return { ...unit, lessons };
		});

		const passedUnit = units[unitIndex];
		const passedLesson = passedUnit?.lessons.find(
			(lesson) => lesson.id === lessonId,
		);
		const finishedUnit =
			passedLesson != null &&
			passedLesson.lessonIndex === passedUnit.lessons.length;

		if (finishedUnit && unitIndex + 1 < units.length) {
			const nextUnit = units[unitIndex + 1];
			units[unitIndex + 1] = {
				...nextUnit,
				status: "available",
				lessons: nextUnit.lessons.map((lesson, index) =>
					index === 0 && lesson.status === "locked"
						? { ...lesson, status: "available" as const }
						: lesson,
				),
			};
		}

		return { ...section, units };
	});
}
