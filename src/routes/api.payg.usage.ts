import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { getEmailForUserId, getOnlinePaygUsage } from "@/utils/payg-limits";

export const Route = createFileRoute("/api/payg/usage")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const email = await getEmailForUserId(client, currentUserId);
					if (!email) {
						return jsonResponse({ error: "User email not found" }, 404);
					}

					const usage = await getOnlinePaygUsage(client, currentUserId, email);

					return jsonResponse(
						{
							success: true,
							data: {
								email,
								...usage,
							},
						},
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to load usage",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
