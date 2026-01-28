export function jsonResponse(data: unknown, status: number): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export function getErrorDetails(error: unknown): string {
	return error instanceof Error ? error.message : "Unknown error";
}

export const noClientResponse = jsonResponse(
	{ error: "Database not configured" },
	500,
);
