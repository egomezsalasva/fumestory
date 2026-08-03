import { createFileRoute } from "@tanstack/react-router";
import { getClient } from "@/db";
import {
	getErrorDetails,
	getUniqueViolationMessage,
	jsonResponse,
	noClientResponse,
} from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";

export type Category = {
	id: number;
	name: string;
	kind: "curated" | "other";
	parent_id: number | null;
};

export const Route = createFileRoute("/api/categories")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							SELECT id, name, kind, parent_id
							FROM categories
							WHERE parent_id IS NULL
							  AND kind = 'curated'
							ORDER BY name
							`,
						),
					]);
					const result = txResults[1] as Category[];

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
					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const body = await request.json();
					const { name } = body as { name?: string };
					if (!name || typeof name !== "string" || name.trim() === "") {
						return jsonResponse({ error: "Category name is required" }, 400);
					}
					const normalized = name.trim().toLowerCase();

					const txResults = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							INSERT INTO categories (name, kind, parent_id, owner_id)
							VALUES ($1, 'other', NULL, $2)
							RETURNING id, name, kind, parent_id
							`,
							[normalized, currentUserId],
						),
					]);
					const [result] = txResults[1] as Category[];

					return jsonResponse({ success: true, data: result }, 201);
				} catch (error) {
					const uniqueMessage = getUniqueViolationMessage(error);
					if (uniqueMessage) {
						return jsonResponse({ error: uniqueMessage }, 409);
					}
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
