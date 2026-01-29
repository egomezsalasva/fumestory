import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";

export type RawMaterial = {
	id: number;
	label: string;
	name: string;
	category_id: number;
	category_name: string;
	note_type: string;
	notes: string[];
	prepared_dilution_percentages: number[];
	created_at: string;
};

type RawMaterialFromDB = Omit<
	RawMaterial,
	"notes" | "category_name" | "prepared_dilution_percentages"
>;

export const Route = createFileRoute("/api/raw-materials")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const result = (await client.query(`
                    SELECT
                        rm.id,
						rm.label,
                        rm.name ,
                        rm.category_id,
                        c.name as category_name,
                        rm.note_type,
                        rm.created_at,
						COALESCE(
							json_agg(n.name ORDER BY n.name) FILTER (WHERE n.name IS NOT NULL), '[]'
						) as notes,
						COALESCE(
							json_agg(DISTINCT d.percentage ORDER BY d.percentage) FILTER (WHERE d.percentage IS NOT NULL), '[]'
						) as prepared_dilution_percentages
                    FROM raw_materials rm
                    LEFT JOIN categories c ON rm.category_id = c.id
					LEFT JOIN raw_material_notes rmn ON rm.id = rmn.raw_material_id
					LEFT JOIN notes n ON rmn.note_id = n.id
					LEFT JOIN dilutions d ON rm.id = d.raw_material_id
					GROUP BY rm.id, rm.label, rm.name, rm.category_id, c.name, rm.note_type, rm.created_at
                    ORDER BY rm.id DESC
                `)) as RawMaterial[];

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
					const body = await request.json();
					const { label, name, category_id, note_type, notes } = body;

					if (!label || typeof label !== "string" || label.trim() === "") {
						return jsonResponse(
							{
								error: "Label is required",
							},
							400,
						);
					}

					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse(
							{ error: "Raw material name is required " },
							400,
						);
					}

					const [rawMaterial] = (await client.query(
						`INSERT INTO raw_materials (label,name, category_id, note_type)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, name, category_id, note_type, created_at`,
						[label.trim(), name.trim(), category_id || null, note_type || null],
					)) as RawMaterialFromDB[];

					const noteNames: string[] = [];
					if (notes && Array.isArray(notes) && notes.length > 0) {
						for (const noteName of notes) {
							if (noteName && typeof noteName === "string" && noteName.trim()) {
								const trimmedNote = noteName.trim();
								await client.query(
									`INSERT INTO notes (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
									[trimmedNote],
								);
								await client.query(
									`INSERT INTO raw_material_notes (raw_material_id, note_id)
									SELECT $1, id FROM notes WHERE name = $2
									ON CONFLICT (raw_material_id, note_id) DO NOTHING
									`,
									[rawMaterial.id, trimmedNote],
								);
								noteNames.push(trimmedNote);
							}
						}
					}

					const result = {
						...rawMaterial,
						notes: noteNames,
						category_name: null,
						prepared_dilution_percentages: [],
					};

					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
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
