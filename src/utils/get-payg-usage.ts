import { getOfflineUsage, type OfflineUsage } from "@/offline/db";
import { isOffline } from "@/runtime";
import { authedFetch } from "@/utils/authed-fetch";

export type PaygUsageSnapshot = OfflineUsage & {
	email?: string | null;
};

export async function getPaygUsage(): Promise<PaygUsageSnapshot> {
	if (isOffline()) {
		return getOfflineUsage();
	}

	const res = await authedFetch("/api/payg/usage");
	const json = (await res.json()) as
		| {
				success: true;
				data: OfflineUsage & { email?: string };
		  }
		| { error?: string };

	if (!res.ok || !("success" in json) || !json.success) {
		throw new Error(
			"error" in json && typeof json.error === "string"
				? json.error
				: "Failed to load usage",
		);
	}

	const { email, ...buckets } = json.data;
	return { ...buckets, email: email ?? null };
}
