import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import {
	getErrorDetails,
	getUniqueViolationMessage,
	jsonResponse,
	noClientResponse,
} from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { normalizeCasNumber, isValidCasNumber } from "@/utils/cas-numbers";
import {
	parseBottleLabelInput,
	validateBottleLabelFormat,
} from "@/utils/bottle-labels";
import { NEUTRAL_CATEGORY_COLOR } from "@/utils/curated-category-colors";

export type RawMaterial = {
	id: number;
	label: string | null;
	name: string;
	category_id: number;
	material_nature: string | null;
	cas_number: string | null;
	category_name: string;
	note_type: string;
	notes: string[];
	/** CSS color/gradient from `notes.color`, keyed by note name */
	note_colors: Record<string, string | null>;
	available_dilutions: number[];
	aggregated_note_counts: Record<string, number>;
	created_at: string;
};

type RawMaterialFromDB = Omit<
	RawMaterial,
	| "notes"
	| "note_colors"
	| "category_name"
	| "available_dilutions"
	| "aggregated_note_counts"
>;

type NoteInput = {
	name: string;
	color: string | null;
};

const MAX_NOTES_PER_RAW_MATERIAL = 25;

function parseNoteInputs(notes: unknown): NoteInput[] | { error: string } {
	if (!notes || !Array.isArray(notes) || notes.length === 0) {
		return [];
	}

	const out: NoteInput[] = [];
	for (const item of notes) {
		if (typeof item === "string" && item.trim()) {
			out.push({ name: item.trim().toLowerCase(), color: null });
			continue;
		}
		if (
			item &&
			typeof item === "object" &&
			"name" in item &&
			typeof (item as { name: unknown }).name === "string"
		) {
			const name = (item as { name: string }).name.trim().toLowerCase();
			if (!name) continue;
			const colorRaw = (item as { color?: unknown }).color;
			const color =
				typeof colorRaw === "string" && colorRaw.trim()
					? colorRaw.trim()
					: null;
			out.push({ name, color });
			continue;
		}
		return { error: "Invalid notes payload" };
	}

	return out;
}

