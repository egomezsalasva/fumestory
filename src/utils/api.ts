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

type PostgresError = {
	code?: string;
	constraint?: string;
};

function getPostgresError(error: unknown): PostgresError | null {
	if (typeof error === "object" && error !== null && "code" in error) {
		return error as PostgresError;
	}
	return null;
}

export function getUniqueViolationMessage(error: unknown): string | null {
	const pg = getPostgresError(error);
	if (pg?.code !== "23505") return null;

	switch (pg.constraint) {
		case "raw_materials_owner_label_uidx":
			return "Label already exists";
		case "raw_materials_owner_name_uidx":
			return "A raw material with this name already exists";
		case "compositions_owner_label_uidx":
			return "Label already exists";
		case "compositions_owner_name_uidx":
			return "A composition with this name already exists";
		default:
			return null;
	}
}
