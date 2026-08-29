import { authedFetch } from "@/utils/authed-fetch";
import type { StripePackId } from "@/utils/stripe";

export async function startStripeCheckout(packId: StripePackId | string) {
	const cancelPath = `${window.location.pathname}${window.location.search}`;
	const res = await authedFetch("/api/stripe/checkout", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ packId, cancelPath }),
	});
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
	window.location.href = data.url;
}
