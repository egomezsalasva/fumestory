import type { MaterialRecord } from "@/curation/materials/types";
import { getMaterialDisplayNames } from "./materialSources";
import { getMaterialProducerNotes, getProducerNotesPool } from "./notesPool";
import { pickRandomMaterial } from "./pickRandomMaterial";

export type QuizQuestion = {
	material: MaterialRecord;
	displayNames: string[];
	correctNote: string;
	options: string[];
};

function pickRandomItem<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

function pickRandomItems<T>(items: T[], count: number): T[] {
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

export function generateQuestion(materials: MaterialRecord[]): QuizQuestion {
	const material = pickRandomMaterial(materials);
	const materialNotes = getMaterialProducerNotes(material);

	if (materialNotes.length === 0) {
		throw new Error(
			`Material "${material.canonicalName}" has no producer notes`,
		);
	}

	const correctNote = pickRandomItem(materialNotes);

	const pool = getProducerNotesPool(materials);
	const materialNoteKeys = new Set(
		materialNotes.map((note) => note.toLowerCase()),
	);

	const distractorPool = pool.filter(
		(note) => !materialNoteKeys.has(note.toLowerCase()),
	);

	const distractors = pickRandomItems(distractorPool, 3);
	const options = shuffle([correctNote, ...distractors]);

	return {
		material,
		displayNames: getMaterialDisplayNames(material),
		correctNote,
		options,
	};
}
