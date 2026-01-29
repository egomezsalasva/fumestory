import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";

export type Note = {
	id: number;
	name: string;
};

export const Route = createFileRoute("/api/notes")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const result = (await client.query(
						`
                    SELECT id, name
                    FROM notes
                    `,
					)) as Note[];

					return jsonResponse(
						{
							success: true,
							data: result as Note[],
						},
						200,
					);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to find notes",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
