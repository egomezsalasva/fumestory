import { curatedMaterialsData } from "@/curation/materials/data";
import type { IfraStatus, MaterialRecord } from "@/curation/materials/types";

export const IFRA_STATUS_ORDER: IfraStatus[] = [
	"prohibition",
	"restriction",
	"specification",
];

const byName = new Map<string, MaterialRecord>();
const byCas = new Map<string, MaterialRecord>();

for (const material of curatedMaterialsData.materials) {
	for (const name of [material.canonicalName, ...material.otherNames]) {
		const key = name.trim().toLowerCase();
		if (key && !byName.has(key)) {
			byName.set(key, material);
		}
	}

	for (const cas of material.cas ?? []) {
		const key = cas.trim();
		if (key && !byCas.has(key)) {
			byCas.set(key, material);
		}
	}
}

export function findMaterialByName(input: string): MaterialRecord | null {
	const key = input.trim().toLowerCase();
	if (!key) return null;
	return byName.get(key) ?? null;
}

export function findMaterialByCas(
	input: string | null | undefined,
): MaterialRecord | null {
	if (input == null) return null;
	const key = input.trim();
	if (!key) return null;
	return byCas.get(key) ?? null;
}

export function getIfraStatuses(material: MaterialRecord): IfraStatus[] {
	const rules = material.regulatory?.ifra?.rules ?? [];
	const found = new Set<IfraStatus>();

	for (const rule of rules) {
		found.add(rule.status);
	}

	return IFRA_STATUS_ORDER.filter((status) => found.has(status));
}
