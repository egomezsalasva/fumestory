import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse } from "@/utils/api";
import { paygCodeFromCheckoutSession } from "@/utils/send-credits-issued-email";
import { getStripe, isStripePackId } from "@/utils/stripe";

export const Route = createFileRoute("/api/stripe/checkout-session")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const sessionId = new URL(request.url).searchParams
						.get("session_id")
						?.trim();
					if (!sessionId || !sessionId.startsWith("cs_")) {
						return jsonResponse({ error: "Missing session_id" }, 400);
					}

					const stripe = getStripe();
					const session = await stripe.checkout.sessions.retrieve(sessionId);

					if (session.mode !== "payment" || session.payment_status !== "paid") {
						return jsonResponse({ error: "Payment not completed" }, 402);
					}

					const packId = session.metadata?.packId?.trim() ?? "";
					const email = (
						session.customer_details?.email ??
						session.customer_email ??
						""
					)
						.trim()
						.toLowerCase();

					if (!isStripePackId(packId) || !email) {
						return jsonResponse(
							{ error: "Session missing pack or email" },
							400,
						);
					}

					const loggedInCheckout = Boolean(session.metadata?.userId?.trim());
					const code = paygCodeFromCheckoutSession(session.id);

					let autoRedeemed = false;
					const client = await getClient();
					if (client) {
						const tx = await client.transaction((txn) => [
							txn.query(
								`
								SELECT redeemed_at
								FROM payg_codes
								WHERE code = $1
								`,
								[code],
							),
						]);
						const row = (tx[0] as Array<{ redeemed_at: string | null }>)?.[0];
						autoRedeemed = Boolean(row?.redeemed_at);
					}

					return jsonResponse(
						{
							success: true,
							data: {
								email,
								code,
								packId,
								loggedInCheckout,
								autoRedeemed,
							},
						},
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load checkout session",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
