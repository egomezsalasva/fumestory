import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

export type Dilution = {
	id: number;
	raw_material_id: number;
	percentage: number;
	dilution_date: string | null;
	available: boolean;
	created_at: string;
};

export const Route = createFileRoute("/api/dilutions")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
					const selectSql = `
                        SELECT
                            d.id,
							d.raw_material_id,
							d.percentage,
							d.dilution_date,
							d.available,
							d.created_at
                        FROM dilutions d
						JOIN raw_materials rm ON rm.id = d.raw_material_id
						WHERE rm.owner_id = $1
						ORDER BY d.created_at DESC
                    `;
					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(selectSql, [currentUserId]),
					]);
					const result = txResults[1] as Dilution[];

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
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
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

					const ownTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`SELECT 1
						 FROM raw_materials
						 WHERE id = $1 AND owner_id = $2`,
							[raw_material_id, currentUserId],
						),
					]);

					const owns = ownTx[1] as { "?column?"?: number }[];

					if (owns.length === 0) {
						return jsonResponse(
							{ error: "Not allowed for this raw material" },
							403,
						);
					}

					const insertTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
                        INSERT INTO dilutions (raw_material_id, percentage, dilution_date)
                        VALUES($1, $2, $3)
                        RETURNING id, raw_material_id, percentage, dilution_date    
                    `,
							[raw_material_id, percentage, dilution_date || null],
						),
					]);

					const [result] = insertTx[1] as Dilution[];
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
			PATCH: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
					const body = await request.json();
					const { id, available } = body as {
						id: Dilution["id"];
						available: Dilution["available"];
					};
					if (!id || typeof id !== "number") {
						return jsonResponse({ error: "Dilution ID is required" }, 400);
					}
					if (typeof available !== "boolean") {
						return jsonResponse({ error: "Available must be a boolean" }, 400);
					}
					const updateSql = `
					UPDATE dilutions d
					SET available = $2
					FROM raw_materials rm
					WHERE d.id = $1
					  AND rm.id = d.raw_material_id
					  AND rm.owner_id = $3
					RETURNING d.id, d.raw_material_id, d.percentage, d.dilution_date, d.available, d.created_at
					`;
					const patchTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(updateSql, [id, available, currentUserId]),
					]);
					const rows = patchTx[1] as Dilution[];
					const [result] = rows;
					if (!result) {
						return jsonResponse({ error: "Dilution not found" }, 404);
					}
					return jsonResponse({ success: true, data: result }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to update dilution",
							details: getErrorDetails(error),
						},
						400,
					);
				}
			},
		},
	},
});
