import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { createFileRoute } from "@tanstack/react-router";

export type RoadmapItem = {
	id: number;
	title: string;
	upvotes: number;
	has_upvoted: boolean;
};

export type RoadmapGetResponse = {
	success: true;
	data: RoadmapItem[];
};

export type RoadmapToggleResponse = {
	success: true;
	data: {
		featureId: number;
		has_upvoted: boolean;
	};
};

export const Route = createFileRoute("/api/roadmap")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					const currentUserId = auth.userId;

					const sql = `
                      SELECT 
                        rf.id::int AS id,
                        rf.title,
                        COUNT(rfv.user_id)::int AS upvotes,
                        CASE
                          WHEN $1::uuid IS NULL THEN false
                          ELSE COALESCE(
                            BOOL_OR(rfv.user_id = $1::uuid),
                            false
                          )
                        END AS has_upvoted
                      FROM public.roadmap_features rf
                      LEFT JOIN public.roadmap_feature_votes rfv
                        ON rfv.feature_id = rf.id
                      WHERE rf.is_active = true
                      GROUP BY rf.id, rf.title
                      ORDER BY upvotes DESC, rf.id ASC;
                    `;

					let rows: RoadmapItem[];

					if (currentUserId) {
						const tx = await client.transaction((txn) => [
							txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
								currentUserId,
							]),
							txn.query(sql, [currentUserId]),
						]);
						rows = tx[1] as RoadmapItem[];
					} else {
						rows = (await client.query(sql, [null])) as RoadmapItem[];
					}

					const payload: RoadmapGetResponse = { success: true, data: rows };
					return jsonResponse(payload, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to fetch roadmap",
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
					const { featureId } = body as { featureId?: number };

					if (!featureId || typeof featureId !== "number") {
						return jsonResponse({ error: "Valid featureId is required" }, 400);
					}

					const tx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
                            WITH feature AS (
                             SELECT id
                             FROM public.roadmap_features
                             WHERE id = $1
                               AND is_active = true
                             LIMIT 1
                            ),
                            deleted AS (
                             DELETE FROM public.roadmap_feature_votes rfv
                             USING feature f
                             WHERE rfv.feature_id = f.id
                              AND rfv.user_id = $2::uuid
                             RETURNING rfv.feature_id
                            ),
                            inserted AS (
                              INSERT INTO public.roadmap_feature_votes (feature_id, user_id)
                              SELECT f.id, $2::uuid
                              FROM feature f
                              WHERE NOT EXISTS (SELECT 1 FROM deleted)
                              RETURNING feature_id
                            )
                            SELECT
                              CASE
                                WHEN NOT EXISTS (SELECT 1 FROM feature) THEN 'not_found'
                                WHEN EXISTS (SELECT 1 FROM inserted) THEN 'upvoted'
                                ELSE 'removed'
                            END AS action
                            `,
							[featureId, currentUserId],
						),
					]);

					const result = tx[1] as Array<{
						action: "not_found" | "upvoted" | "removed";
					}>;
					const action = result[0]?.action;

					if (action === "not_found") {
						return jsonResponse({ error: "Roadmap feature not found" }, 404);
					}

					const payload: RoadmapToggleResponse = {
						success: true,
						data: { featureId, has_upvoted: action === "upvoted" },
					};

					return jsonResponse(payload, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to toggle roadmap upvote",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
