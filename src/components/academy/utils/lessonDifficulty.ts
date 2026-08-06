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

/** Lesson map node: how many cards to pick + soft pool band (tunable later). */
export type LessonFormat = {
	picks: number;
	optionCount: number;
	minCorrect: number;
	maxCorrect: number;
};

/**
 * Stage k (1-based) format pools.
 * Material with N notes only uses stages 1..N; mastery split into N equal bands.
 *
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

/** Placeholder lesson ladder — picks only; quiz format comes from mastery. */
export function lessonFormatForIndex(lessonIndex: number): LessonFormat {
	const picks = Math.min(6, Math.max(3, 2 + lessonIndex));
	return {
		picks,
		optionCount: 4,
		minCorrect: 1,
		maxCorrect: 1,
	};
}

export function materialNoteCount(material: MaterialRecord): number {
	return getMaterialProducerNotes(material).length;
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
	// Stage is 1-based for “how many notes we’re aiming at”
	return band + 1 <= format.maxCorrect;
}
