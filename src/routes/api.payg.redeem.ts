import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getClient } from "@/db";
import { corsJsonResponse, getErrorDetails } from "@/utils/api";

const redeemBodySchema = z.object({
	email: z.string().trim().email(),
	code: z.string().trim().min(6),
	install_id: z.string().uuid().optional(),
});

type PaygCodeRow = {
	code: string;
	email: string;
	redeemed_at: string | null;
};

type ExtrasRow = {
	extras_materials: number;
	extras_dilutions: number;
	extras_compositions: number;
	extras_mods: number;
};

export const Route = createFileRoute("/api/payg/redeem")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) {
						return corsJsonResponse({ error: "Database not configured" }, 500);
					}

					let raw: unknown;
					try {
						raw = await request.json();
					} catch {
						return corsJsonResponse({ error: "Invalid JSON body" }, 400);
					}

					const parsed = redeemBodySchema.safeParse(raw);
					if (!parsed.success) {
						return corsJsonResponse(
							{
								error: "Invalid redeem request",
								details: parsed.error.flatten(),
							},
							400,
						);
					}

					const email = parsed.data.email.toLowerCase();
					const code = parsed.data.code.trim();
					const installId = parsed.data.install_id;

					const lookupTx = await client.transaction((txn) => [
						txn.query(
							`
							SELECT code, email, redeemed_at
							FROM payg_codes
							WHERE code = $1
							`,
							[code],
						),
					]);

					const rows = lookupTx[0] as PaygCodeRow[];
					const existing = rows[0];
					if (!existing) {
						return corsJsonResponse({ error: "Invalid code" }, 404);
					}
					if (existing.email !== email) {
						return corsJsonResponse(
							{ error: "Code is not valid for this email" },
							403,
						);
					}
					if (existing.redeemed_at) {
						return corsJsonResponse({ error: "Code already redeemed" }, 409);
					}

					const redeemQueries = [
						{
							sql: `
								UPDATE payg_codes
								SET redeemed_at = now()
								WHERE code = $1
								  AND email = $2
								  AND redeemed_at IS NULL
								RETURNING code
							`,
							params: [code, email] as unknown[],
						},
						{
							sql: `
								SELECT
									COALESCE(SUM(extras_materials), 0)::int AS extras_materials,
									COALESCE(SUM(extras_dilutions), 0)::int AS extras_dilutions,
									COALESCE(SUM(extras_compositions), 0)::int AS extras_compositions,
									COALESCE(SUM(extras_mods), 0)::int AS extras_mods
								FROM payg_codes
								WHERE email = $1
								  AND redeemed_at IS NOT NULL
							`,
							params: [email] as unknown[],
						},
					];

					if (installId) {
						redeemQueries.push({
							sql: `
								INSERT INTO offline_installs (install_id, email)
								VALUES ($1::uuid, $2)
								ON CONFLICT (install_id) DO UPDATE
								SET email = COALESCE(EXCLUDED.email, offline_installs.email)
							`,
							params: [installId, email],
						});
					}

					const redeemTx = await client.transaction((txn) =>
						redeemQueries.map((q) => txn.query(q.sql, q.params)),
					);

					const claimed = redeemTx[0] as Array<{ code: string }>;
					if (!claimed[0]) {
						return corsJsonResponse({ error: "Code already redeemed" }, 409);
					}

					const totals = (redeemTx[1] as ExtrasRow[])[0] ?? {
						extras_materials: 0,
						extras_dilutions: 0,
						extras_compositions: 0,
						extras_mods: 0,
					};

					return corsJsonResponse(
						{
							success: true,
							data: {
								email,
								extras_materials: totals.extras_materials,
								extras_dilutions: totals.extras_dilutions,
								extras_compositions: totals.extras_compositions,
								extras_mods: totals.extras_mods,
							},
						},
						200,
					);
				} catch (error) {
					return corsJsonResponse(
						{
							error: "Failed to redeem code",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
