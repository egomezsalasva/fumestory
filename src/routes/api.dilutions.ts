import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";

export type Dilution = {
	id: number;
	raw_material_id: number;
	percentage: number;
	dilution_date: string | null;
	created_at: string;
};

export const Route = createFileRoute("/api/dilutions")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const result = (await client.query(`
                        SELECT
                            id,
                            raw_material_id,
                            percentage,
                            dilution_date,
                            created_at
                        FROM dilutions
                    `)) as Dilution[];

					return jsonResponse({ success: true, data: result }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to find dilutions",
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
					const { raw_material_id, percentage, dilution_date } = body as {
						raw_material_id: Dilution["raw_material_id"];
						percentage: Dilution["percentage"];
						dilution_date: Dilution["dilution_date"];
					};
					if (!raw_material_id || typeof raw_material_id !== "number") {
						return jsonResponse({ error: "Raw material id is required" }, 400);
					}
					if (
						!percentage ||
						typeof percentage !== "number" ||
						percentage <= 0 ||
						percentage > 100
					) {
						return jsonResponse({ error: "Valid percentage is required" }, 400);
					}
					const [result] = (await client.query(
						`
                        INSERT INTO dilutions (raw_material_id, percentage, dilution_date)
                        VALUES($1, $2, $3)
                        RETURNING id, raw_material_id, percentage, dilution_date    
                    `,
						[raw_material_id, percentage, dilution_date || null],
					)) as Dilution[];
					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create dilution",
							details: getErrorDetails(error),
						},
						400,
					);
				}
			},
		},
	},
});
