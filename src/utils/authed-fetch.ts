import { authClient } from "../../auth";
import {
	createOfflineCategory,
	createOfflineDilution,
	createOfflineRawMaterial,
	listOfflineCategories,
	listOfflineDilutions,
	listOfflineNotes,
	listOfflineRawMaterials,
	patchOfflineDilution,
	type CreateOfflineDilutionInput,
	type CreateOfflineRawMaterialInput,
	type PatchOfflineDilutionInput,
} from "@/offline/db";
import { isOffline } from "@/runtime";
import { effectiveUserSettings } from "@/utils/user-settings";

function requestPath(input: RequestInfo | URL): string {
	if (typeof input === "string") {
		return new URL(input, "http://local").pathname;
	}
	if (input instanceof URL) {
		return input.pathname;
	}
	return new URL(input.url).pathname;
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

async function offlineFetch(
	input: RequestInfo | URL,
	init: RequestInit,
): Promise<Response> {
	const method = (init.method ?? "GET").toUpperCase();
	const path = requestPath(input);

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
			if (path === "/api/user-settings") {
				return jsonOk(effectiveUserSettings({}));
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
		}

		if (method === "PATCH") {
			if (path === "/api/user-settings") {
				// Offline settings persistence comes later; accept writes so forms don't fail.
				return jsonOk(effectiveUserSettings({}));
			}
			if (path === "/api/dilutions") {
				const body = parseJsonBody(init) as PatchOfflineDilutionInput;
				return jsonOk(await patchOfflineDilution(body));
			}
		}
	} catch (err) {
		const message =
			err instanceof Error ? err.message : "Offline request failed";
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
