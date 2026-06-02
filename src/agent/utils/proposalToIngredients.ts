import type { z } from "zod";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import {
	type AvailableDilution,
	resolveRawMaterialId,
} from "@/agent/tools/getAvailableDilutions";
import type { Ingredient } from "@/hooks/useFormulaIngredients";
import type { Dilution } from "@/routes/api.dilutions";
import type { RawMaterial } from "@/routes/api.raw-materials";
import { authedFetch } from "@/utils/authed-fetch";

type FormulaProposal = z.infer<typeof suggestAnyFormulaProposalSchema>;
type FormulaLine = FormulaProposal["lines"][number];

const DILUTION_PERCENT_TOLERANCE = 0.1;

export type ProposalToIngredientsResult = {
	ingredients: Ingredient[];
	errors: string[];
};

export function parseInventoryTotalWeight(value?: string): number | null {
	if (!value) return null;
	const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(?:g|gram|grams)?$/i);
	if (!m) return null;
	const amount = Number(m[1]);
	if (!Number.isFinite(amount) || amount <= 0) return null;
	return amount;
}

function formatWeight(value: number): string {
	if (!Number.isFinite(value)) return "0";
	const rounded = Math.round(value * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function formatFormulaPercent(value: number): string {
	if (!Number.isFinite(value)) return "0";
	const rounded = Math.round(value * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function resolveDilutionForLine(
	rawMaterialId: number,
	dilutionPercent: number,
	dilutions: AvailableDilution[],
): AvailableDilution | null {
	const matches = dilutions.filter(
		(d) =>
			d.rawMaterialId === rawMaterialId &&
			Math.abs(d.percentage - dilutionPercent) <= DILUTION_PERCENT_TOLERANCE,
	);

	if (matches.length === 0) return null;

	return matches.sort((a, b) => a.dilutionId - b.dilutionId)[0];
}

export function dilutionsFromApiData(
	dilutions: Dilution[],
	materials: RawMaterial[],
): AvailableDilution[] {
	const materialById = new Map(materials.map((m) => [m.id, m]));

	return dilutions
		.filter((d) => d.available)
		.map((d) => {
			const material = materialById.get(d.raw_material_id);
			return {
				dilutionId: d.id,
				percentage: d.percentage,
				rawMaterialId: d.raw_material_id,
				materialName: material?.name ?? "Unknown",
				materialLabel: material?.label ?? "",
				noteType: material?.note_type ?? "",
			};
		});
}

export function proposalToIngredients(
	proposal: FormulaProposal,
	inventoryOnlyTotalWeight: string,
	availableDilutions: AvailableDilution[],
): ProposalToIngredientsResult {
	const totalWeight = parseInventoryTotalWeight(inventoryOnlyTotalWeight);
	if (!totalWeight) {
		return {
			ingredients: [],
			errors: ["Invalid total weight. Use grams, e.g. 5g."],
		};
	}

	const errors: string[] = [];
	const ingredients: Ingredient[] = [];
	const usedDilutionIds = new Set<number>();

	for (const line of proposal.lines) {
		const error = lineToIngredient(line, availableDilutions, usedDilutionIds);

		if (error) {
			errors.push(error);
			continue;
		}

		const ingredient = lineToIngredientValue(
			line,
			totalWeight,
			availableDilutions,
			usedDilutionIds,
		);

		if (ingredient) {
			ingredients.push(ingredient);
		}
	}

	if (errors.length > 0) {
		return { ingredients: [], errors };
	}

	return { ingredients, errors: [] };
}

function lineToIngredient(
	line: FormulaLine,
	availableDilutions: AvailableDilution[],
	usedDilutionIds: Set<number>,
): string | null {
	const rawMaterialId = resolveRawMaterialId(
		line.materialDisplayName,
		availableDilutions,
	);

	if (rawMaterialId === null) {
		return `Could not match "${line.materialDisplayName}" to your inventory.`;
	}

	const dilution = resolveDilutionForLine(
		rawMaterialId,
		line.dilutionPercent,
		availableDilutions,
	);

	if (!dilution) {
		return `Could not find a ${line.dilutionPercent}% dilution for "${line.materialDisplayName}".`;
	}

	if (usedDilutionIds.has(dilution.dilutionId)) {
		return `Duplicate dilution for "${line.materialDisplayName}".`;
	}

	return null;
}

function lineToIngredientValue(
	line: FormulaLine,
	totalWeightAmount: number,
	availableDilutions: AvailableDilution[],
	usedDilutionIds: Set<number>,
): Ingredient | null {
	const rawMaterialId = resolveRawMaterialId(
		line.materialDisplayName,
		availableDilutions,
	);
	if (rawMaterialId === null) return null;

	const dilution = resolveDilutionForLine(
		rawMaterialId,
		line.dilutionPercent,
		availableDilutions,
	);
	if (!dilution) return null;

	usedDilutionIds.add(dilution.dilutionId);

	const weightGrams = (line.formulaPercent / 100) * totalWeightAmount;

	return {
		id: crypto.randomUUID(),
		raw_material_id: dilution.rawMaterialId,
		raw_material_name: dilution.materialName,
		dilution_id: dilution.dilutionId,
		dilution_percentage: dilution.percentage,
		weight_grams: formatWeight(weightGrams),
		formula_percentage: formatFormulaPercent(line.formulaPercent),
		displayText: `${dilution.materialName} - ${dilution.percentage}%`,
	};
}

export async function fetchAndConvertProposalToIngredients(
	proposal: FormulaProposal,
	inventoryOnlyTotalWeight: string,
): Promise<ProposalToIngredientsResult> {
	try {
		const [dilutionsRes, materialsRes] = await Promise.all([
			authedFetch("/api/dilutions"),
			authedFetch("/api/raw-materials"),
		]);

		const dilutionsJson = await dilutionsRes.json();
		const materialsJson = await materialsRes.json();

		if (!dilutionsRes.ok || !dilutionsJson.success) {
			return {
				ingredients: [],
				errors: [dilutionsJson.error ?? "Failed to load dilutions."],
			};
		}

		if (!materialsRes.ok || !materialsJson.success) {
			return {
				ingredients: [],
				errors: [materialsJson.error ?? "Failed to load raw materials."],
			};
		}

		const availableDilutions = dilutionsFromApiData(
			dilutionsJson.data as Dilution[],
			materialsJson.data as RawMaterial[],
		);

		return proposalToIngredients(
			proposal,
			inventoryOnlyTotalWeight,
			availableDilutions,
		);
	} catch {
		return {
			ingredients: [],
			errors: ["Failed to load inventory data for autofill."],
		};
	}
}
