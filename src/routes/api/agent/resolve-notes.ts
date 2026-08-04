import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getClient } from "@/db";
import { getErrorDetails, jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { textToCssGradients } from "@/agent/tools/textToCssGradient";

const MAX_NAMES = 20;

type CatalogNote = {
	id: number;
	name: string;
	kind: "curated" | "other";
	color: string | null;
};

export type ResolvedNote = {
	name: string;
	kind: "curated" | "other";
	color: string | null;
	isNew: boolean;
};

const llmResultSchema = z.object({
	notes: z.array(
		z.object({
			input: z.string().describe("Original name from the request"),
			action: z
				.enum(["match", "new"])
				.describe("match = use an existing catalog name; new = create other"),
			name: z
				.string()
				.describe(
					"Final note name. If match: must be exact catalog name. If new: normalized name.",
				),
		}),
	),
});

const SYSTEM = `You resolve perfume note tags for an inventory form.

You receive:
1) candidate note names from an AI material proposal
2) a catalog of existing notes (curated + user's other)

For each candidate:
1) Normalize wording:
   - lowercase
   - slightly / softly / somewhat / "a bit" → use "lightly" (e.g. slightly floral → lightly floral)
2) Matching policy:
   - Same smell, different word form → MATCH catalog (musky → musk, woodiness → wood or woody if present)
   - Amount / intensity phrases stay DISTINCT (lightly floral must NOT become floral)
   - Prefer curated when both curated and other could match
   - Only MATCH a name that appears EXACTLY in the catalog list (copy spelling exactly)
3) If no good catalog match → action=new with normalized name

Do NOT invent colors or gradients. Deduplicate: if two inputs resolve to the same final name, only return one.
Return one entry per surviving final note.`;

export const Route = createFileRoute("/api/agent/resolve-notes")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const client = await getClient();
					if (!client) return noClientResponse;

					const auth = requireCurrentUserId(request);
					if (auth.errorResponse) return auth.errorResponse;
					const currentUserId = auth.userId!;

					const body = await request.json().catch(() => ({}));
					const rawNames = body?.names;
					if (!Array.isArray(rawNames) || rawNames.length === 0) {
						return jsonResponse(
							{ error: "names must be a non-empty string array" },
							400,
						);
					}

					const names = rawNames
						.filter((n: unknown): n is string => typeof n === "string")
						.map((n) => n.trim())
						.filter(Boolean);

					if (names.length === 0) {
						return jsonResponse(
							{ error: "names must be a non-empty string array" },
							400,
						);
					}
					if (names.length > MAX_NAMES) {
						return jsonResponse(
							{ error: `Too many names (max ${MAX_NAMES})` },
							400,
						);
					}

					const tx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							currentUserId,
						]),
						txn.query(
							`
							SELECT id, name, kind, color
							FROM notes
							WHERE kind = 'curated'
							   OR (
							     kind = 'other'
							     AND owner_id = $1
							     AND color IS NOT NULL
							   )
							ORDER BY
								CASE WHEN kind = 'curated' THEN 0 ELSE 1 END,
								name
							`,
							[currentUserId],
						),
					]);
					const catalog = tx[1] as CatalogNote[];
					const byName = new Map(
						catalog.map((n) => [n.name.trim().toLowerCase(), n]),
					);

					const catalogList = catalog
						.map((n) => `- ${n.name} (${n.kind})`)
						.join("\n");

					const result = await generateText({
						model: openai("gpt-4o-mini"),
						output: Output.object({ schema: llmResultSchema }),
						system: SYSTEM,
						prompt: [
							"Catalog:",
							catalogList || "(empty)",
							"",
							"Candidates:",
							...names.map((n) => `- ${n}`),
						].join("\n"),
					});

					const llmNotes = result.output?.notes ?? [];
					const matched: ResolvedNote[] = [];
					const newNames: string[] = [];
					const seen = new Set<string>();

					for (const item of llmNotes) {
						const finalName = item.name.trim().toLowerCase();
						if (!finalName || seen.has(finalName)) continue;

						if (item.action === "match") {
							const hit = byName.get(finalName);
							if (hit) {
								seen.add(finalName);
								matched.push({
									name: hit.name,
									kind: hit.kind,
									color: hit.color,
									isNew: false,
								});
								continue;
							}
							// Invented catalog name → create as new
						}

						seen.add(finalName);
						newNames.push(finalName);
					}

					const gradients =
						newNames.length > 0 ? await textToCssGradients(newNames) : {};

					const resolved: ResolvedNote[] = [
						...matched,
						...newNames.map((name) => ({
							name,
							kind: "other" as const,
							color:
								gradients[name] ?? "linear-gradient(135deg, #94a3b8, #64748b)",
							isNew: true,
						})),
					];

					return jsonResponse({ success: true, data: resolved }, 200);
				} catch (error) {
					return jsonResponse(
						{
							error: "Failed to resolve notes",
							details: getErrorDetails(error),
						},
						500,
					);
				}
			},
		},
	},
});
