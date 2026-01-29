import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";

export type RawMaterial = {
	id: number;
	name: string;
	category_id: number;
	category_name: string;
	note_type: string;
	notes: string[];
	prepared_dilution_percentages: number[];
	created_at: string;
};

export const Route = createFileRoute("/api/raw-materials")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const result = (await client.query(`
                    SELECT
                        rm.id,
                        rm.name ,
                        rm.category_id,
                        c.name as category_name,
                        rm.note_type,
                        rm.notes,
                        rm.created_at
                    FROM raw_materials rm
                    LEFT JOIN categories c ON rm.category_id = c.id
                    ORDER BY rm.id DESC
                `)) as RawMaterial[];

					return jsonResponse(
						{ success: true, data: result as RawMaterial[] },
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to find raw materials",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
			POST: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const body = await request.json();
					const { name, category_id, note_type, notes } = body;

					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse(
							{ error: "Raw material name is required " },
							400,
						);
					}

					const [result] = (await client.query(
						`INSERT INTO raw_materials (name, category_id, note_type, notes)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, name, category_id, note_type, notes, created_at`,
						[
							name.trim(),
							category_id || null,
							note_type || null,
							JSON.stringify(notes || []),
						],
					)) as RawMaterial[];

					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create raw material",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
