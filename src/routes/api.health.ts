import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();

					if (!client) {
						return new Response(
							JSON.stringify({ error: "Database not configured" }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Test query - get categories
					const result = await client.query("SELECT * FROM categories");

					return new Response(
						JSON.stringify({
							success: true,
							message: "Connected to Neon!",
							data: result,
						}),
						{
							status: 200,
							headers: { "Content-Type": "application/json" },
						},
					);
				} catch (error) {
					return new Response(
						JSON.stringify({
							error: "Database connection failed",
							details: error instanceof Error ? error.message : "Unknown error",
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
