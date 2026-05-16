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

export function formatAvailableDilutionsForPrompt(
	dilutions: AvailableDilution[],
): string {
	if (dilutions.length === 0) {
		return "(none)";
	}

	return dilutions
		.map((d) => {
			const label =
				d.materialLabel && d.materialLabel !== d.materialName
					? `${d.materialName} (${d.materialLabel})`
					: d.materialName;
			const note = d.noteType ? ` · ${d.noteType}` : "";
			return `- dilution_id=${d.dilutionId}: ${label} - ${d.percentage}%${note}`;
		})
		.join("\n");
}
