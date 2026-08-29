import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { getEmailForUserId } from "@/utils/payg-limits";
import {
	getStripe,
	getStripePriceId,
	isStripePackId,
	STRIPE_PACKS,
} from "@/utils/stripe";

const bodySchema = z.object({
	packId: z.string().trim().min(1),
	email: z.string().trim().email().optional(),
	cancelPath: z
		.string()
		.trim()
		.regex(/^\/(?!\/)/, "cancelPath must be a relative path")
		.optional(),
});

function withCheckoutCancelQuery(path: string) {
	return `${path}${path.includes("?") ? "&" : "?"}checkout=cancel`;
}

export const Route = createFileRoute("/api/stripe/checkout")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const userId = auth.userId!;

					let raw: unknown;
					try {
						raw = await request.json();
					} catch {
						return jsonResponse({ error: "Invalid JSON body" }, 400);
					}

					const parsed = bodySchema.safeParse(raw);
					if (!parsed.success) {
						return jsonResponse(
							{
								error: "Invalid checkout request",
								details: parsed.error.flatten(),
							},
							400,
						);
					}

					const { packId } = parsed.data;
					if (!isStripePackId(packId)) {
						return jsonResponse({ error: "Unknown pack" }, 400);
					}

					const priceId = getStripePriceId(packId);
					if (!priceId) {
						return jsonResponse(
							{
								error: "Stripe price not configured",
								details: `Missing ${STRIPE_PACKS[packId].priceEnv}`,
							},
							500,
						);
					}

					const client = await getClient();
					if (!client) {
						return jsonResponse({ error: "Database not configured" }, 500);
					}

					const accountEmail = await getEmailForUserId(client, userId);
					if (!accountEmail) {
						return jsonResponse({ error: "User email not found" }, 404);
					}

					const email = (
						parsed.data.email?.trim().toLowerCase() || accountEmail
					).toLowerCase();

					const origin = new URL(request.url).origin;
					const cancelPath = parsed.data.cancelPath ?? "/pricing";
					const stripe = getStripe();

					const session = await stripe.checkout.sessions.create({
						mode: "payment",
						payment_method_types: ["card"],
						customer_email: email,
						client_reference_id: userId,
						line_items: [{ price: priceId, quantity: 1 }],
						success_url: `${origin}/usage?checkout=success`,
						cancel_url: `${origin}${withCheckoutCancelQuery(cancelPath)}`,
						metadata: {
							packId,
							userId,
							email,
						},
					});

					if (!session.url) {
						return jsonResponse({ error: "Checkout session missing URL" }, 500);
					}

					return jsonResponse({ success: true, url: session.url }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create checkout session",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
