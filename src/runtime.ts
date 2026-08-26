export type AppRuntime = "cloud" | "offline";

export const APP_RUNTIME: AppRuntime =
	import.meta.env.VITE_APP_RUNTIME === "offline" ? "offline" : "cloud";

export function isOffline(): boolean {
	return APP_RUNTIME === "offline";
}
