import { z } from "zod";

export type UserSettingsJson = {
	guest_feedback_enabled?: boolean;
};

export type UserSettingsEffective = {
	guest_feedback_enabled: boolean;
};

export type UserSettingsRow = {
	settings: UserSettingsJson;
};

export const patchUserSettingsSchema = z.object({
	guest_feedback_enabled: z.boolean(),
});

export type PatchUserSettingsBody = z.infer<typeof patchUserSettingsSchema>;

export function parseUserSettingsJson(
	raw: UserSettingsJson | null | undefined,
): UserSettingsJson {
	if (raw === null || raw === undefined) {
		return {};
	}
	if (typeof raw !== "object" || Array.isArray(raw)) {
		return {};
	}
	const o = raw as Record<string, unknown>;
	const out: UserSettingsJson = {};
	if (typeof o.guest_feedback_enabled === "boolean") {
		out.guest_feedback_enabled = o.guest_feedback_enabled;
	}
	return out;
}

export function effectiveUserSettings(
	stored: UserSettingsJson,
): UserSettingsEffective {
	return {
		guest_feedback_enabled: stored.guest_feedback_enabled === true,
	};
}

export function mergeUserSettingsJson(
	stored: UserSettingsJson,
	patch: PatchUserSettingsBody | Partial<UserSettingsJson>,
): UserSettingsJson {
	const merged: UserSettingsJson = { ...stored };
	if (typeof patch.guest_feedback_enabled === "boolean") {
		merged.guest_feedback_enabled = patch.guest_feedback_enabled;
	}
	return merged;
}

/** Fired after user settings are saved so shell UI (e.g. SideNav) can refetch. */
export const USER_SETTINGS_UPDATED_EVENT =
	"fumestory:user-settings-updated" as const;

export function notifyUserSettingsUpdated(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent(USER_SETTINGS_UPDATED_EVENT));
	}
}
