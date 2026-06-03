import { getClient } from "@/db";
import {
	getErrorDetails,
	getUniqueViolationMessage,
	jsonResponse,
	noClientResponse,
} from "@/utils/api";
import {
	parseBottleLabelInput,
	validateBottleLabelFormat,
} from "@/utils/bottle-labels";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

export type Composition = {
	id: number;
	name: string;
	label: string | null;
	type: "trial" | "accord" | "perfume";
	created_at: string;
};

export type Formula = {
	id: number;
	composition_id: number;
	mods: string;
	created_at: string;
};

export const Route = createFileRoute("/api/compositions")({
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
						c.id,
						c.name,
						c.label,
						c.type,
						c.created_at
					FROM compositions c
					WHERE c.owner_id = $1
					ORDER BY c.created_at DESC
					`;

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(selectSql, [currentUserId]),
					]);

					const compositions = txResults[1];

					return jsonResponse({ success: true, data: compositions }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load compositions",
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
						name,
						type,
						label,
						mods = "1",
						ingredients,
					} = body as {
						name: Composition["name"];
						label: Composition["label"];
						type: Composition["type"];
						mods: Formula["mods"];
						ingredients: {
							dilution_id: number;
							weight_grams: number;
							formula_percentage: number;
						}[];
					};

					const normalizedLabel = parseBottleLabelInput(label);
					if (normalizedLabel !== null) {
						const formatError = validateBottleLabelFormat(normalizedLabel);
						if (formatError) {
							return jsonResponse({ error: formatError }, 400);
						}

						const [_session, conflictRows] = await client.transaction((txn) => [
							txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
								currentUserId,
							]),
							txn.query(
								`SELECT 1 AS found FROM raw_materials
								 WHERE owner_id = $1 AND label = $2
								 LIMIT 1`,
								[currentUserId, normalizedLabel],
							),
						]);
						if ((conflictRows as { found: number }[]).length > 0) {
							return jsonResponse(
								{ error: "Label already used on a raw material" },
								400,
							);
						}
					}

					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse({ error: "Name is required" }, 400);
					}

					if (!["trial", "accord", "perfume"].includes(type)) {
						return jsonResponse({ error: "Invalid composition type" }, 400);
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

					const createTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
						INSERT INTO compositions (owner_id, name, type, label)
						VALUES ($1, $2, $3, $4)
						RETURNING id, name, type, label, created_at
						`,
							[currentUserId, name.trim(), type, normalizedLabel],
						),
					]);

					const composition = (createTx[1] as Composition[])[0];
					if (!composition) {
						return jsonResponse({ error: "Failed to create composition" }, 500);
					}

					const formulaTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
						INSERT INTO formulas (composition_id, mods)
						VALUES ($1, $2)
						RETURNING id, composition_id, mods, created_at
						`,
							[composition.id, mods],
						),
					]);

					const formula = (formulaTx[1] as Formula[])[0];
					if (!formula) {
						return jsonResponse(
							{ error: "Failed to create initial formula" },
							500,
						);
					}

					await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						...ingredients.map((ing) =>
							txn.query(
								`
							INSERT INTO formula_dilutions (formula_id, dilution_id, weight_grams, percentage)
							VALUES ($1, $2, $3, $4)
							`,
								[
									formula.id,
									ing.dilution_id,
									ing.weight_grams,
									ing.formula_percentage,
								],
							),
						),
					]);

					return jsonResponse(
						{ success: true, data: { composition, formula } },
						201,
					);
				} catch (error) {
					const uniqueMessage = getUniqueViolationMessage(error);
					if (uniqueMessage) {
						return jsonResponse({ error: uniqueMessage }, 400);
					}
					return jsonResponse(
						{
							error: "Failed to create composition",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
