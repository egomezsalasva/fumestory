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
	batch_weight_grams: number | null;
};

/** Postgres `numeric` may come back as string from the driver */
function batchWeightGramsFromDb(value: string | number | null): number | null {
	return value == null ? null : Number(value);
}

type DilutionRow = Omit<Dilution, "batch_weight_grams"> & {
	batch_weight_grams: string | number | null;
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
							d.created_at,
							d.batch_weight_grams
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
					const rows = txResults[1] as DilutionRow[];
					const result: Dilution[] = rows.map((r) => ({
						...r,
						batch_weight_grams: batchWeightGramsFromDb(r.batch_weight_grams),
					}));

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
					const {
						raw_material_id,
						percentage,
						dilution_date,
						batch_weight_grams,
					} = body as {
						raw_material_id: Dilution["raw_material_id"];
						percentage: Dilution["percentage"];
						dilution_date: Dilution["dilution_date"];
						batch_weight_grams?: Dilution["batch_weight_grams"] | null;
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

					let batchWeightSql: number | null = null;
					if (batch_weight_grams !== undefined && batch_weight_grams !== null) {
						if (
							typeof batch_weight_grams !== "number" ||
							!Number.isFinite(batch_weight_grams) ||
							batch_weight_grams <= 0
						) {
							return jsonResponse(
								{
									error:
										"When provided, batch_weight_grams must be a finite number greater than 0",
								},
								400,
							);
						}
						batchWeightSql = batch_weight_grams;
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
                        INSERT INTO dilutions (raw_material_id, percentage, dilution_date, batch_weight_grams)
                        VALUES($1, $2, $3, $4)
                        RETURNING id, raw_material_id, percentage, dilution_date, available, created_at, batch_weight_grams
                    `,
							[
								raw_material_id,
								percentage,
								dilution_date || null,
								batchWeightSql,
							],
						),
					]);

					const [raw] = insertTx[1] as DilutionRow[];
					if (!raw) {
						return jsonResponse({ error: "Failed to create dilution" }, 500);
					}
					const result: Dilution = {
						...raw,
						batch_weight_grams: batchWeightGramsFromDb(raw.batch_weight_grams),
					};
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
					RETURNING d.id, d.raw_material_id, d.percentage, d.dilution_date, d.available, d.created_at, d.batch_weight_grams
					`;
					const patchTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(updateSql, [id, available, currentUserId]),
					]);
					const rows = patchTx[1] as DilutionRow[];
					const [raw] = rows;
					if (!raw) {
						return jsonResponse({ error: "Dilution not found" }, 404);
					}
					const result: Dilution = {
						...raw,
						batch_weight_grams: batchWeightGramsFromDb(raw.batch_weight_grams),
					};
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
