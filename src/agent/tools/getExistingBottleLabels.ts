import { getClient } from "@/db";

export async function getExistingBottleLabels(
	userId: string,
): Promise<(string | null)[]> {
	const client = await getClient();
	if (!client) {
		return [];
	}

	const sql = `
		SELECT label FROM raw_materials WHERE owner_id = $1 AND label IS NOT NULL
		UNION ALL
		SELECT label FROM compositions WHERE owner_id = $1 AND label IS NOT NULL
	`;

	const txResults = await client.transaction((txn) => [
		txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]),
		txn.query(sql, [userId]),
	]);

	const rows = txResults[1] as Array<{ label: string }>;
	return rows.map((row) => row.label);
}
