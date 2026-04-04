import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

export type Formula = {
	id: number;
	name: string;
	type: "trial" | "accord" | "perfume";
	created_at: string;
};

export const Route = createFileRoute("/api/formulas")({
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
						f.*,
						COUNT(fd.id)::int as ingredient_count,
						COALESCE(SUM(fd.weight_grams), 0) as total_weight,
						COALESCE(
							json_agg(
								json_build_object(
									'material_name', rm.name,
									'percentage', fd.percentage
								) ORDER BY fd.percentage DESC
							) FILTER (WHERE fd.id IS NOT NULL),
							'[]'
						) as ingredients
					FROM formulas f
					LEFT JOIN formula_dilutions fd ON f.id = fd.formula_id
					LEFT JOIN dilutions d ON fd.dilution_id = d.id
					LEFT JOIN raw_materials rm ON d.raw_material_id = rm.id
					WHERE f.owner_id = $1
					GROUP BY f.id
					ORDER BY f.created_at DESC
				`;

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(selectSql, [currentUserId]),
					]);

					const formulas = txResults[1];

					return jsonResponse({ success: true, data: formulas }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load formulas",
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
					const { name, type, ingredients } = body as {
						name: string;
						type: Formula["type"];
						ingredients: {
							dilution_id: number;
							weight_grams: number;
							formula_percentage: number;
						}[];
					};

					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse({ error: "Name is required" }, 400);
					}

					if (!["trial", "accord", "perfume"].includes(type)) {
						return jsonResponse({ error: "Invalid formula type" }, 400);
					}

					if (
						!ingredients ||
						!Array.isArray(ingredients) ||
						ingredients.length === 0
					) {
						return jsonResponse(
							{ error: "At least one ingredient is required" },
							400,
						);
					}

					const dilutionIds = ingredients.map((ing) => ing.dilution_id);

					if (
						dilutionIds.some(
							(id) => typeof id !== "number" || Number.isNaN(id) || id <= 0,
						)
					) {
						return jsonResponse(
							{ error: "Invalid dilution id in ingredients" },
							400,
						);
					}

					const ownTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
					SELECT d.id
					FROM dilutions d
					JOIN raw_materials rm ON rm.id = d.raw_material_id
					WHERE d.id = ANY($1::int[])
					  AND rm.owner_id = $2
					`,
							[dilutionIds, currentUserId],
						),
					]);

					const ownedDilutions = ownTx[1] as { id: number }[];

					const ownedSet = new Set(ownedDilutions.map((d) => d.id));
					const unauthorized = dilutionIds.filter((id) => !ownedSet.has(id));

					if (unauthorized.length > 0) {
						return jsonResponse(
							{
								error: "One or more ingredients are not allowed for this user",
							},
							403,
						);
					}

					const insertFormulaTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`INSERT INTO formulas (name, type, owner_id)
						 VALUES ($1, $2, $3)
						 RETURNING *`,
							[name.trim(), type, currentUserId],
						),
					]);

					const formula = (insertFormulaTx[1] as Formula[])[0];
					if (!formula) {
						return jsonResponse({ error: "Failed to create formula" }, 500);
					}

					await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						...ingredients.map((ing) =>
							txn.query(
								`INSERT INTO formula_dilutions (formula_id, dilution_id, weight_grams, percentage)
							 VALUES ($1, $2, $3, $4)`,
								[
									formula.id,
									ing.dilution_id,
									ing.weight_grams,
									ing.formula_percentage,
								],
							),
						),
					]);

					return jsonResponse({ success: true, data: formula }, 201);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create formula",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
