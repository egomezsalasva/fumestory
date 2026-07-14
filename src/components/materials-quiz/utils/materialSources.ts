import type {
	MaterialRecord,
	SourceEntry,
	SourceName,
} from "@/curation/materials/types";
import { PRODUCER_SOURCES } from "./producerMaterials";

const PRODUCER_SOURCE_SET = new Set(PRODUCER_SOURCES);

/** Fragrance/chemical producers — not distributors, retailers, or aggregators. */
const MANUFACTURER_SOURCES = new Set<SourceName>([
	"Givaudan",
	"Firmenich",
	"Symrise",
	"IFF",
	"Bedoukian",
]);

export function getMaterialProducerSources(
	material: MaterialRecord,
): SourceEntry[] {
	return (material.sources ?? []).filter((s) =>
		PRODUCER_SOURCE_SET.has(s.sourceName),
	);
}

export function isManufacturerSource(source: SourceEntry): boolean {
	return MANUFACTURER_SOURCES.has(source.sourceName);
}

export function getSourceNameUsed(
	data: SourceEntry["data"],
): string | undefined {
	return "nameUsed" in data ? data.nameUsed : undefined;
}

export function getSourceCardKey(source: SourceEntry): string {
	const suffix =
		getSourceNameUsed(source.data) ??
		("url" in source.data ? source.data.url : undefined) ??
		("pdfUrl" in source.data ? source.data.pdfUrl : undefined) ??
		"unknown";

	return `${source.sourceName}-${suffix}`;
}

export function getSourceLink(data: SourceEntry["data"]): string | null {
	if ("pdfUrl" in data && data.pdfUrl) return data.pdfUrl;
	if ("url" in data && data.url) return data.url;
	return null;
}

export function getMaterialDisplayNames(material: MaterialRecord): string[] {
	const sources = getMaterialProducerSources(material);
	const names: string[] = [];
	const seen = new Set<string>();

	for (const source of sources) {
		const name = getSourceNameUsed(source.data);
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
