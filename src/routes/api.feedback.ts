import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import {
	effectiveUserSettings,
	parseUserSettingsJson,
	type UserSettingsRow,
} from "@/utils/user-settings";
import { createFileRoute } from "@tanstack/react-router";
import { requireCurrentUserId } from "@/utils/current-user";

export type Feedback = {
	id: number;
	dilution_id: number;
	person_name: string;
	rating: number | null;
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
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
					const url = new URL(request.url);
					const dilutionId = url.searchParams.get("dilutionId");
					if (!dilutionId || isNaN(Number(dilutionId))) {
						return jsonResponse(
							{ error: "Valid dilution ID is required" },
							400,
						);
					}
					const selectSql = `
                    SELECT
                        f.id,
                        f.dilution_id,
                        f.person_name,
						f.rating,
                        f.created_at,
                        COALESCE(
                            json_agg(n.name ORDER BY n.name) FILTER (WHERE n.name IS NOT NULL), '[]'
                        ) as notes
                    FROM feedback f
					JOIN dilutions d ON d.id = f.dilution_id
					JOIN raw_materials rm ON rm.id = d.raw_material_id
                    LEFT JOIN feedback_notes fn ON f.id = fn.feedback_id
                    LEFT JOIN notes n ON fn.note_id = n.id
                    WHERE f.dilution_id = $1
  						AND rm.owner_id = $2
                    GROUP BY f.id, f.dilution_id, f.person_name, f.rating, f.created_at
                    ORDER BY f.created_at DESC
                `;
					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(selectSql, [Number(dilutionId), currentUserId]),
					]);
					const result = txResults[1] as FeedbackWithNotes[];
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
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;
					const body = await request.json();
					const { dilution_id, person_name, notes, rating } = body as {
						dilution_id: Feedback["dilution_id"];
						person_name: Feedback["person_name"];
						notes: FeedbackWithNotes["notes"];
						rating?: Feedback["rating"];
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
					const validNotes: string[] = [];
					for (const note of notes) {
						if (!note || typeof note !== "string" || note.trim() === "") {
							return jsonResponse({ error: "Note is required" }, 400);
						}
						validNotes.push(note.trim().toLowerCase());
					}

					let ratingToStore: Feedback["rating"] = null;
					if (rating !== undefined && rating !== null) {
						if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
							return jsonResponse(
								{ error: "Rating must be an integer from 0 to 5" },
								400,
							);
						}
						ratingToStore = rating;
					}

					const ownTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`SELECT 1
						 FROM dilutions d
						 JOIN raw_materials rm ON rm.id = d.raw_material_id
						 WHERE d.id = $1 AND rm.owner_id = $2`,
							[dilution_id, currentUserId],
						),
					]);

					const ownsDilution = ownTx[1] as { "?column?"?: number }[];

					if (ownsDilution.length === 0) {
						return jsonResponse(
							{ error: "Not allowed for this dilution" },
							403,
						);
					}

					const settingsTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(`SELECT settings FROM user_settings WHERE user_id = $1`, [
							currentUserId,
						]),
					]);
					const settingsRows = settingsTx[1] as UserSettingsRow[];
					const storedSettings = parseUserSettingsJson(
						settingsRows[0]?.settings,
					);
					if (!effectiveUserSettings(storedSettings).guest_feedback_enabled) {
						return jsonResponse(
							{
								error:
									"Guest feedback is turned off in Project Settings → Add-on Features",
							},
							403,
						);
					}

					const insertFeedbackTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
                        INSERT INTO feedback (dilution_id, person_name, rating)
                        VALUES ($1, $2, $3)
                        RETURNING id, dilution_id, person_name, rating, created_at
                    `,
							[dilution_id, person_name.trim(), ratingToStore],
						),
					]);

					const feedback = (insertFeedbackTx[1] as Feedback[])[0];
					if (!feedback) {
						return jsonResponse({ error: "Failed to create feedback" }, 500);
					}

					await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						...validNotes.flatMap((trimmedNote) => [
							txn.query(
								`
                                INSERT INTO notes (name) VALUES ($1) ON CONFLICT (name) DO NOTHING
                            `,
								[trimmedNote],
							),
							txn.query(
								`
                                INSERT INTO feedback_notes (feedback_id, note_id)
                                SELECT $1, id FROM notes WHERE name = $2    
                            `,
								[feedback.id, trimmedNote],
							),
						]),
					]);

					const result: FeedbackWithNotes = {
						...feedback,
						notes: validNotes,
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
