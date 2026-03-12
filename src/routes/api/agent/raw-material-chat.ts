import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/agent/raw-material-chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = await request.json().catch(() => ({}));
				const userMessage = body?.message ?? "";

				// For now, just return a canned response so we can wire UI → API
				return new Response(
					JSON.stringify({
						success: true,
						reply: userMessage?.trim()
							? `Stub reply: I received "${userMessage}". (No model wired yet.)`
							: "Stub reply: Ask me about a raw material you want to add.",
					}),
					{
						status: 200,
						headers: { "Content-Type": "application/json" },
					},
				);
			},
		},
	},
});
