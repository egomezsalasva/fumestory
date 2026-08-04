import { createFileRoute } from "@tanstack/react-router";
import { getErrorDetails, jsonResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { textToCssGradients } from "@/agent/tools/textToCssGradient";

const MAX_NAMES = 20;

export const Route = createFileRoute("/api/agent/text-to-gradient")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;

					const body = await request.json().catch(() => ({}));
					const rawNames = body?.names;

					if (!Array.isArray(rawNames) || rawNames.length === 0) {
						return jsonResponse(
							{ error: "names must be a non-empty string array" },
							400,
						);
					}

					const names = rawNames
						.filter((n: unknown): n is string => typeof n === "string")
						.map((n: string) => n.trim())
						.filter(Boolean);

					if (names.length === 0) {
						return jsonResponse(
							{ error: "names must be a non-empty string array" },
							400,
						);
					}
					if (names.length > MAX_NAMES) {
						return jsonResponse(
							{ error: `Too many names (max ${MAX_NAMES})` },
							400,
						);
					}

					const gradients = await textToCssGradients(names);

					return jsonResponse({ success: true, data: gradients }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to generate note gradients",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
