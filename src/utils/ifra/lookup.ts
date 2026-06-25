import { curatedMaterialsData } from "@/curation/materials/data/data";
import type {
	IfraRule,
	IfraStatus,
	MaterialRecord,
} from "@/curation/materials/types";

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

export function collectMatchedMaterials(
	fromName: MaterialRecord | null,
	fromCas: MaterialRecord | null,
): MaterialRecord[] {
	const materials = new Map<string, MaterialRecord>();
	if (fromName) materials.set(fromName.canonicalName, fromName);
	if (fromCas) materials.set(fromCas.canonicalName, fromCas);
	return [...materials.values()];
}

export type IfraMaterialRules = {
	material: MaterialRecord;
	rules: IfraRule[];
};

export function getIfraRulesForStatus(
	materials: MaterialRecord[],
	status: IfraStatus,
): IfraMaterialRules[] {
	return materials
		.map((material) => ({
			material,
			rules: (material.regulatory?.ifra?.rules ?? []).filter(
				(rule) => rule.status === status,
			),
		}))
		.filter((entry) => entry.rules.length > 0);
}
