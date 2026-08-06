import type { MaterialRecord } from "@/curation/materials/types";
import { getMaterialProducerNotes } from "./notesPool";
import {
	getMasteryValue,
	normalizeMaterialKey,
	type MaterialMasteryMap,
} from "./materialMastery";

/** One quiz shape: pick `correct` notes out of `options` choices. */
export type QuizFormat = {
	correct: number;
	options: number;
};

/** Lesson map node: picks, quiz shape, and min producer notes on eligible cards. */
export type LessonFormat = {
	picks: number;
	optionCount: number;
	minCorrect: number;
	maxCorrect: number;
	/** Pool/quiz materials must have at least this many producer notes. */
	minNotes: number;
};

export type LessonLadderId = "intro" | "intro-short" | "more" | "default";

type LessonRung = {
	picks: number;
	format: QuizFormat;
	minNotes: number;
};

/**
 * Stage k (1-based) format pools (mastery path — fallback when no lesson rung).
 * 1: 1/4
 * 2: 2/4 · 1/6 · 2/6
 * 3: 3/6 · 2/8 · 3/8
 * 4: 4/8
 * 5: 5/8
 */
const STAGE_FORMATS: QuizFormat[][] = [
	[{ correct: 1, options: 4 }],
	[
		{ correct: 2, options: 4 },
		{ correct: 1, options: 6 },
		{ correct: 2, options: 6 },
	],
	[
		{ correct: 3, options: 6 },
		{ correct: 2, options: 8 },
		{ correct: 3, options: 8 },
	],
	[{ correct: 4, options: 8 }],
	[{ correct: 5, options: 8 }],
];

/**
 * Intro ladder (Florals, Fruity, Citrus, Woody) — 6 lessons.
 * Grow picks slowly; 2/4 only after same pick size with 1/4.
 */
const INTRO_LADDER: LessonRung[] = [
	{ picks: 1, format: { correct: 1, options: 4 }, minNotes: 1 },
	{ picks: 1, format: { correct: 2, options: 4 }, minNotes: 2 },
	{ picks: 2, format: { correct: 1, options: 4 }, minNotes: 1 },
	{ picks: 2, format: { correct: 2, options: 4 }, minNotes: 2 },
	{ picks: 3, format: { correct: 1, options: 4 }, minNotes: 1 },
	{ picks: 3, format: { correct: 2, options: 4 }, minNotes: 2 },
];

/**
 * Intro short (Green, Herbal, Spices) — 5 lessons.
 * Same as intro but skips 2-pick × 1/4.
 */
const INTRO_SHORT_LADDER: LessonRung[] = [
	{ picks: 1, format: { correct: 1, options: 4 }, minNotes: 1 },
	{ picks: 1, format: { correct: 2, options: 4 }, minNotes: 2 },
	{ picks: 2, format: { correct: 2, options: 4 }, minNotes: 2 },
	{ picks: 3, format: { correct: 1, options: 4 }, minNotes: 1 },
	{ picks: 3, format: { correct: 2, options: 4 }, minNotes: 2 },
];

/**
 * More Florals / Fruity / Citrus / Woody — 1 pick; escalate precision.
 */
const MORE_LADDER: LessonRung[] = [
	{ picks: 1, format: { correct: 2, options: 6 }, minNotes: 2 },
	{ picks: 1, format: { correct: 3, options: 6 }, minNotes: 3 },
	{ picks: 1, format: { correct: 3, options: 8 }, minNotes: 3 },
	{ picks: 1, format: { correct: 4, options: 8 }, minNotes: 4 },
	{ picks: 1, format: { correct: 5, options: 8 }, minNotes: 5 },
];

const LADDERS: Record<LessonLadderId, LessonRung[]> = {
	intro: INTRO_LADDER,
	"intro-short": INTRO_SHORT_LADDER,
	more: MORE_LADDER,
	default: INTRO_LADDER,
};

const INTRO_UNIT_DESCRIPTIONS = new Set([
	"florals",
	"fruity",
	"citrus",
	"woody",
]);

const INTRO_SHORT_UNIT_DESCRIPTIONS = new Set(["green", "herbal", "spices"]);