export const Route = createFileRoute("/api/raw-materials")({
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
							rm.id,
							rm.label,
							rm.name,
							rm.material_nature,
							rm.category_id,
							rm.cas_number,
							COALESCE(parent.name, c.name) AS category_name,
							rm.note_type,
							rm.created_at,
							COALESCE(
								json_agg(DISTINCT n.name ORDER BY n.name) FILTER (WHERE n.name IS NOT NULL), '[]'
							) as notes,
							COALESCE(
								(
									SELECT json_object_agg(note_name, note_color)
									FROM (
										SELECT DISTINCT ON (n_all.name)
											n_all.name AS note_name,
											n_all.color AS note_color
										FROM (
											SELECT rmn2.note_id
											FROM raw_material_notes rmn2
											WHERE rmn2.raw_material_id = rm.id
											UNION
											SELECT fn.note_id
											FROM dilutions d2
											JOIN feedback f ON f.dilution_id = d2.id
											JOIN feedback_notes fn ON fn.feedback_id = f.id
											WHERE d2.raw_material_id = rm.id
										) ids
										JOIN notes n_all ON n_all.id = ids.note_id
										ORDER BY n_all.name
									) note_color_rows
								),
								'{}'::json
							) as note_colors,
							COALESCE(
								json_agg(DISTINCT d.percentage ORDER BY d.percentage) FILTER (WHERE d.percentage IS NOT NULL AND d.available = TRUE), '[]'
							) as available_dilutions,
							COALESCE(
								(
									SELECT json_object_agg(note_name, note_count)
									FROM (
										SELECT
											note_name,
											SUM(note_count) as note_count
										FROM (
											SELECT n2.name as note_name, 1 as note_count
											FROM raw_material_notes rmn2
											JOIN notes n2 ON rmn2.note_id = n2.id
											WHERE rmn2.raw_material_id = rm.id
											UNION ALL
											SELECT n3.name as note_name, COUNT(*) as note_count
											FROM dilutions d2
											JOIN feedback f ON f.dilution_id = d2.id
											JOIN feedback_notes fn ON fn.feedback_id = f.id
											JOIN notes n3 ON fn.note_id = n3.id
											WHERE d2.raw_material_id = rm.id
											GROUP BY n3.name
										) combined_notes
										GROUP BY note_name
									) aggregated
								),
								'{}'::json
							) as aggregated_note_counts
						FROM raw_materials rm
						LEFT JOIN categories c ON rm.category_id = c.id
						LEFT JOIN categories parent ON parent.id = c.parent_id
						LEFT JOIN raw_material_notes rmn ON rm.id = rmn.raw_material_id
						LEFT JOIN notes n ON rmn.note_id = n.id
						LEFT JOIN dilutions d ON rm.id = d.raw_material_id
						WHERE rm.owner_id = $1
						GROUP BY rm.id, rm.label, rm.name, rm.category_id, rm.cas_number, c.name, parent.name, rm.note_type, rm.created_at, rm.material_nature
						ORDER BY rm.id DESC
					`;
					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(selectSql, [currentUserId]),
					]);
					const result = txResults[1] as RawMaterial[];

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
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
					const body = await request.json();
					const {
						label,
						name,
						category_id,
						cas_number,
						note_type,
						notes,
						material_nature,
					} = body;

					const casNumber = normalizeCasNumber(cas_number);

					if (!isValidCasNumber(casNumber)) {
						return jsonResponse(
							{ error: "CAS number must look like 6790-58-5" },
							400,
						);
					}

					const normalizedLabel = parseBottleLabelInput(label);
					if (normalizedLabel !== null) {
						const formatError = validateBottleLabelFormat(normalizedLabel);
						if (formatError) {
							return jsonResponse({ error: formatError }, 400);
						}
						const conflictTx = await client.transaction((txn) => [
							txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
								currentUserId,
							]),
							txn.query(
								`SELECT 1 AS found FROM compositions
							   WHERE owner_id = $1 AND label = $2
							   LIMIT 1`,
								[currentUserId, normalizedLabel],
							),
						]);
						if ((conflictTx[1] as { found: number }[]).length > 0) {
							return jsonResponse(
								{ error: "Label already used on a composition" },
								400,
							);
						}
					}

					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse(
							{ error: "Raw material name is required " },
							400,
						);
					}

					let materialNature: string | null = null;
					if (
						material_nature !== null &&
						material_nature !== undefined &&
						material_nature !== ""
					) {
						if (
							typeof material_nature !== "string" ||
							!["Natural", "Synthetic"].includes(material_nature)
						) {
							return jsonResponse(
								{ error: "Material nature must be Natural or Synthetic" },
								400,
							);
						}
						materialNature = material_nature;
					}

					const parsedNotes = parseNoteInputs(notes);
					if ("error" in parsedNotes) {
						return jsonResponse({ error: parsedNotes.error }, 400);
					}
					if (parsedNotes.length > MAX_NOTES_PER_RAW_MATERIAL) {
						return jsonResponse(
							{
								error: `Too many notes (max ${MAX_NOTES_PER_RAW_MATERIAL})`,
							},
							400,
						);
					}

					const insertTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`INSERT INTO raw_materials (label, name, category_id, note_type, material_nature, cas_number, owner_id)
                    		VALUES ($1, $2, $3, $4, $5, $6, $7)
                    		RETURNING id, label, name, category_id, material_nature, cas_number, note_type, created_at`,
							[
								normalizedLabel,
								name.trim(),
								category_id || null,
								note_type || null,
								materialNature,
								casNumber,
								currentUserId,
							],
						),
					]);

					const rawMaterial = (insertTx[1] as RawMaterialFromDB[])[0];
					if (!rawMaterial) {
						return jsonResponse(
							{ error: "Failed to create raw material" },
							500,
						);
					}

					const noteNames: string[] = [];
					const noteColors: Record<string, string | null> = {};

					for (const note of parsedNotes) {
						const findTx = await client.transaction((txn) => [
							txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
								currentUserId,
							]),
							txn.query(
								`
								SELECT id, color
								FROM notes
								WHERE name = $1
								  AND (
								    kind = 'curated'
								    OR (kind = 'other' AND owner_id = $2)
								  )
								ORDER BY CASE WHEN kind = 'curated' THEN 0 ELSE 1 END
								LIMIT 1
								`,
								[note.name, currentUserId],
							),
						]);
						const existing = (
							findTx[1] as { id: number; color: string | null }[]
						)[0];

						let noteId: number;
						let noteColor: string | null;

						if (existing) {
							noteId = existing.id;
							noteColor = existing.color;
						} else {
							const color = note.color?.trim() || NEUTRAL_CATEGORY_COLOR;
							const createTx = await client.transaction((txn) => [
								txn.query(
									`SELECT set_config('app.current_user_id', $1, true)`,
									[currentUserId],
								),
								txn.query(
									`
									INSERT INTO notes (name, kind, owner_id, color)
									VALUES ($1, 'other', $2, $3)
									RETURNING id, color
									`,
									[note.name, currentUserId, color],
								),
							]);
							const created = (
								createTx[1] as { id: number; color: string | null }[]
							)[0];
							if (!created) {
								return jsonResponse(
									{ error: `Failed to create note "${note.name}"` },
									500,
								);
							}
							noteId = created.id;
							noteColor = created.color;
						}

						await client.transaction((txn) => [
							txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
								currentUserId,
							]),
							txn.query(
								`
								INSERT INTO raw_material_notes (raw_material_id, note_id)
								VALUES ($1, $2)
								ON CONFLICT (raw_material_id, note_id) DO NOTHING
								`,
								[rawMaterial.id, noteId],
							),
						]);

						noteNames.push(note.name);
						noteColors[note.name] = noteColor;
					}

					const result = {
						...rawMaterial,
						notes: noteNames,
						note_colors: noteColors,
						category_name: null,
						available_dilutions: [],
						aggregated_note_counts: {},
					};

					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					const uniqueMessage = getUniqueViolationMessage(error);
					if (uniqueMessage) {
						return jsonResponse({ error: uniqueMessage }, 400);
					}
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
