import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { authedFetch } from "@/utils/authed-fetch";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/composition/$compositionId")({
	component: CompositionDetail,
});

type FormulaLine = {
	dilution_id: number;
	material_label: string;
	material_name: string;
	percentage: number;
	weight_grams: number;
};

type FormulaRow = {
	id: number;
	composition_id: number;
	mods: string;
	created_at: string;
	lines?: FormulaLine[];
};

type ApiResponse = {
	success: boolean;
	data: {
		composition: {
			id: number;
			name: string;
			type: string;
			created_at: string;
		};
		formulas: FormulaRow[];
	};
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

function CompositionDetail() {
	const { compositionId } = Route.useParams();
	const [payload, setPayload] = useState<ApiResponse["data"] | null>(null);
	const [err, setErr] = useState<string | null>(null);

	const columnDefs = useMemo<ColDef<FormulaLine>[]>(
		() => [
			{ field: "material_label", headerName: "Label", width: 110 },
			{
				field: "material_name",
				headerName: "Material",
				flex: 1,
				minWidth: 220,
			},
			{ field: "percentage", headerName: "Formula %", width: 130 },
			{ field: "weight_grams", headerName: "Weight (g)", width: 130 },
		],
		[],
	);

	useEffect(() => {
		let cancelled = false;
		setErr(null);
		authedFetch(`/api/compositions/${compositionId}`)
			.then(async (res) => {
				const json = (await res.json()) as ApiResponse | { error?: string };
				if (!res.ok) {
					throw new Error(
						"error" in json && json.error ? json.error : res.statusText,
					);
				}
				if ("data" in json && json.data && !cancelled) setPayload(json.data);
			})
			.catch((e: unknown) => {
				if (!cancelled)
					setErr(e instanceof Error ? e.message : "Failed to load");
			});
		return () => {
			cancelled = true;
		};
	}, [compositionId]);

	return (
		<>
			<style>{gridStyles}</style>
			<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8 text-white">
				<Link to="/compositions" className="text-sky-300 hover:underline">
					← Back
				</Link>
				{err && <p className="mt-4 text-red-400">{err}</p>}
				{!payload && !err && <p className="mt-4 text-slate-400">Loading…</p>}
				{payload && (
					<div className="max-w-3xl">
						<div className="mt-4 flex flex-wrap items-start justify-between gap-4">
							<div>
								<h1 className="text-2xl font-bold">
									{payload.composition.name}
								</h1>
								<p className="text-slate-400 capitalize">
									{payload.composition.type}
								</p>
							</div>
							<Link
								to="/add-formula/$compositionId"
								params={{ compositionId: String(compositionId) }}
								className="shrink-0 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
							>
								Add Formula
							</Link>
						</div>

						{payload.formulas.length === 0 ? (
							<p className="mt-6 text-slate-400">No formulas yet.</p>
						) : (
							[...payload.formulas]
								.sort((a, b) => b.id - a.id)
								.map((f) => {
									const lines = f.lines ?? [];
									return (
										<section key={f.id} className="mt-8">
											<h2 className="text-lg font-semibold text-white mb-3">
												Formula #{f.mods}
											</h2>
											{lines.length === 0 ? (
												<p className="text-slate-400 text-sm">
													No ingredient lines.
												</p>
											) : (
												<div
													className="nested-grid ag-theme-quartz-dark"
													style={{ height: "auto", width: "100%" }}
												>
													<AgGridReact<FormulaLine>
														rowData={lines}
														columnDefs={columnDefs}
														getRowId={(p) =>
															`${f.id}-${String(p.data?.dilution_id)}`
														}
														domLayout="autoHeight"
														theme="legacy"
													/>
												</div>
											)}
										</section>
									);
								})
						)}
					</div>
				)}
			</div>
		</>
	);
}
