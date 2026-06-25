import type {
	MaterialRecord,
	SourceData,
	SourceEntry,
} from "@/curation/materials/types";
import { PRODUCER_SOURCES } from "./producerMaterials";

const PRODUCER_SOURCE_SET = new Set(PRODUCER_SOURCES);

export function getMaterialProducerSources(
	material: MaterialRecord,
): SourceEntry[] {
	return (material.sources ?? []).filter((s) =>
		PRODUCER_SOURCE_SET.has(s.sourceName),
	);
}

export function getSourceLink(data: SourceData): string | null {
	return data.pdfUrl ?? data.url ?? null;
}

export function getMaterialDisplayNames(material: MaterialRecord): string[] {
	const sources = getMaterialProducerSources(material);
	const names: string[] = [];
	const seen = new Set<string>();

	for (const source of sources) {
		const name = source.data.nameUsed;
		if (!name) continue;

		const key = name.toLowerCase();
		if (seen.has(key)) continue;

		seen.add(key);
		names.push(name);
	}

	if (names.length === 0) {
		return [material.canonicalName];
	}

	return names;
}
