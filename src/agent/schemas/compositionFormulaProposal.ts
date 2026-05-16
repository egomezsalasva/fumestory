import { z } from "zod";

export const compositionFormulaLineSchema = z.object({
	materialDisplayName: z
		.string()
		.describe(
			"Display name as in inventory, e.g. Aldehyde C12 (Lemon)",
		),
	dilutionPercent: z
		.number()
		.describe("Stock dilution %, e.g. 10 — not formula %"),
	formulaPercent: z
		.number()
		.describe("Share of the final blend; all lines must sum to ~100"),
	dilutionId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			"Required for inventory lines when using user stock; omit for suggested additions",
		),
	section: z
		.enum(["inventory", "addition"])
		.optional()
		.describe(
			"inventory_guided only: inventory vs suggested addition",
		),
});

export const compositionFormulaProposalSchema = z.object({
	rationale: z.string(),
	lines: z.array(compositionFormulaLineSchema).min(1),
	adjustmentTips: z
		.array(z.string())
		.min(1)
		.max(4)
		.describe("2–4 short tips"),
});

export type CompositionFormulaLine = z.infer<
	typeof compositionFormulaLineSchema
>;
export type CompositionFormulaProposal = z.infer<
	typeof compositionFormulaProposalSchema
>;

export const suggestAnyFormulaLineSchema = z.object({
	materialDisplayName: z.string(),
	dilutionPercent: z.number(),
	formulaPercent: z.number(),
});

export const suggestAnyFormulaProposalSchema = z.object({
	rationale: z.string(),
	lines: z.array(suggestAnyFormulaLineSchema).min(1),
	adjustmentTips: z.array(z.string()).min(1).max(4),
});