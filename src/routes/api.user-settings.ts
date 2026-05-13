import { getClient } from "@/db";
import { z } from "zod";
import {
	effectiveUserSettings,
	mergeUserSettingsJson,
	parseUserSettingsJson,
	patchUserSettingsSchema,
	type UserSettingsRow,
} from "@/utils/user-settings";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/user-settings")({
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
						txn.query(`SELECT settings FROM user_settings WHERE user_id = $1`, [
							currentUserId,
						]),
					]);

					const rows = tx[1] as UserSettingsRow[];
					const stored = parseUserSettingsJson(rows[0]?.settings);
					const data = effectiveUserSettings(stored);

					return jsonResponse({ success: true, data }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load user settings",
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

					const parsed = patchUserSettingsSchema.safeParse(
						await request.json(),
					);
					if (!parsed.success) {
						return jsonResponse(
							{
								error: "Invalid user settings patch",
								details: z.flattenError(parsed.error),
							},
							400,
						);
					}

					const readTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(`SELECT settings FROM user_settings WHERE user_id = $1`, [
							currentUserId,
						]),
					]);
					const existingRows = readTx[1] as UserSettingsRow[];
					const existing = parseUserSettingsJson(existingRows[0]?.settings);
					const merged = mergeUserSettingsJson(existing, parsed.data);

					const writeTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							INSERT INTO user_settings (user_id, settings, updated_at)
							VALUES ($1, $2::jsonb, now())
							ON CONFLICT (user_id) DO UPDATE SET
								settings = EXCLUDED.settings,
								updated_at = now()
							RETURNING settings
							`,
							[currentUserId, JSON.stringify(merged)],
						),
					]);

					const updated = (writeTx[1] as UserSettingsRow[])[0];
					if (!updated) {
						return jsonResponse({ error: "Failed to save settings" }, 500);
					}

					const data = effectiveUserSettings(
						parseUserSettingsJson(updated.settings),
					);
					return jsonResponse({ success: true, data }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to save user settings",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
