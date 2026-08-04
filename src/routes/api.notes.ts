import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";

export type Note = {
	id: number;
	name: string;
	kind: "curated" | "other";
	color: string | null;
};

export const Route = createFileRoute("/api/notes")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							SELECT id, name, kind, color
							FROM notes
							WHERE kind = 'curated'
							   OR (
							     kind = 'other'
							     AND owner_id = $1
							     AND color IS NOT NULL
							   )
							ORDER BY
								CASE WHEN kind = 'curated' THEN 0 ELSE 1 END,
								name
							`,
							[currentUserId],
						),
					]);
					const result = txResults[1] as Note[];

					return jsonResponse({ success: true, data: result }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to find notes",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
