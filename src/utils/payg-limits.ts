import type { neon } from "@neondatabase/serverless";

export const FREE_MATERIALS = 50;
export const FREE_DILUTIONS = 100;
export const FREE_COMPOSITIONS = 50;
export const FREE_MODS = 100;

export type PaygUsageBucket = {
	used: number;
	limit: number;
	left: number;
};

export type PaygUsage = {
	materials: PaygUsageBucket;
	dilutions: PaygUsageBucket;
	compositions: PaygUsageBucket;
	mods: PaygUsageBucket;
};

export type PaygExtras = {
	extras_materials: number;
	extras_dilutions: number;
	extras_compositions: number;
	extras_mods: number;
};

type NeonClient = NonNullable<Awaited<ReturnType<typeof neon>>>;

function bucket(used: number, limit: number): PaygUsageBucket {
	return {
		used,
		limit,
		left: Math.max(limit - used, 0),
	};
}

function asInt(value: unknown): number {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}

/** Sum redeemed pack extras for an email (source of truth on Neon). */
export async function getPaygExtrasForEmail(
	client: NeonClient,
	email: string,
): Promise<PaygExtras> {
	const normalized = email.trim().toLowerCase();
	const tx = await client.transaction((txn) => [
		txn.query(
			`
			SELECT
				COALESCE(SUM(extras_materials), 0)::int AS extras_materials,
				COALESCE(SUM(extras_dilutions), 0)::int AS extras_dilutions,
				COALESCE(SUM(extras_compositions), 0)::int AS extras_compositions,
				COALESCE(SUM(extras_mods), 0)::int AS extras_mods
			FROM payg_codes
			WHERE email = $1
			  AND redeemed_at IS NOT NULL
			`,
			[normalized],
		),
	]);

	const row = (tx[0] as PaygExtras[] | undefined)?.[0];
	return {
		extras_materials: asInt(row?.extras_materials),
		extras_dilutions: asInt(row?.extras_dilutions),
		extras_compositions: asInt(row?.extras_compositions),
		extras_mods: asInt(row?.extras_mods),
	};
}

export async function getEmailForUserId(
	client: NeonClient,
	userId: string,
): Promise<string | null> {
	const tx = await client.transaction((txn) => [
		txn.query(
			`
			SELECT email
			FROM neon_auth."user"
			WHERE id = $1
			`,
			[userId],
		),
	]);

	const row = (tx[0] as Array<{ email: string }> | undefined)?.[0];
	const email = row?.email?.trim().toLowerCase();
	return email || null;
}

/** Counts owned inventory vs free caps + redeemed extras. */
export async function getOnlinePaygUsage(
	client: NeonClient,
	userId: string,
	email: string,
): Promise<PaygUsage> {
	const extras = await getPaygExtrasForEmail(client, email);

	const tx = await client.transaction((txn) => [
		txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [userId]),
		txn.query(
			`SELECT COUNT(*)::int AS count FROM raw_materials WHERE owner_id = $1`,
			[userId],
		),
		txn.query(
			`
			SELECT COUNT(*)::int AS count
			FROM dilutions d
			INNER JOIN raw_materials rm ON rm.id = d.raw_material_id
			WHERE rm.owner_id = $1
			`,
			[userId],
		),
		txn.query(
			`SELECT COUNT(*)::int AS count FROM compositions WHERE owner_id = $1`,
			[userId],
		),
		txn.query(
			`
			SELECT COUNT(*)::int AS count
			FROM formulas f
			INNER JOIN compositions c ON c.id = f.composition_id
			WHERE c.owner_id = $1
			`,
			[userId],
		),
	]);

	const materialsUsed = asInt((tx[1] as Array<{ count: number }>)[0]?.count);
	const dilutionsUsed = asInt((tx[2] as Array<{ count: number }>)[0]?.count);
	const compositionsUsed = asInt((tx[3] as Array<{ count: number }>)[0]?.count);
	const modsUsed = asInt((tx[4] as Array<{ count: number }>)[0]?.count);

	return {
		materials: bucket(materialsUsed, FREE_MATERIALS + extras.extras_materials),
		dilutions: bucket(dilutionsUsed, FREE_DILUTIONS + extras.extras_dilutions),
		compositions: bucket(
			compositionsUsed,
			FREE_COMPOSITIONS + extras.extras_compositions,
		),
		mods: bucket(modsUsed, FREE_MODS + extras.extras_mods),
	};
}

export function limitReachedMessage(
	kind: "materials" | "dilutions" | "compositions" | "mods",
	used: number,
	limit: number,
): string {
	const label =
		kind === "materials"
			? "Material"
			: kind === "dilutions"
				? "Dilution"
				: kind === "compositions"
					? "Composition"
					: "Formula (mod)";
	return `${label} limit reached (${used}/${limit}). Buy a capacity pack to add more.`;
}
