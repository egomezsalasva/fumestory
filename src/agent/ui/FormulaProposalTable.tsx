import type { z } from "zod";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { formatPercent } from "@/agent/tools/getAvailableDilutions";

type Props = {
	lines: z.infer<typeof suggestAnyFormulaProposalSchema>["lines"];
};

export function FormulaProposalTable({ lines }: Props) {
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
					{lines.map((line, i) => (
						<tr key={i} className="border-b border-slate-600 last:border-b-0">
							<td className="align-top px-2 py-1.5 border-l border-r border-slate-600">
								<div className="text-slate-100">{line.materialDisplayName}</div>
								<div className="text-xs text-slate-400 mt-0.5">
									{formatPercent(line.dilutionPercent)}% dilution
								</div>
							</td>
							<td className="text-center align-top px-2 py-1.5 border-r border-slate-600 text-slate-100">
								{formatPercent(line.formulaPercent)}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
