import { authClient } from "../../auth";
import {
	createOfflineCategory,
	createOfflineComposition,
	createOfflineDilution,
	createOfflineFormula,
	createOfflineRawMaterial,
	getOfflineComposition,
	getOfflineUserSettings,
	listOfflineCategories,
	listOfflineCompositions,
	listOfflineDilutions,
	listOfflineNotes,
	listOfflineRawMaterials,
	patchOfflineComposition,
	patchOfflineDilution,
	setOfflineUserSettings,
	type CreateOfflineCompositionInput,
	type CreateOfflineDilutionInput,
	type CreateOfflineRawMaterialInput,
	type OfflineAppSettingsRow,
	type OfflineFormulaIngredient,
	type PatchOfflineDilutionInput,
} from "@/offline/db";
import { isOffline } from "@/runtime";
import type { CompositionStatus } from "@/routes/api.compositions";
import {
	effectiveDismissedUi,
	mergeDismissedUiJson,
	parseDismissedUiJson,
	patchDismissedUiSchema,
} from "@/utils/toast-settings";
import {
	effectiveUserSettings,
	mergeUserSettingsJson,
	parseUserSettingsJson,
	patchUserSettingsSchema,
} from "@/utils/user-settings";

function requestUrl(input: RequestInfo | URL): URL {
	if (typeof input === "string") {
		return new URL(input, "http://local");
	}
	if (input instanceof URL) {
		return input;
	}
	return new URL(input.url);
}

