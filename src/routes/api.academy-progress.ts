import { getClient } from "@/db";
import {
	parseAcademyProgress,
	type AcademyProgressV1,
} from "@/components/academy/progress/academyProgressLocal";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { createFileRoute } from "@tanstack/react-router";

type AcademyProgressRow = {
	progress: unknown;
	updated_at: string;
};

function readProgress(
	row: AcademyProgressRow | undefined,
): AcademyProgressV1 | null {
	if (!row) return null;
	return parseAcademyProgress(row.progress);
}

export const Route = createFileRoute("/api/academy-progress")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const tx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`SELECT progress, updated_at FROM academy_progress WHERE user_id = $1`,
							[currentUserId],
						),
					]);

					const rows = tx[1] as AcademyProgressRow[];
					const data = readProgress(rows[0]);

					return jsonResponse({ success: true, data }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load academy progress",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},

			PUT: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const body = (await request.json()) as unknown;
					const parsed = parseAcademyProgress(body);
					if (!parsed) {
						return jsonResponse(
							{
								error: "Invalid academy progress",
								details: "Expected AcademyProgressV1 payload",
							},
							400,
						);
					}

					const toStore: AcademyProgressV1 = {
						...parsed,
						v: 1,
						updatedAt: new Date().toISOString(),
					};

					const tx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							INSERT INTO academy_progress (user_id, progress, updated_at)
							VALUES ($1, $2::jsonb, now())
							ON CONFLICT (user_id) DO UPDATE SET
								progress = EXCLUDED.progress,
								updated_at = now()
							RETURNING progress, updated_at
							`,
							[currentUserId, JSON.stringify(toStore)],
						),
					]);

					const updated = (tx[1] as AcademyProgressRow[])[0];
					const data = readProgress(updated);
					if (!data) {
						return jsonResponse(
							{ error: "Failed to save academy progress" },
							500,
						);
					}

					return jsonResponse({ success: true, data }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to save academy progress",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
