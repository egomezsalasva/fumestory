import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/formulas")({
	component: Formulas,
});

type FormulaIngredient = {
	material_name: string;
	percentage: number;
};

type Formula = {
	id: number;
	name: string;
	type: "trial" | "accord" | "perfume";
	created_at: string;
	ingredient_count: number;
	total_weight: number;
	ingredients: FormulaIngredient[];
};

const gridStyles = `
	.nested-grid .ag-header {
		background-color: rgb(51, 65, 85) !important;
	}
	.nested-grid .ag-header-cell {
		background-color: rgb(51, 65, 85) !important;
		color: rgb(226, 232, 240) !important;
		font-size: 13px !important;
	}
	.nested-grid .ag-header-cell-text {
		color: rgb(226, 232, 240) !important;
	}
	.nested-grid .ag-paging-panel,
	.nested-grid .ag-paging-row-summary-panel,
	.nested-grid .ag-paging-page-summary-panel {
		display: none !important;
	}
	.nested-grid .ag-root-wrapper {
		border-bottom: none !important;
	}
`;

function Formulas() {
	const [formulas, setFormulas] = useState<Formula[]>([]);

	useEffect(() => {
		fetch("/api/formulas")
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched formulas:", data.data);
				setFormulas(data.data as Formula[]);
			})
			.catch((err) => console.error("Formulas error:", err));
	}, []);

	const columnDefs: ColDef<Formula>[] = [
		{ field: "name", headerName: "Name", width: 200 },
		{
			field: "type",
			headerName: "Type",
			width: 500,
			valueFormatter: (params) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		},
		{
			field: "ingredients",
			headerName: "Formula",
			flex: 1,
			cellRenderer: (params: any) => {
				const ingredients = params.value as FormulaIngredient[] | undefined;

				if (!ingredients || ingredients.length === 0) {
					return <span className="text-slate-500">—</span>;
				}

				return (
					<div className="py-2">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-slate-700">
									<th className="text-left px-3 py-1 text-slate-300 text-sm border border-slate-600">
										Material
									</th>
									<th className="text-left px-3 py-1 text-slate-300 text-sm border border-slate-600 w-20">
										%
									</th>
								</tr>
							</thead>
							<tbody>
								{ingredients.map((ing, idx) => (
									<tr key={idx} className="bg-slate-800">
										<td className="px-3 py-1 text-slate-300 text-sm border border-slate-600">
											{ing.material_name}
										</td>
										<td className="px-3 py-1 text-slate-400 text-sm border border-slate-600">
											{ing.percentage}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				);
			},
			autoHeight: true,
		},
	];

	return (
		<>
			<style>{gridStyles}</style>
			<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
				<div className="max-w-8xl mx-auto">
					<h1 className="text-2xl font-bold text-white mb-7">Formulas</h1>
					<div
						className="ag-theme-quartz-dark"
						style={{ height: "680px", width: "100%" }}
					>
						<AgGridReact
							rowData={formulas}
							columnDefs={columnDefs}
							pagination={true}
							paginationPageSize={20}
							theme="legacy"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
