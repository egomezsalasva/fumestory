import type { z } from "zod";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { formatPercent } from "@/agent/tools/getAvailableDilutions";

type Props = {
	lines: z.infer<typeof suggestAnyFormulaProposalSchema>["lines"];
	inventoryOnlyTotalWeight?: string;
};

function parseTotalWeight(
	value?: string,
): { amount: number; unit: string } | null {
	if (!value) return null;
	const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(g|gram|grams|ml)?$/i);
	if (!m) return null;
	const amount = Number(m[1]);
	if (!Number.isFinite(amount) || amount <= 0) return null;
	const unit = (m[2] ?? "g").toLowerCase();
	const normalizedUnit = unit === "gram" || unit === "grams" ? "g" : unit;
	return { amount, unit: normalizedUnit };
}

function formatWeight(value: number): string {
	if (!Number.isFinite(value)) return "0";
	const rounded = Math.round(value * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

export function FormulaProposalTable({
	lines,
	inventoryOnlyTotalWeight,
}: Props) {
	const totalWeight = parseTotalWeight(inventoryOnlyTotalWeight);

	return (
		<div className="rounded border border-slate-600 overflow-hidden">
			<table className="w-full text-sm border-collapse">
				<thead>
					<tr className="border-b border-slate-600 bg-slate-800/50">
						<th className="text-left px-2 py-1.5 border-l border-r border-slate-600 font-semibold text-slate-200">
							Material
						</th>
						<th className="text-left px-2 py-1.5 border-r border-slate-600 font-semibold text-slate-200">
							Formula %
						</th>
					</tr>
				</thead>
				<tbody>
					{lines.map((line, i) => {
						const lineWeightInfo =
							totalWeight !== null
								? {
										value: (line.formulaPercent / 100) * totalWeight.amount,
										unit: totalWeight.unit,
									}
								: null;

						return (
							<tr key={i} className="border-b border-slate-600 last:border-b-0">
								<td className="align-top px-2 py-1.5 border-l border-r border-slate-600">
									<div className="text-slate-100">
										{line.materialDisplayName}
									</div>
									<div className="text-xs text-slate-400 mt-0.5">
										{formatPercent(line.dilutionPercent)}% dilution
									</div>
								</td>
								<td className="text-center align-top px-2 py-1.5 border-r border-slate-600 text-slate-100">
									<div>{formatPercent(line.formulaPercent)}%</div>
									{lineWeightInfo ? (
										<div className="text-xs text-slate-400 mt-0.5">
											{formatWeight(lineWeightInfo.value)} {lineWeightInfo.unit}
										</div>
									) : null}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
