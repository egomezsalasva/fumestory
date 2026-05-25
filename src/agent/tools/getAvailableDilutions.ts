import { getClient } from "@/db";

export type AvailableDilution = {
	dilutionId: number;
	percentage: number;
	rawMaterialId: number;
	materialName: string;
	materialLabel: string;
	noteType: string;
};

type AvailableDilutionRow = {
	dilution_id: number;
	percentage: number;
	raw_material_id: number;
	material_name: string;
	material_label: string;
	note_type: string;
};

const selectSql = `
	SELECT
		d.id AS dilution_id,
		d.percentage,
		rm.id AS raw_material_id,
		rm.name AS material_name,
		rm.label AS material_label,
		rm.note_type
	FROM dilutions d
	JOIN raw_materials rm ON rm.id = d.raw_material_id
	WHERE rm.owner_id = $1
	  AND d.available = TRUE
	ORDER BY rm.name ASC, d.percentage ASC
`;

export async function getAvailableDilutions(
	userId: string,
): Promise<AvailableDilution[]> {
	const client = await getClient();
	if (!client) {
		return [];
	}

	const txResults = await client.transaction((txn) => [
		txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]),
		txn.query(selectSql, [userId]),
	]);

	const rows = txResults[1] as AvailableDilutionRow[];

	return rows.map((row) => ({
		dilutionId: row.dilution_id,
		percentage: row.percentage,
		rawMaterialId: row.raw_material_id,
		materialName: row.material_name,
		materialLabel: row.material_label,
		noteType: row.note_type,
	}));
}

export function countUniqueRawMaterials(
	dilutions: AvailableDilution[],
): number {
	return new Set(dilutions.map((d) => d.rawMaterialId)).size;
}

function materialDisplayName(d: AvailableDilution): string {
	return d.materialLabel && d.materialLabel !== d.materialName
		? `${d.materialName} (${d.materialLabel})`
		: d.materialName;
}

function normalizeMaterialKey(name: string): string {
	return name.trim().toLowerCase();
}

export function inventoryRawMaterialIds(
	dilutions: AvailableDilution[],
): Set<number> {
	return new Set(dilutions.map((d) => d.rawMaterialId));
}

export function resolveRawMaterialId(
	displayName: string,
	dilutions: AvailableDilution[],
): number | null {
	const key = normalizeMaterialKey(displayName);
	for (const d of dilutions) {
		if (normalizeMaterialKey(materialDisplayName(d)) === key) {
			return d.rawMaterialId;
		}
		if (normalizeMaterialKey(d.materialName) === key) {
			return d.rawMaterialId;
		}
	}
	return null;
}

export function formatAllowedInventoryMaterialNames(
	dilutions: AvailableDilution[],
): string {
	const names = new Set(dilutions.map((d) => materialDisplayName(d)));
	return [...names]
		.sort()
		.map((n) => `- ${n}`)
		.join("\n");
}

/** e.g. 10 → "10", 10.5 → "10.5" (no trailing .0) */
export function formatPercent(value: number): string {
	const n = Number(value);
	if (!Number.isFinite(n)) return String(value);
	if (Math.abs(n - Math.round(n)) < 1e-9) {
		return String(Math.round(n));
	}
	return String(parseFloat(n.toFixed(4)));
}

export function formatAvailableDilutionsForPrompt(
	dilutions: AvailableDilution[],
	options?: { includeInternalIds?: boolean },
): string {
	if (dilutions.length === 0) {
		return "(none)";
	}

	const includeInternalIds = options?.includeInternalIds ?? false;

	const byMaterial = new Map<number, AvailableDilution[]>();
	for (const d of dilutions) {
		const group = byMaterial.get(d.rawMaterialId) ?? [];
		group.push(d);
		byMaterial.set(d.rawMaterialId, group);
	}

	return [...byMaterial.values()]
		.map((group) => {
			const first = group[0];
			const note = first.noteType ? ` · ${first.noteType}` : "";
			const optionsText = group
				.map((d) =>
					includeInternalIds
						? `dilution_id=${d.dilutionId} ${formatPercent(d.percentage)}%`
						: `${formatPercent(d.percentage)}%`,
				)
				.join(", ");
			const pickHint =
				group.length > 1
					? " — use exactly one of these dilutions in the formula"
					: "";
			return `- ${materialDisplayName(first)}${note}: ${optionsText}${pickHint}`;
		})
		.join("\n");
}
