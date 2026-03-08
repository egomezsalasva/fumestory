import { getClient } from "@/db";
import { jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";

export type Formula = {
	id: number;
	name: string;
	type: "trial" | "accord" | "perfume";
	created_at: string;
};

export const Route = createFileRoute("/api/formulas")({
	server: {
		handlers: {
			GET: async () => {
				const client = await getClient();
				if (!client) return noClientResponse;

				const formulas = await client.query(`
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
					GROUP BY f.id
					ORDER BY f.created_at DESC
				`);

				return jsonResponse({ success: true, data: formulas }, 200);
			},
			POST: async ({ request }) => {
				const client = await getClient();
				if (!client) return noClientResponse;

				const body = await request.json();
				const { name, type, ingredients } = body;

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

				const [formula] = (await client.query(
					`INSERT INTO formulas (name, type)
                     VALUES ($1, $2)
                     RETURNING *`,
					[name, type],
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

				return jsonResponse({ success: true, data: formula }, 201);
			},
		},
	},
});
