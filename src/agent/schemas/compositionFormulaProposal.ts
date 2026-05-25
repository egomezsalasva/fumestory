import { z } from "zod";
import type { AvailableDilution } from "@/agent/tools/getAvailableDilutions";
import {
	inventoryRawMaterialIds,
	resolveRawMaterialId,
} from "@/agent/tools/getAvailableDilutions";

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
	return raw
		.replace(/\s+\d+(?:\.\d+)?%\s*dilution\s*-\s*\d+(?:\.\d+)?%\s*$/i, "")
		.replace(/\s+\d+(?:\.\d+)?%\s*dilution\s*$/i, "")
		.replace(/\s*-\s*\d+(?:\.\d+)?%\s*$/i, "")
		.replace(/\s+\(addition\)\s*$/i, "")
		.replace(/\s{2,}/g, " ")
		.trim();
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
	materialDisplayName: materialDisplayNameSchema,
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

export const inventoryGuidedFormulaLineSchema = z.object({
	materialDisplayName: materialDisplayNameSchema,
	dilutionPercent: z.number(),
	formulaPercent: z.number(),
	section: z.enum(["inventory", "addition"]),
});

export const inventoryGuidedFormulaProposalSchema = z
	.object({
		rationale: z.string(),
		lines: z.array(inventoryGuidedFormulaLineSchema).min(1),
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
		if (!value.lines.some((line) => line.section === "inventory")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one inventory line is required.",
				path: ["lines"],
			});
		}
		if (!value.lines.some((line) => line.section === "addition")) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one addition line is required.",
				path: ["lines"],
			});
		}
	});

export type InventoryGuidedFormulaLine = z.infer<
	typeof inventoryGuidedFormulaLineSchema
>;
export type InventoryGuidedFormulaProposal = z.infer<
	typeof inventoryGuidedFormulaProposalSchema
>;

export function getInventoryGuidedAdditionViolations(
	proposal: InventoryGuidedFormulaProposal,
	dilutions: AvailableDilution[],
): string[] {
	const inventoryIds = inventoryRawMaterialIds(dilutions);
	const violations: string[] = [];

	for (const line of proposal.lines) {
		if (line.section !== "addition") continue;

		const rawMaterialId = resolveRawMaterialId(
			line.materialDisplayName,
			dilutions,
		);

		if (rawMaterialId !== null && inventoryIds.has(rawMaterialId)) {
			violations.push(
				`"${line.materialDisplayName}" is already in inventory and must not be an addition.`,
			);
		}
	}

	return violations;
}

export function createInventoryGuidedFormulaProposalSchema(
	dilutions: AvailableDilution[],
) {
	return inventoryGuidedFormulaProposalSchema.superRefine((value, ctx) => {
		for (const message of getInventoryGuidedAdditionViolations(
			value,
			dilutions,
		)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message,
				path: ["lines"],
			});
		}
	});
}
