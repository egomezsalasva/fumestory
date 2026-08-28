import { getVersion } from "@tauri-apps/api/app";
import { isOffline } from "@/runtime";

export type AppUpdateInfo = {
	version: string;
	downloadUrl: string;
};

type LatestJson = {
	version?: string;
	download_url?: string;
};

const DISMISS_KEY = "fumestory.dismissedUpdateVersion";

export function dismissAppUpdate(version: string): void {
	localStorage.setItem(DISMISS_KEY, version);
}

function isDismissed(version: string): boolean {
	return localStorage.getItem(DISMISS_KEY) === version;
}

function parseParts(v: string): [number, number, number] {
	const parts = v
		.trim()
		.replace(/^v/i, "")
		.split(".")
		.map((n) => parseInt(n, 10) || 0);
	return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

function isNewer(latest: string, current: string): boolean {
	const [l1, l2, l3] = parseParts(latest);
	const [c1, c2, c3] = parseParts(current);
	if (l1 !== c1) return l1 > c1;
	if (l2 !== c2) return l2 > c2;
	return l3 > c3;
}

export async function checkForAppUpdate(): Promise<AppUpdateInfo | null> {
	if (!isOffline()) return null;

	const url = import.meta.env.DEV
		? "/latest.json"
		: "https://fumestory.com/latest.json";

	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) return null;

	const json = (await res.json()) as LatestJson;
	const latestVersion = json.version?.trim();
	const downloadUrl = json.download_url?.trim();
	if (!latestVersion || !downloadUrl) return null;

	const current = await getVersion();
	if (!isNewer(latestVersion, current)) return null;
	if (isDismissed(latestVersion)) return null;

	return { version: latestVersion, downloadUrl };
}
