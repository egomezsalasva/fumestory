import { jsonResponse } from "./api";

export function requireCurrentUserId(request: Request) {
	const userId = request.headers.get("x-user-id");

	if (!userId || !userId.trim()) {
		return {
			userId: null,
			errorResponse: jsonResponse({ error: "Unauthorized" }, 401),
		};
	}

	return { userId: userId.trim(), errorResponse: null };
}
