import { authedFetch } from "@/utils/authed-fetch";
import {
	clearAcademyProgressLocal,
	loadAcademyProgressLocal,
	parseAcademyProgress,
	type AcademyProgressV1,
} from "./academyProgressLocal";

type ApiSuccess<T> = {
	success: true;
	data: T;
};

async function readJson(res: Response): Promise<unknown> {
	return res.json() as Promise<unknown>;
}

export async function fetchAcademyProgressRemote(): Promise<AcademyProgressV1 | null> {
	const res = await authedFetch("/api/academy-progress");
	const json = (await readJson(res)) as {
		success?: boolean;
		data?: unknown;
		error?: string;
	};

	if (!res.ok || !json.success) {
		throw new Error(json.error ?? "Failed to load academy progress");
	}

	if (json.data == null) return null;
	return parseAcademyProgress(json.data);
}

export async function putAcademyProgressRemote(
	progress: AcademyProgressV1,
): Promise<AcademyProgressV1> {
	const res = await authedFetch("/api/academy-progress", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(progress),
	});
	const json = (await readJson(res)) as {
		success?: boolean;
		data?: unknown;
		error?: string;
	};

	if (!res.ok || !json.success) {
		throw new Error(json.error ?? "Failed to save academy progress");
	}

	const parsed = parseAcademyProgress(json.data);
	if (!parsed) {
		throw new Error("Invalid academy progress returned from server");
	}
	return parsed;
}

/**
 * Signed-in resolve:
 * - DB row exists → use DB, clear local (never overwrite DB with guest)
 * - DB empty + local → PUT local once, clear local
 * - both empty → null
 */
export async function resolveAcademyProgressForSignedIn(): Promise<AcademyProgressV1 | null> {
	const remote = await fetchAcademyProgressRemote();
	if (remote) {
		clearAcademyProgressLocal();
		return remote;
	}

	const local = loadAcademyProgressLocal();
	if (!local) return null;

	const saved = await putAcademyProgressRemote(local);
	clearAcademyProgressLocal();
	return saved;
}

export type { ApiSuccess };
