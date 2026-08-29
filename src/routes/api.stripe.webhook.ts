import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse } from "@/utils/api";
import { getStripe, isStripePackId, STRIPE_PACKS } from "@/utils/stripe";

export const Route = createFileRoute("/api/stripe/webhook")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const signature = request.headers.get("stripe-signature");
				if (!signature) {
					return jsonResponse({ error: "Missing stripe-signature" }, 400);
				}

				const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
				if (!webhookSecret) {
					return jsonResponse({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
				}

				const stripe = getStripe();
				const rawBody = await request.text();

				let event;
				try {
					event = stripe.webhooks.constructEvent(
						rawBody,
						signature,
						webhookSecret,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Invalid webhook signature",
							details: getErrorDetails(error),
						},
						400,
					);
				}

				if (event.type !== "checkout.session.completed") {
					return jsonResponse({ received: true }, 200);
				}

				const session = event.data.object;
				if (session.mode !== "payment") {
					return jsonResponse({ received: true }, 200);
				}
				if (session.payment_status !== "paid") {
					return jsonResponse({ received: true }, 200);
				}

				const packId = session.metadata?.packId?.trim() ?? "";
				const email = session.metadata?.email?.trim().toLowerCase() ?? "";
				if (!isStripePackId(packId) || !email) {
					return jsonResponse(
						{ error: "Missing packId or email in session metadata" },
						400,
					);
				}

				const extras = STRIPE_PACKS[packId].extras;
				const code = session.id; // cs_… — unique + idempotent

				const client = await getClient();
				if (!client) {
					return jsonResponse({ error: "Database not configured" }, 500);
				}

				try {
					await client.transaction((txn) => [
						txn.query(
							`
							INSERT INTO payg_codes (
								code,
								email,
								extras_materials,
								extras_dilutions,
								extras_compositions,
								extras_mods,
								redeemed_at
							)
							VALUES ($1, $2, $3, $4, $5, $6, now())
							ON CONFLICT (code) DO NOTHING
							`,
							[
								code,
								email,
								extras.materials,
								extras.dilutions,
								extras.compositions,
								extras.mods,
							],
						),
					]);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to grant credits",
							details: getErrorDetails(error),
						},
						500,
					);
				}

				return jsonResponse({ received: true }, 200);
			},
		},
	},
});
