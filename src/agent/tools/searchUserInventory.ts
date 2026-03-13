import { getClient } from "@/db";

export async function searchUserInventory(
	materialName: string,
	userInput: string, // Original user input for the message
): Promise<{ found: boolean; message: string | null }> {
	const client = await getClient();
	if (!client) {
		return { found: false, message: null };
	}

	const results = (await client.query(
		`SELECT name
		FROM raw_materials
		WHERE name ILIKE $1
		ORDER BY name
		`,
		[`%${materialName}%`],
	)) as Array<{ name: string }>;

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
