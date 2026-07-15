import type { MaterialRecord } from "@/curation/materials/types";
import { PRODUCER_SOURCES } from "./producerMaterials";

const PRODUCER_SOURCE_SET = new Set(PRODUCER_SOURCES);

/** Notes from Givaudan / Firmenich / Symrise / IFF sources on one material */
export function getMaterialProducerNotes(material: MaterialRecord): string[] {
	return (material.sources ?? [])
		.filter((s) => PRODUCER_SOURCE_SET.has(s.sourceName))
		.flatMap((s) => s.data?.notes ?? []);
}

/** All unique notes across producer materials (case-insensitive dedup) */
export function getProducerNotesPool(materials: MaterialRecord[]): string[] {
	const seen = new Set<string>();
	const pool: string[] = [];

	for (const material of materials) {
		for (const note of getMaterialProducerNotes(material)) {
			const key = note.toLowerCase();
			if (!seen.has(key)) {
				seen.add(key);
				pool.push(note);
			}
		}
	}

	return pool;
}
