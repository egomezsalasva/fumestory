import type { MaterialRecord } from "@/curation/materials/types";
import { getMaterialDisplayNames } from "./materialSources";
import { getMaterialProducerNotes, getProducerNotesPool } from "./notesPool";
import { pickRandomMaterial } from "./pickRandomMaterial";
import { pickFormatForMaterial, type QuizFormat } from "./lessonDifficulty";
import type { MaterialMasteryMap } from "./materialMastery";

export type QuizQuestion = {
	material: MaterialRecord;
	displayNames: string[];
	/** All notes the user must select. */
	correctNotes: string[];
	/** @deprecated Prefer correctNotes — kept as correctNotes[0] for older UI. */
	correctNote: string;
	options: string[];
	format: QuizFormat;
};

function pickRandomItem<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function pickRandomItems<T>(items: T[], count: number): T[] {
	if (count <= 0) return [];
	if (items.length < count) {
		throw new Error(`Need ${count} items but only ${items.length} available`);
	}

	const copy = [...items];
	const picked: T[] = [];

	for (let i = 0; i < count; i++) {
		const index = Math.floor(Math.random() * copy.length);
		picked.push(copy[index]);
		copy.splice(index, 1);
	}

	return picked;
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];

	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}

	return copy;
}

function uniqueNotes(notes: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const note of notes) {
		const key = note.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(note);
	}
	return out;
}

function buildQuestion(
	material: MaterialRecord,
	allMaterials: MaterialRecord[],
	format: QuizFormat,
): QuizQuestion {
	const materialNotes = uniqueNotes(getMaterialProducerNotes(material));

	if (materialNotes.length === 0) {
		throw new Error(
			`Material "${material.canonicalName}" has no producer notes`,
		);
	}

	const correctCount = Math.min(format.correct, materialNotes.length);
	const optionCount = Math.max(format.options, correctCount);
	const correctNotes = pickRandomItems(materialNotes, correctCount);

	const correctKeys = new Set(correctNotes.map((note) => note.toLowerCase()));
	const pool = getProducerNotesPool(allMaterials);
	const distractorPool = pool.filter(
		(note) => !correctKeys.has(note.toLowerCase()),
	);

	const distractorNeed = optionCount - correctCount;
	const distractors =
		distractorPool.length >= distractorNeed
			? pickRandomItems(distractorPool, distractorNeed)
			: distractorPool;

	const options = shuffle([...correctNotes, ...distractors]);

	return {
		material,
		displayNames: getMaterialDisplayNames(material),
		correctNotes,
		correctNote: correctNotes[0] ?? "",
		options,
		format: { correct: correctCount, options: options.length },
	};
}

export function generateQuestion(
	materials: MaterialRecord[],
	mastery: MaterialMasteryMap = {},
	lessonFormat?: QuizFormat,
): QuizQuestion {
	const material = pickRandomMaterial(materials);
	const format = lessonFormat ?? pickFormatForMaterial(material, mastery);
	return buildQuestion(material, materials, format);
}

export function generateQuestionForMaterial(
	material: MaterialRecord,
	allMaterials: MaterialRecord[],
	mastery: MaterialMasteryMap = {},
	lessonFormat?: QuizFormat,
): QuizQuestion {
	const format = lessonFormat ?? pickFormatForMaterial(material, mastery);
	return buildQuestion(material, allMaterials, format);
}
