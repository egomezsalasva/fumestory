import { openUrl } from "@tauri-apps/plugin-opener";
import { authClient } from "auth";
import { isOffline } from "@/runtime";
import type { StripePackId } from "@/utils/stripe";

function checkoutApiUrl() {
	if (isOffline() && !import.meta.env.DEV) {
		return "https://fumestory.com/api/stripe/checkout";
	}
	return "/api/stripe/checkout";
}

async function optionalUserId(): Promise<string | undefined> {
	if (isOffline()) return undefined;
	try {
		const sessionResult = await authClient.getSession();
		const userId =
			(
				sessionResult as {
					data?: { user?: { id?: string }; session?: { userId?: string } };
				}
			)?.data?.user?.id ??
			(sessionResult as { data?: { session?: { userId?: string } } })?.data
				?.session?.userId;
		return typeof userId === "string" && userId.trim()
			? userId.trim()
			: undefined;
	} catch {
		return undefined;
	}
}

export async function startStripeCheckout(packId: StripePackId | string) {
	const cancelPath = isOffline()
		? "/pricing"
		: `${window.location.pathname}${window.location.search}`;

	const body = JSON.stringify({ packId, cancelPath });
	const headers = new Headers({ "Content-Type": "application/json" });

	const userId = await optionalUserId();
	if (userId) headers.set("x-user-id", userId);

	const res = await fetch(checkoutApiUrl(), { method: "POST", headers, body });

	const data = (await res.json()) as {
		url?: string;
		error?: string;
		details?: string;
	};
	if (!res.ok || !data.url) {
		throw new Error(
			[data.error, data.details].filter(Boolean).join(": ") ||
				"Checkout failed",
		);
	}

	if (isOffline()) {
		await openUrl(data.url);
		return;
	}
	window.location.href = data.url;
}
