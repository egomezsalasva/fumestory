import { z } from "zod";

const FORMULA_TOTAL_TARGET = 100;
const FORMULA_TOTAL_TOLERANCE = 0.1;

function isFormulaTotalValid(
	lines: Array<{ formulaPercent: number }>,
): boolean {
	const total = lines.reduce((sum, line) => sum + line.formulaPercent, 0);
	return Math.abs(total - FORMULA_TOTAL_TARGET) <= FORMULA_TOTAL_TOLERANCE;
}

const formulaTotalErrorMessage = `formulaPercent values must sum to ${FORMULA_TOTAL_TARGET} (±${FORMULA_TOTAL_TOLERANCE}).`;

function sanitizeMaterialDisplayName(raw: string): string {
	return (
		raw
			// "Rose Oil 10% dilution - 18%"
			.replace(/\s+\d+(?:\.\d+)?%\s*dilution\s*-\s*\d+(?:\.\d+)?%\s*$/i, "")
			// "Rose Oil 10% dilution"
			.replace(/\s+\d+(?:\.\d+)?%\s*dilution\s*$/i, "")
			// "Rose Oil - 18%"
			.replace(/\s*-\s*\d+(?:\.\d+)?%\s*$/i, "")
			.replace(/\s{2,}/g, " ")
			.trim()
	);
}

const materialDisplayNameSchema = z
	.string()
	.min(1)
	.transform((value) => sanitizeMaterialDisplayName(value))
	.refine((value) => value.length > 0, {
		message: "materialDisplayName must not be empty.",
	});

export const compositionFormulaLineSchema = z.object({
	materialDisplayName: materialDisplayNameSchema.describe(
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
		.describe("inventory_guided only: inventory vs suggested addition"),
});

export const compositionFormulaProposalSchema = z
	.object({
		rationale: z.string(),
		lines: z.array(compositionFormulaLineSchema).min(1),
		adjustmentTips: z
			.array(z.string())
			.min(1)
			.max(4)
			.describe("2–4 short tips"),
	})
	.superRefine((value, ctx) => {
		if (!isFormulaTotalValid(value.lines)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: formulaTotalErrorMessage,
				path: ["lines"],
			});
		}
	});

export type CompositionFormulaLine = z.infer<
	typeof compositionFormulaLineSchema
>;
export type CompositionFormulaProposal = z.infer<
	typeof compositionFormulaProposalSchema
>;

export const suggestAnyFormulaLineSchema = z.object({
	materialDisplayName: materialDisplayNameSchema, // <-- important fix
	dilutionPercent: z.number(),
	formulaPercent: z.number(),
});

export const suggestAnyFormulaProposalSchema = z
	.object({
		rationale: z.string(),
		lines: z.array(suggestAnyFormulaLineSchema).min(1),
		adjustmentTips: z.array(z.string()).min(1).max(4),
	})
	.superRefine((value, ctx) => {
		if (!isFormulaTotalValid(value.lines)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: formulaTotalErrorMessage,
				path: ["lines"],
			});
		}
	});
