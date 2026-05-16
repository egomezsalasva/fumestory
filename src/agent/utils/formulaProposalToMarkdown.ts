import type { CompositionFormulaProposal } from "@/agent/schemas/compositionFormulaProposal";
import { formatPercent } from "@/agent/tools/getAvailableDilutions";

function formatLine(
	materialDisplayName: string,
	dilutionPercent: number,
	formulaPercent: number,
): string {
	return `${materialDisplayName} ${formatPercent(dilutionPercent)}% dilution - ${formatPercent(formulaPercent)}%`;
}

export function formulaProposalToMarkdown(
	proposal: CompositionFormulaProposal,
): string {
	const formulaLines = proposal.lines
		.map((line) =>
			formatLine(
				line.materialDisplayName,
				line.dilutionPercent,
				line.formulaPercent,
			),
		)
		.join("\n");

	const tips = proposal.adjustmentTips.map((t) => `- ${t}`).join("\n");

	return [
		proposal.rationale.trim(),
		"",
		"**Starter formula**",
		"",
		formulaLines,
		"",
		"**Total formula %: 100**",
		"",
		"**Adjustment tips**",
		"",
		tips,
	].join("\n");
}