function jsonOk(data: unknown, status = 200): Response {
	return new Response(JSON.stringify({ success: true, data }), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function jsonError(error: string, status = 400): Response {
	return new Response(JSON.stringify({ error }), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function parseJsonBody(init: RequestInit): unknown {
	if (init.body == null || init.body === "") return null;
	if (typeof init.body === "string") {
		return JSON.parse(init.body);
	}
	throw new Error("Unsupported request body");
}

function parseCompositionId(path: string): number | null {
	const match = path.match(/^\/api\/compositions\/(\d+)$/);
	if (!match) return null;
	const id = Number(match[1]);
	return Number.isFinite(id) && id > 0 ? id : null;
}

function buildOfflineUserSettingsResponse(row: OfflineAppSettingsRow) {
	const stored = parseUserSettingsJson(row.settings);
	const dismissed = parseDismissedUiJson(row.dismissed_ui);
	return {
		...effectiveUserSettings(stored),
		dismissed_ui: effectiveDismissedUi(dismissed),
	};
}

async function offlineGetUserSettings(): Promise<Response> {
	const row = await getOfflineUserSettings();
	return jsonOk(buildOfflineUserSettingsResponse(row));
}

async function offlinePatchUserSettings(init: RequestInit): Promise<Response> {
	const body = (parseJsonBody(init) ?? {}) as Record<string, unknown>;
	const { dismissed_ui: dismissedUiBody, ...settingsBody } = body;

	const hasDismissedUiPatch = dismissedUiBody !== undefined;
	const hasSettingsPatch = Object.keys(settingsBody).length > 0;

	if (!hasDismissedUiPatch && !hasSettingsPatch) {
		return jsonError(
			"Provide feature settings and/or dismissed_ui.header_hints",
		);
	}

	let mergedDismissedPatch: ReturnType<
		typeof patchDismissedUiSchema.parse
	> | null = null;
	if (hasDismissedUiPatch) {
		const dismissedParsed = patchDismissedUiSchema.safeParse(dismissedUiBody);
		if (!dismissedParsed.success) {
			return jsonError("Invalid dismissed_ui patch");
		}
		mergedDismissedPatch = dismissedParsed.data;
	}

	let mergedSettingsPatch: ReturnType<
		typeof patchUserSettingsSchema.parse
	> | null = null;
	if (hasSettingsPatch) {
		const settingsParsed = patchUserSettingsSchema.safeParse(settingsBody);
		if (!settingsParsed.success) {
			return jsonError("Invalid user settings patch");
		}
		mergedSettingsPatch = settingsParsed.data;
	}

	const existing = await getOfflineUserSettings();
	const existingSettings = parseUserSettingsJson(existing.settings);
	const existingDismissed = parseDismissedUiJson(existing.dismissed_ui);

	const mergedSettings = mergedSettingsPatch
		? mergeUserSettingsJson(existingSettings, mergedSettingsPatch)
		: existingSettings;
	const mergedDismissed = mergedDismissedPatch
		? mergeDismissedUiJson(existingDismissed, mergedDismissedPatch)
		: existingDismissed;

	const saved = await setOfflineUserSettings({
		settings: mergedSettings,
		dismissed_ui: mergedDismissed,
	});

	return jsonOk(buildOfflineUserSettingsResponse(saved));
}

async function offlineFetch(
	input: RequestInfo | URL,
	init: RequestInit,
): Promise<Response> {
	const method = (init.method ?? "GET").toUpperCase();
	const url = requestUrl(input);
	const path = url.pathname;

	try {
		if (method === "GET") {
			if (path === "/api/categories") {
				return jsonOk(await listOfflineCategories());
			}
			if (path === "/api/notes") {
				return jsonOk(await listOfflineNotes());
			}
			if (path === "/api/raw-materials") {
				return jsonOk(await listOfflineRawMaterials());
			}
			if (path === "/api/dilutions") {
				return jsonOk(await listOfflineDilutions());
			}
			if (path === "/api/compositions") {
				const statusParam = url.searchParams.get("status") ?? "active";
				if (statusParam !== "active" && statusParam !== "archived") {
					return jsonError("Invalid status. Use active or archived.");
				}
				return jsonOk(
					await listOfflineCompositions(statusParam as CompositionStatus),
				);
			}
			const compositionId = parseCompositionId(path);
			if (compositionId !== null) {
				return jsonOk(await getOfflineComposition(compositionId));
			}
			if (path === "/api/user-settings") {
				return offlineGetUserSettings();
			}
		}

		if (method === "POST") {
			if (path === "/api/categories") {
				const body = parseJsonBody(init) as { name?: string };
				if (!body?.name || typeof body.name !== "string") {
					return jsonError("Category name is required");
				}
				return jsonOk(await createOfflineCategory(body.name), 201);
			}
			if (path === "/api/raw-materials") {
				const body = parseJsonBody(init) as CreateOfflineRawMaterialInput;
				return jsonOk(await createOfflineRawMaterial(body), 201);
			}
			if (path === "/api/dilutions") {
				const body = parseJsonBody(init) as CreateOfflineDilutionInput;
				return jsonOk(await createOfflineDilution(body), 201);
			}
			if (path === "/api/compositions") {
				const body = parseJsonBody(init) as CreateOfflineCompositionInput;
				return jsonOk(await createOfflineComposition(body), 201);
			}
			const compositionId = parseCompositionId(path);
			if (compositionId !== null) {
				const body = parseJsonBody(init) as {
					ingredients?: OfflineFormulaIngredient[];
				};
				return jsonOk(
					await createOfflineFormula({
						composition_id: compositionId,
						ingredients: body?.ingredients ?? [],
					}),
					201,
				);
			}
		}

		if (method === "PATCH") {
			if (path === "/api/user-settings") {
				return offlinePatchUserSettings(init);
			}
			if (path === "/api/dilutions") {
				const body = parseJsonBody(init) as PatchOfflineDilutionInput;
				return jsonOk(await patchOfflineDilution(body));
			}
			const compositionId = parseCompositionId(path);
			if (compositionId !== null) {
				const body = parseJsonBody(init) as {
					status?: CompositionStatus;
					formula_id?: number;
					comment?: string | null;
				};
				return jsonOk(
					await patchOfflineComposition({
						composition_id: compositionId,
						status: body?.status,
						formula_id: body?.formula_id,
						comment: body?.comment,
					}),
				);
			}
		}
	} catch (err) {
		const message =
			err instanceof Error
				? err.message
				: typeof err === "string"
					? err
					: "Offline request failed";
		return jsonError(message);
	}

	return jsonError(`Offline: unsupported ${method} ${path}`, 501);
}

export async function authedFetch(
	input: RequestInfo | URL,
	init: RequestInit = {},
) {
	if (isOffline()) {
		return offlineFetch(input, init);
	}

	const sessionResult = await authClient.getSession();

	const userId =
		(sessionResult as any)?.data?.user?.id ??
		(sessionResult as any)?.data?.session?.userId ??
		(sessionResult as any)?.data?.session?.user?.id;

	if (!userId || typeof userId !== "string") {
		throw new Error("Unauthorized: missing authenticated user id");
	}

	const headers = new Headers(init.headers);
	headers.set("x-user-id", userId);

	return fetch(input, { ...init, headers });
}
