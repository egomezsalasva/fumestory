import { randomUUID } from "node:crypto";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

export type ScentBlindTestResult = {
	id: number;
	owner_id: string;
	batch_id: string;
	dilution_id: number;
	matched: boolean;
	created_at: string;
};

export type DilutionBlindTestStats = {
	dilution_id: number;
	attempts: number;
	success_percentage: number;
};

type PostItem = { dilution_id: number; matched: boolean };

export const Route = createFileRoute("/api/scent-blind-tests")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const statsSql = `
						SELECT
							r.dilution_id,
							COUNT(*)::int AS attempts,
							ROUND(
								100.0 * COUNT(*) FILTER (WHERE r.matched) / NULLIF(COUNT(*), 0),
								1
							)::float AS success_percentage
						FROM scent_blind_test_results r
						WHERE r.owner_id = $1
						GROUP BY r.dilution_id
						ORDER BY r.dilution_id
					`;
					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(statsSql, [currentUserId]),
					]);
					const data = txResults[1] as DilutionBlindTestStats[];
					return jsonResponse({ success: true, data }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to fetch scent blind test data",
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

					const body = (await request.json()) as { items?: PostItem[] };
					const items = body.items;

					if (!items || !Array.isArray(items) || items.length === 0) {
						return jsonResponse(
							{ error: "At least one test item is required" },
							400,
						);
					}

					const seen = new Set<number>();
					for (const item of items) {
						if (
							typeof item.dilution_id !== "number" ||
							!Number.isInteger(item.dilution_id)
						) {
							return jsonResponse({ error: "Invalid dilution_id" }, 400);
						}
						if (typeof item.matched !== "boolean") {
							return jsonResponse({ error: "matched must be a boolean" }, 400);
						}
						if (seen.has(item.dilution_id)) {
							return jsonResponse(
								{ error: "Duplicate dilution_id in batch" },
								400,
							);
						}
						seen.add(item.dilution_id);
					}

					const dilutionIds = items.map((i) => i.dilution_id);
					const batchId = randomUUID();

					const verifySql = `
						SELECT d.id
						FROM dilutions d
						JOIN raw_materials rm ON rm.id = d.raw_material_id
						WHERE rm.owner_id = $1
							AND d.available = TRUE
							AND d.id = ANY($2::int[])
					`;

					const insertSql = `
						INSERT INTO scent_blind_test_results
							(owner_id, batch_id, dilution_id, matched)
						VALUES ($1, $2::uuid, $3, $4)
						RETURNING id, owner_id, batch_id, dilution_id, matched, created_at
					`;

					const insertTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(verifySql, [currentUserId, dilutionIds]),
						...items.map((item) =>
							txn.query(insertSql, [
								currentUserId,
								batchId,
								item.dilution_id,
								item.matched,
							]),
						),
					]);

					const allowed = insertTx[1] as { id: number }[];
					if (allowed.length !== dilutionIds.length) {
						return jsonResponse(
							{
								error:
									"One or more dilutions are invalid, unavailable, or not owned by you",
							},
							400,
						);
					}

					const inserted = insertTx
						.slice(2)
						.map((rows) => (rows as ScentBlindTestResult[])[0])
						.filter((row): row is ScentBlindTestResult => row != null);

					return jsonResponse(
						{ success: true, data: { batch_id: batchId, items: inserted } },
						201,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to save scent blind test",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
