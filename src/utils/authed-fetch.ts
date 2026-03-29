import { authClient } from "../../auth";

export async function authedFetch(
	input: RequestInfo | URL,
	init: RequestInit = {},
) {
	const sessionResult = await authClient.getSession();

	const userId =
		(sessionResult as any)?.data?.user?.id ??
		(sessionResult as any)?.data?.session?.userId ??
		(sessionResult as any)?.data?.session?.user?.id;

	if (!userId || typeof userId !== "string") {
		throw new Error("Unauthorized: missing authenticated user id");
	}

	const headers = new Headers(init.headers);
	headers.set("x-user-id", userId);

	return fetch(input, { ...init, headers });
}
