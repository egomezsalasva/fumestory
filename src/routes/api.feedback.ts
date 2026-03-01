import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";

export type Feedback = {
	id: number;
	dilution_id: number;
	person_name: string;
	created_at: string;
};

export type FeedbackWithNotes = Feedback & {
	notes: string[];
};

export const Route = createFileRoute("/api/feedback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const url = new URL(request.url);
					const dilutionId = url.searchParams.get("dilutionId");
					if (!dilutionId || isNaN(Number(dilutionId))) {
						return jsonResponse(
							{ error: "Valid dilution ID is required" },
							400,
						);
					}
					const result = (await client.query(
						`
                    SELECT
                        f.id,
                        f.dilution_id,
                        f.person_name,
                        f.created_at,
                        COALESCE(
                            json_agg(n.name ORDER BY n.name) FILTER (WHERE n.name IS NOT NULL), '[]'
                        ) as notes
                    FROM feedback f
                    LEFT JOIN feedback_notes fn ON f.id = fn.feedback_id
                    LEFT JOIN notes n ON fn.note_id = n.id
                    WHERE f.dilution_id = $1
                    GROUP BY f.id, f.dilution_id, f.person_name, f.created_at
                    ORDER BY f.created_at DESC
                `,
						[Number(dilutionId)],
					)) as FeedbackWithNotes[];
					return jsonResponse(
						{ success: true, data: result as FeedbackWithNotes[] },
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to fetch feedback",
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
					const { dilution_id, person_name, notes } = body as {
						dilution_id: Feedback["dilution_id"];
						person_name: Feedback["person_name"];
						notes: FeedbackWithNotes["notes"];
					};
					if (!dilution_id || typeof dilution_id !== "number") {
						return jsonResponse({ error: "Dilution ID is required" }, 400);
					}
					if (
						!person_name ||
						typeof person_name !== "string" ||
						person_name.trim() === ""
					) {
						return jsonResponse({ error: "Person name is required" }, 400);
					}
					if (!notes || !Array.isArray(notes) || notes.length === 0) {
						return jsonResponse(
							{ error: "At least one note is required" },
							400,
						);
					}
					for (const note of notes) {
						if (!note || typeof note !== "string" || note.trim() === "") {
							return jsonResponse({ error: "Note is required" }, 400);
						}
					}
					const [feedback] = (await client.query(
						`
                        INSERT INTO feedback (dilution_id, person_name)
                        VALUES ($1, $2)
                        RETURNING id, dilution_id, person_name, created_at
                    `,
						[dilution_id, person_name],
					)) as Feedback[];

					const noteNames: FeedbackWithNotes["notes"] = [];
					for (const noteName of notes) {
						if (noteName && typeof noteName === "string" && noteName.trim()) {
							const trimmedNote = noteName.trim();
							await client.query(
								`
                                INSERT INTO notes (name) VALUES ($1) ON CONFLICT (name) DO NOTHING
                            `,
								[trimmedNote],
							);
							await client.query(
								`
                                INSERT INTO feedback_notes (feedback_id, note_id)
                                SELECT $1, id FROM notes WHERE name = $2    
                            `,
								[feedback.id, trimmedNote],
							);
							noteNames.push(trimmedNote);
						}
					}

					const result: FeedbackWithNotes = {
						...feedback,
						notes: noteNames,
					} as FeedbackWithNotes;

					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create feedback",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
