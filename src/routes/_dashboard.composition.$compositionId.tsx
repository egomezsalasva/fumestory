import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NotePyramidIcon } from "@/components/NotePyramidIcon";
import styles from "@/components/Form.module.css";
import { toTitleCaseWords } from "@/utils/display-names";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/_dashboard/composition/$compositionId")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Composition Details" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: CompositionDetail,
});

type FormulaLine = {
	dilution_id: number;
	material_label: string | null;
	material_name: string;
	note_type: string | null;
	category_name: string | null;
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

const NOTE_TYPE_SORT_ORDER: Record<string, number> = {
	High: 0,
	"Mid(Heart)": 1,
	Base: 2,
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
			{
				field: "material_name",
				headerName: "Material",
				flex: 1,
				minWidth: 220,
			},
			{
				field: "note_type",
				headerName: "Note",
				width: 60,
				sortable: true,
				comparator: (
					a: string | null | undefined,
					b: string | null | undefined,
				) => {
					const av =
						a != null && a in NOTE_TYPE_SORT_ORDER
							? NOTE_TYPE_SORT_ORDER[a]
							: 99;
					const bv =
						b != null && b in NOTE_TYPE_SORT_ORDER
							? NOTE_TYPE_SORT_ORDER[b]
							: 99;
					return av - bv;
				},
				cellRenderer: (params: { value?: string | null }) => (
					<div className="flex h-full items-center justify-center">
						<NotePyramidIcon noteType={params.value} />
					</div>
				),
			},
			{
				field: "category_name",
				headerName: "Family",
				width: 80,
				valueFormatter: (params) =>
					params.value ? toTitleCaseWords(params.value) : "—",
			},
			{
				field: "percentage",
				headerName: "Formula %",
				width: 130,
				sort: "desc",
				cellRenderer: (params: { value?: number }) => {
					const pct = typeof params.value === "number" ? params.value : 0;
					const fill = Math.max(0, Math.min(100, pct));

					return (
						<div className="flex h-full w-full items-center gap-3">
							<span className="w-9 shrink-0 tabular-nums">
								{Number.isInteger(pct) ? pct : pct.toFixed(2)}
							</span>
							<div
								className="h-4 min-w-0 flex-1 overflow-hidden border border-slate-500 bg-slate-800"
								aria-hidden="true"
							>
								<div
									className="h-full bg-slate-300"
									style={{ width: `${fill}%` }}
								/>
							</div>
						</div>
					);
				},
			},
			{ field: "weight_grams", headerName: "Weight (g)", width: 90 },
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
			<DashboardLayout
				title="Compositions / Composition Details"
				backButton={{ to: "/compositions" }}
			>
				{err && <p className="mt-4 text-red-400">{err}</p>}
				{!payload && !err && <p className="mt-4 text-slate-400">Loading…</p>}
				{payload && (
					<div className="max-w-3xl mx-auto">
						<div className="mt-4 flex items-start justify-between gap-4">
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl font-bold break-words">
									{payload.composition.name}
								</h1>
								<p className="text-slate-400 capitalize">
									{payload.composition.type}
								</p>
							</div>
							<Link
								to="/add-formula/$compositionId"
								params={{ compositionId: String(compositionId) }}
								className={styles.formSubmitButton}
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
												Formula (Mod) #{f.mods}
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
			</DashboardLayout>
		</>
	);
}
