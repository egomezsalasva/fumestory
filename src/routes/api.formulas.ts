import { getClient } from "@/db";
import { jsonResponse, noClientResponse } from "@/utils/api";
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
				const client = await getClient();
				if (!client) return noClientResponse;

				const auth = requireCurrentUserId(request);
				if (auth.errorResponse) return auth.errorResponse;
				const currentUserId = auth.userId!;

				const formulas = await client.query(
					`
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
				`,
					[currentUserId],
				);

				return jsonResponse({ success: true, data: formulas }, 200);
			},
			POST: async ({ request }) => {
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

				const ownedDilutions = (await client.query(
					`
					SELECT d.id
					FROM dilutions d
					JOIN raw_materials rm ON rm.id = d.raw_material_id
					WHERE d.id = ANY($1::int[])
					  AND rm.owner_id = $2
					`,
					[dilutionIds, currentUserId],
				)) as { id: number }[];

				const ownedSet = new Set(ownedDilutions.map((d) => d.id));
				const unauthorized = dilutionIds.filter((id) => !ownedSet.has(id));

				if (unauthorized.length > 0) {
					return jsonResponse(
						{ error: "One or more ingredients are not allowed for this user" },
						403,
					);
				}

				try {
					await client.query("BEGIN");

					const [formula] = (await client.query(
						`INSERT INTO formulas (name, type, owner_id)
						 VALUES ($1, $2, $3)
						 RETURNING *`,
						[name.trim(), type, currentUserId],
					)) as Formula[];

					for (const ing of ingredients) {
						await client.query(
							`INSERT INTO formula_dilutions (formula_id, dilution_id, weight_grams, percentage)
							 VALUES ($1, $2, $3, $4)`,
							[
								formula.id,
								ing.dilution_id,
								ing.weight_grams,
								ing.formula_percentage,
							],
						);
					}

					await client.query("COMMIT");
					return jsonResponse({ success: true, data: formula }, 201);
				} catch (error) {
					await client.query("ROLLBACK");
					return jsonResponse(
						{
							error: "Failed to create formula",
							details: error instanceof Error ? error.message : String(error),
						},
						500,
					);
				}
			},
		},
	},
});