export function resolveLadderId(unitDescription: string): LessonLadderId {
	const key = unitDescription.trim().toLowerCase();
	if (key.startsWith("more ")) return "more";
	if (INTRO_SHORT_UNIT_DESCRIPTIONS.has(key)) return "intro-short";
	if (INTRO_UNIT_DESCRIPTIONS.has(key)) return "intro";
	return "default";
}

function rungFor(ladderId: LessonLadderId, lessonIndex: number): LessonRung {
	const ladder = LADDERS[ladderId];
	const index = Math.min(ladder.length, Math.max(1, lessonIndex)) - 1;
	return ladder[index] ?? ladder[0];
}

export function lessonFormatForLesson(
	unitDescription: string,
	lessonIndex: number,
): LessonFormat {
	const rung = rungFor(resolveLadderId(unitDescription), lessonIndex);
	return {
		picks: rung.picks,
		optionCount: rung.format.options,
		minCorrect: rung.format.correct,
		maxCorrect: rung.format.correct,
		minNotes: rung.minNotes,
	};
}

/** @deprecated Prefer lessonFormatForLesson(unitDescription, lessonIndex). */
export function lessonFormatForIndex(lessonIndex: number): LessonFormat {
	return lessonFormatForLesson("Florals", lessonIndex);
}

/** Forced quiz shape for this lesson rung (clamped later by note count). */
export function quizFormatForLesson(
	unitDescription: string,
	lessonIndex: number,
): QuizFormat {
	const format = lessonFormatForLesson(unitDescription, lessonIndex);
	return { correct: format.minCorrect, options: format.optionCount };
}

export function materialNoteCount(material: MaterialRecord): number {
	return getMaterialProducerNotes(material).length;
}

export function materialMeetsMinNotes(
	material: MaterialRecord,
	minNotes: number,
): boolean {
	return materialNoteCount(material) >= Math.max(1, minNotes);
}

/**
 * Band index 0..N-1 for an N-note material.
 * e.g. 2 notes → 0–10 / 10–20; 4 notes → 0–5 / 5–10 / 10–15 / 15–20.
 */
export function masteryBandIndex(mastery: number, noteCount: number): number {
	const n = Math.max(1, noteCount);
	const step = 20 / n;
	return Math.min(n - 1, Math.max(0, Math.floor(mastery / step)));
}

/** Formats for this stage, clamped to noteCount and deduped. */
export function formatsForStage(
	noteCount: number,
	bandIndex: number,
): QuizFormat[] {
	const stage = STAGE_FORMATS[bandIndex] ?? STAGE_FORMATS[0];
	const seen = new Set<string>();
	const out: QuizFormat[] = [];

	for (const format of stage) {
		const correct = Math.min(format.correct, Math.max(1, noteCount));
		const options = Math.max(format.options, correct);
		const key = `${correct}/${options}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push({ correct, options });
	}

	return out.length > 0 ? out : [{ correct: 1, options: 4 }];
}

function pickRandomFormat(formats: QuizFormat[]): QuizFormat {
	return (
		formats[Math.floor(Math.random() * formats.length)] ?? {
			correct: 1,
			options: 4,
		}
	);
}

/** Random format from the material's mastery band (split by its note count). */
export function pickFormatForMaterial(
	material: MaterialRecord,
	mastery: MaterialMasteryMap,
): QuizFormat {
	const notes = Math.max(1, materialNoteCount(material));
	const value = getMasteryValue(mastery, normalizeMaterialKey(material));
	const band = masteryBandIndex(value, notes);
	return pickRandomFormat(formatsForStage(notes, band));
}

/** Prefer materials whose stage is at or below the lesson soft ceiling. */
export function materialFitsLessonBand(
	material: MaterialRecord,
	masteryMap: MaterialMasteryMap,
	format: LessonFormat,
): boolean {
	const notes = Math.max(1, materialNoteCount(material));
	const value = getMasteryValue(masteryMap, normalizeMaterialKey(material));
	const band = masteryBandIndex(value, notes);
	return band + 1 <= format.maxCorrect;
}
