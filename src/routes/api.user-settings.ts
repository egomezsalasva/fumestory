import { getClient } from "@/db";
import { z } from "zod";
import {
	effectiveUserSettings,
	mergeUserSettingsJson,
	parseUserSettingsJson,
	patchUserSettingsSchema,
	type UserSettingsJson,
} from "@/utils/user-settings";
import {
	effectiveDismissedUi,
	mergeDismissedUiJson,
	parseDismissedUiJson,
	patchDismissedUiSchema,
	type DismissedUiJson,
} from "@/utils/toast-settings";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { createFileRoute } from "@tanstack/react-router";

type UserSettingsRow = {
	settings: UserSettingsJson;
	dismissed_ui: DismissedUiJson | null;
};

function buildUserSettingsResponse(row: UserSettingsRow | undefined) {
	const stored = parseUserSettingsJson(row?.settings);
	const dismissed = parseDismissedUiJson(row?.dismissed_ui);

	return {
		...effectiveUserSettings(stored),
		dismissed_ui: effectiveDismissedUi(dismissed),
	};
}

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
						txn.query(
							`SELECT settings, dismissed_ui FROM user_settings WHERE user_id = $1`,
							[currentUserId],
						),
					]);

					const rows = tx[1] as UserSettingsRow[];
					const data = buildUserSettingsResponse(rows[0]);

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

					const body = (await request.json()) as Record<string, unknown>;
					const { dismissed_ui: dismissedUiBody, ...settingsBody } = body;

					const hasDismissedUiPatch = dismissedUiBody !== undefined;
					const hasSettingsPatch = Object.keys(settingsBody).length > 0;

					if (!hasDismissedUiPatch && !hasSettingsPatch) {
						return jsonResponse(
							{
								error: "Invalid user settings patch",
								details: {
									formErrors: [
										"Provide feature settings and/or dismissed_ui.header_hints",
									],
									fieldErrors: {},
								},
							},
							400,
						);
					}

					let mergedDismissedPatch: z.infer<
						typeof patchDismissedUiSchema
					> | null = null;
					if (hasDismissedUiPatch) {
						const dismissedParsed =
							patchDismissedUiSchema.safeParse(dismissedUiBody);
						if (!dismissedParsed.success) {
							return jsonResponse(
								{
									error: "Invalid dismissed_ui patch",
									details: z.flattenError(dismissedParsed.error),
								},
								400,
							);
						}
						mergedDismissedPatch = dismissedParsed.data;
					}

					let mergedSettingsPatch: z.infer<
						typeof patchUserSettingsSchema
					> | null = null;
					if (hasSettingsPatch) {
						const settingsParsed =
							patchUserSettingsSchema.safeParse(settingsBody);
						if (!settingsParsed.success) {
							return jsonResponse(
								{
									error: "Invalid user settings patch",
									details: z.flattenError(settingsParsed.error),
								},
								400,
							);
						}
						mergedSettingsPatch = settingsParsed.data;
					}

					const readTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`SELECT settings, dismissed_ui FROM user_settings WHERE user_id = $1`,
							[currentUserId],
						),
					]);

					const existingRows = readTx[1] as UserSettingsRow[];
					const existingRow = existingRows[0];

					const existingSettings = parseUserSettingsJson(existingRow?.settings);
					const existingDismissed = parseDismissedUiJson(
						existingRow?.dismissed_ui,
					);

					const mergedSettings = mergedSettingsPatch
						? mergeUserSettingsJson(existingSettings, mergedSettingsPatch)
						: existingSettings;

					const mergedDismissed = mergedDismissedPatch
						? mergeDismissedUiJson(existingDismissed, mergedDismissedPatch)
						: existingDismissed;

					const writeTx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							INSERT INTO user_settings (user_id, settings, dismissed_ui, updated_at)
							VALUES ($1, $2::jsonb, $3::jsonb, now())
							ON CONFLICT (user_id) DO UPDATE SET
								settings = EXCLUDED.settings,
								dismissed_ui = EXCLUDED.dismissed_ui,
								updated_at = now()
							RETURNING settings, dismissed_ui
							`,
							[
								currentUserId,
								JSON.stringify(mergedSettings),
								JSON.stringify(mergedDismissed),
							],
						),
					]);

					const updated = (writeTx[1] as UserSettingsRow[])[0];
					if (!updated) {
						return jsonResponse({ error: "Failed to save settings" }, 500);
					}

					const data = buildUserSettingsResponse(updated);
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
