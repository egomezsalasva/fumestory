import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";

export type Category = {
	id: number;
	name: string;
};

export const Route = createFileRoute("/api/categories")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const result = await client.query(
						"SELECT id, name FROM categories ORDER BY name",
					);
					return jsonResponse({ success: true, data: result }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to find categories",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
			POST: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const body = await request.json();
					const { name } = body as { name: Category["name"] };
					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse({ error: "Category name is required" }, 400);
					}
					const [result] = (await client.query(
						"INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
						[name.trim().toLowerCase()],
					)) as Category[];
					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to create category",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
