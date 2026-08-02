import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import type { Composition } from "@/routes/api.compositions";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

const COMMENT_MAX_LENGTH = 2000;

type FormulaLineRow = {
	formula_id: number;
	dilution_id: number;
	percentage: string | number;
	weight_grams: string | number;
	material_label: string | null;
	material_name: string;
	note_type: string | null;
	category_name: string | null;
};

type FormulaHeaderRow = {
	id: number;
	composition_id: number;
	mods: string;
	created_at: string;
	comment: string | null;
};

export const Route = createFileRoute("/api/compositions/$compositionId")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const match = new URL(request.url).pathname.match(
						/\/api\/compositions\/(\d+)$/,
					);
					const compositionId = match ? Number(match[1]) : NaN;
					if (!Number.isFinite(compositionId) || compositionId <= 0) {
						return jsonResponse({ error: "Invalid composition id" }, 400);
					}

					const compositionSql = `
						SELECT c.id, c.name, c.label, c.type, c.created_at
						FROM compositions c
						WHERE c.id = $1
					`;

					const formulasSql = `
						SELECT f.id, f.composition_id, f.mods, f.created_at, f.comment
						FROM formulas f
						WHERE f.composition_id = $1
						ORDER BY f.id
					`;

					const linesSql = `
						SELECT
                            fd.formula_id,
                            fd.dilution_id,
                            fd.percentage,
                            fd.weight_grams,
                            rm.label AS material_label,
                            (rm.name || ' (' || d.percentage || '%)') AS material_name,
                            rm.note_type,
                            cat.name AS category_name
                        FROM formula_dilutions fd
                        JOIN formulas f ON f.id = fd.formula_id
                        JOIN dilutions d ON d.id = fd.dilution_id
                        JOIN raw_materials rm ON rm.id = d.raw_material_id
                        LEFT JOIN categories cat ON cat.id = rm.category_id
                        WHERE f.composition_id = $1
                        ORDER BY f.id, fd.id
					`;

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(compositionSql, [compositionId]),
						txn.query(formulasSql, [compositionId]),
						txn.query(linesSql, [compositionId]),
					]);

					const compositionRows = txResults[1] as Composition[];
					const formulas = txResults[2] as FormulaHeaderRow[];
					const lineRows = txResults[3] as FormulaLineRow[];

					const composition = compositionRows[0];
					if (!composition) {
						return jsonResponse({ error: "Composition not found" }, 404);
					}

					const linesByFormulaId = new Map<
						number,
						{
							dilution_id: number;
							material_label: string | null;
							material_name: string;
							note_type: string | null;
							category_name: string | null;
							percentage: number;
							weight_grams: number;
						}[]
					>();

					for (const row of lineRows) {
						const list = linesByFormulaId.get(row.formula_id) ?? [];
						list.push({
							dilution_id: row.dilution_id,
							material_label: row.material_label,
							material_name: row.material_name,
							note_type: row.note_type ?? null,
							category_name: row.category_name ?? null,
							percentage: Number(row.percentage),
							weight_grams: Number(row.weight_grams),
						});
						linesByFormulaId.set(row.formula_id, list);
					}

					const formulasWithLines = formulas.map((f) => ({
						...f,
						lines: linesByFormulaId.get(f.id) ?? [],
					}));

					return jsonResponse(
						{
							success: true,
							data: { composition, formulas: formulasWithLines },
						},
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load composition",
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

					const match = new URL(request.url).pathname.match(
						/\/api\/compositions\/(\d+)$/,
					);
					const compositionId = match ? Number(match[1]) : NaN;
					if (!Number.isFinite(compositionId) || compositionId <= 0) {
						return jsonResponse({ error: "Invalid composition id" }, 400);
					}

					const body = await request.json();
					const { ingredients } = body as {
						ingredients: {
							dilution_id: number;
							weight_grams: number;
							formula_percentage: number;
						}[];
					};

					if (!Array.isArray(ingredients) || ingredients.length === 0) {
						return jsonResponse(
							{ error: "At least one ingredient is required" },
							400,
						);
					}

					const totalPercent = ingredients.reduce(
						(sum, ing) => sum + (Number(ing.formula_percentage) || 0),
						0,
					);
					if (Math.abs(totalPercent - 100) > 0.0001) {
						return jsonResponse(
							{
								error: `Formula percentages must total 100%. Current total: ${totalPercent.toFixed(2)}%`,
							},
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
							`SELECT c.id
							 FROM compositions c
							 WHERE c.id = $1 AND c.owner_id = $2`,
							[compositionId, currentUserId],
						),
						txn.query(
							`SELECT d.id
							 FROM dilutions d
							 JOIN raw_materials rm ON rm.id = d.raw_material_id
							 WHERE d.id = ANY($1::int[]) AND rm.owner_id = $2`,
							[dilutionIds, currentUserId],
						),
					]);

					const compositionRows = ownTx[1] as { id: number }[];
					if (!compositionRows[0]) {
						return jsonResponse({ error: "Composition not found" }, 404);
					}

					const ownedDilutions = ownTx[2] as { id: number }[];
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

					const nextModTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`SELECT COALESCE(MAX((f.mods)::int), 0) + 1 AS next_mod
							 FROM formulas f
							 WHERE f.composition_id = $1
							   AND f.mods ~ '^[0-9]+$'`,
							[compositionId],
						),
					]);

					const nextMod = String(
						(nextModTx[1] as { next_mod: number }[])[0]?.next_mod ?? 1,
					);

					const formulaTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`INSERT INTO formulas (composition_id, mods)
							 VALUES ($1, $2)
							 RETURNING id, composition_id, mods, created_at, comment`,
							[compositionId, nextMod],
						),
					]);

					const formula = (formulaTx[1] as FormulaHeaderRow[])[0];
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
			PATCH: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const match = new URL(request.url).pathname.match(
						/\/api\/compositions\/(\d+)$/,
					);
					const compositionId = match ? Number(match[1]) : NaN;
					if (!Number.isFinite(compositionId) || compositionId <= 0) {
						return jsonResponse({ error: "Invalid composition id" }, 400);
					}

					const body = await request.json();
					const { formula_id: formulaId, comment } = body as {
						formula_id?: unknown;
						comment?: unknown;
					};

					if (
						typeof formulaId !== "number" ||
						!Number.isFinite(formulaId) ||
						formulaId <= 0
					) {
						return jsonResponse({ error: "Valid formula_id is required" }, 400);
					}

					if (comment !== null && typeof comment !== "string") {
						return jsonResponse(
							{ error: "comment must be a string or null" },
							400,
						);
					}

					const normalizedComment =
						comment === null || comment.trim() === "" ? null : comment.trim();

					if (
						normalizedComment !== null &&
						normalizedComment.length > COMMENT_MAX_LENGTH
					) {
						return jsonResponse(
							{
								error: `comment must be at most ${COMMENT_MAX_LENGTH} characters`,
							},
							400,
						);
					}

					const updateSql = `
						UPDATE formulas f
						SET comment = $3
						FROM compositions c
						WHERE f.id = $1
						  AND f.composition_id = $2
						  AND c.id = f.composition_id
						  AND c.owner_id = $4
						RETURNING f.id, f.composition_id, f.mods, f.created_at, f.comment
					`;

					const patchTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(updateSql, [
							formulaId,
							compositionId,
							normalizedComment,
							currentUserId,
						]),
					]);

					const rows = patchTx[1] as FormulaHeaderRow[];
					const formula = rows[0];
					if (!formula) {
						return jsonResponse({ error: "Formula not found" }, 404);
					}

					return jsonResponse({ success: true, data: formula }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to update formula comment",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
