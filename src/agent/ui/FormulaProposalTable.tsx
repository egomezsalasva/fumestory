import type { z } from "zod";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { formatPercent } from "@/agent/tools/getAvailableDilutions";

type FormulaLine = z.infer<
	typeof suggestAnyFormulaProposalSchema
>["lines"][number] & {
	section?: "inventory" | "addition";
};

type Props = {
	lines: FormulaLine[];
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

function SectionHeaderRow({ label }: { label: string }) {
	return (
		<tr className="bg-slate-900/60 border-y-2 border-slate-500">
			<td
				colSpan={2}
				className="px-2 py-1.5 text-[11px] uppercase tracking-wide font-semibold text-slate-300"
			>
				{label}
			</td>
		</tr>
	);
}

export function FormulaProposalTable({
	lines,
	inventoryOnlyTotalWeight,
}: Props) {
	const totalWeight = parseTotalWeight(inventoryOnlyTotalWeight);

	const inventoryLines = lines.filter((l) => l.section === "inventory");
	const additionLines = lines.filter((l) => l.section === "addition");
	const hasSections = inventoryLines.length > 0 || additionLines.length > 0;

	const orderedLines: Array<
		FormulaLine & { _section?: "inventory" | "addition" }
	> = hasSections
		? [
				...inventoryLines.map((l) => ({
					...l,
					_section: "inventory" as const,
				})),
				...additionLines.map((l) => ({ ...l, _section: "addition" as const })),
			]
		: lines.map((l) => ({ ...l, _section: undefined }));

	let lastSection: "inventory" | "addition" | undefined;

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
					{orderedLines.map((line, i) => {
						const lineWeightInfo =
							totalWeight !== null
								? {
										value: (line.formulaPercent / 100) * totalWeight.amount,
										unit: totalWeight.unit,
									}
								: null;

						const showSectionHeader =
							hasSections && line._section && line._section !== lastSection;

						if (line._section) {
							lastSection = line._section;
						}

						return (
							<>
								{showSectionHeader ? (
									line._section === "inventory" ? (
										<SectionHeaderRow label="Inventory" />
									) : (
										<SectionHeaderRow label="Suggested additions" />
									)
								) : null}

								<tr
									key={i}
									className="border-b border-slate-600 last:border-b-0"
								>
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
												{formatWeight(lineWeightInfo.value)}{" "}
												{lineWeightInfo.unit}
											</div>
										) : null}
									</td>
								</tr>
							</>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
