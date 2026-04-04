import { getClient } from "@/db";

export async function searchUserInventory(
	userId: string,
	materialName: string,
	userInput: string,
): Promise<{ found: boolean; message: string | null }> {
	const client = await getClient();
	if (!client) {
		return { found: false, message: null };
	}

	const selectSql = `SELECT name
		FROM raw_materials
		WHERE name ILIKE $1
		  AND owner_id = $2::uuid
		ORDER BY name`;

	const txResults = await client.transaction((txn) => [
		txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]),
		txn.query(selectSql, [`%${materialName}%`, userId]),
	]);

	const results = txResults[1] as Array<{ name: string }>;

	if (results.length === 0) {
		return { found: false, message: null };
	}

	if (results.length === 1) {
		return {
			found: true,
			message: `You already have **${results[0].name}** in your inventory.\n\nDo you still want information about ${userInput.trim()}?`,
		};
	}

	const materialList = results.map((m) => `- **${m.name}**`).join("\n");
	return {
		found: true,
		message: `You already have the following materials in your inventory that match "${userInput.trim()}":\n\n${materialList}\n\nDo you still want information about ${userInput.trim()}?`,
	};
}
