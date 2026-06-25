import { curatedMaterialsData } from "@/curation/materials/data/curated-2026-06-24T16-00-53";
import type { MaterialRecord, SourceName } from "@/curation/materials/types";

export const PRODUCER_SOURCES: SourceName[] = [
	"Givaudan",
	"Firmenich",
	"Symrise",
	"IFF",
];

const PRODUCER_SOURCE_SET = new Set<SourceName>(PRODUCER_SOURCES);

export function hasProducerSource(material: MaterialRecord): boolean {
	return (material.sources ?? []).some((s) =>
		PRODUCER_SOURCE_SET.has(s.sourceName),
	);
}

export function getProducerMaterials(): MaterialRecord[] {
	return curatedMaterialsData.materials.filter(hasProducerSource);
}
