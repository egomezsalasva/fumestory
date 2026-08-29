import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getClient } from "@/db";
import { corsJsonResponse, getErrorDetails, jsonResponse } from "@/utils/api";
import { getEmailForUserId } from "@/utils/payg-limits";
import {
	getStripe,
	getStripePriceId,
	isStripePackId,
	STRIPE_PACKS,
} from "@/utils/stripe";

const bodySchema = z.object({
	packId: z.string().trim().min(1),
	cancelPath: z
		.string()
		.trim()
		.regex(/^\/(?!\/)/, "cancelPath must be a relative path")
		.optional(),
});

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "https://tauri.localhost",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, x-user-id",
};

function withCheckoutCancelQuery(path: string) {
	return `${path}${path.includes("?") ? "&" : "?"}checkout=cancel`;
}

function respond(data: unknown, status: number, useCors: boolean) {
	return useCors ? corsJsonResponse(data, status) : jsonResponse(data, status);
}

export const Route = createFileRoute("/api/stripe/checkout")({
	server: {
		handlers: {
			OPTIONS: async () =>
				new Response(null, {
					status: 204,
					headers: CORS_HEADERS,
				}),
			POST: async ({ request }) => {
				const useCors =
					request.headers.get("Origin") === "https://tauri.localhost";
				try {
					let raw: unknown;
					try {
						raw = await request.json();
					} catch {
						return respond({ error: "Invalid JSON body" }, 400, useCors);
					}

					const parsed = bodySchema.safeParse(raw);
					if (!parsed.success) {
						return respond(
							{
								error: "Invalid checkout request",
								details: parsed.error.flatten(),
							},
							400,
							useCors,
						);
					}

					const { packId } = parsed.data;
					if (!isStripePackId(packId)) {
						return respond({ error: "Unknown pack" }, 400, useCors);
					}

					const priceId = getStripePriceId(packId);
					if (!priceId) {
						return respond(
							{
								error: "Stripe price not configured",
								details: `Missing ${STRIPE_PACKS[packId].priceEnv}`,
							},
							500,
							useCors,
						);
					}

					const userId = request.headers.get("x-user-id")?.trim() || undefined;
					const origin = new URL(request.url).origin;
					const cancelPath = parsed.data.cancelPath ?? "/pricing";
					const stripe = getStripe();

					let customerId: string | undefined;
					if (userId) {
						const client = await getClient();
						if (!client) {
							return respond(
								{ error: "Database not configured" },
								500,
								useCors,
							);
						}
						const email = await getEmailForUserId(client, userId);
						if (!email) {
							return respond({ error: "User email not found" }, 404, useCors);
						}

						// Existing Customer with email → Checkout email is prefilled + locked
						const existing = await stripe.customers.list({
							email,
							limit: 1,
						});
						if (existing.data[0]) {
							customerId = existing.data[0].id;
							await stripe.customers.update(customerId, {
								metadata: { userId },
							});
						} else {
							const created = await stripe.customers.create({
								email,
								metadata: { userId },
							});
							customerId = created.id;
						}
					}

					const session = await stripe.checkout.sessions.create({
						mode: "payment",
						payment_method_types: ["card"],
						...(customerId ? { customer: customerId } : {}), // guest/offline: no customer → editable email field
						client_reference_id: userId,
						line_items: [{ price: priceId, quantity: 1 }],
						success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
						cancel_url: `${origin}${withCheckoutCancelQuery(cancelPath)}`,
						metadata: {
							packId,
							...(userId ? { userId } : {}),
						},
					});

					if (!session.url) {
						return respond(
							{ error: "Checkout session missing URL" },
							500,
							useCors,
						);
					}

					return respond({ success: true, url: session.url }, 200, useCors);
				} catch (error) {
					return respond(
						{
							error: "Failed to create checkout session",
							details: getErrorDetails(error),
						},
						500,
						useCors,
					);
				}
			},
		},
	},
});
