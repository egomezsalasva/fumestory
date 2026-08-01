import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import type { DilutionBlindTestStats } from "./api.scent-blind-tests";
import { authedFetch } from "@/utils/authed-fetch";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/_dashboard/scent-knowledge")({
	...requireNavRoute("/scent-knowledge"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Scent Knowledge" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: ScentKnowledge,
});

type ScentKnowledgeRow = DilutionBlindTestStats;

function ScentKnowledge() {
	const [stats, setStats] = useState<DilutionBlindTestStats[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const statsRes = await authedFetch("/api/scent-blind-tests");
				const statsJson = await statsRes.json();
				if (cancelled) return;

				if (statsRes.ok && Array.isArray(statsJson.data)) {
					setStats(statsJson.data as DilutionBlindTestStats[]);
				}
			} catch (err) {
				console.error("Scent knowledge load error:", err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const rowData = useMemo((): ScentKnowledgeRow[] => {
		return [...stats].sort((a, b) => {
			if (a.success_percentage !== b.success_percentage) {
				return a.success_percentage - b.success_percentage;
			}
			const nameCmp = a.material_name.localeCompare(b.material_name);
			if (nameCmp !== 0) return nameCmp;
			return a.percentage - b.percentage;
		});
	}, [stats]);

	const columnDefs: ColDef<ScentKnowledgeRow>[] = [
		{
			field: "material_name",
			headerName: "Material",
			width: 280,
		},
		{
			field: "percentage",
			headerName: "Dilution %",
			flex: 1,
			minWidth: 100,
			filter: "agNumberColumnFilter",
			valueFormatter: (params) =>
				params.value != null ? `${params.value}%` : "—",
		},
		{
			field: "attempts",
			headerName: "Attempts",
			width: 120,
			filter: "agNumberColumnFilter",
		},
		{
			field: "success_percentage",
			headerName: "Success %",
			width: 120,
			filter: "agNumberColumnFilter",
			valueFormatter: (params) =>
				params.value != null ? `${params.value}%` : "—",
		},
	];

	return (
		<DashboardLayout
			title="Scent Knowledge"
			plusButton={{ to: "/scent-blind-test" }}
		>
			{loading ? (
				<p className="text-sm text-slate-400 px-2">Loading…</p>
			) : (
				<div
					className="ag-theme-quartz-dark"
					style={{ height: "100%", width: "100%", minHeight: "680px" }}
				>
					<AgGridReact<ScentKnowledgeRow>
						rowData={rowData}
						columnDefs={columnDefs}
						getRowId={(p) =>
							`${p.data?.material_name ?? ""}-${p.data?.percentage ?? 0}`
						}
						defaultColDef={{
							filter: true,
							sortable: true,
							resizable: true,
						}}
						pagination={true}
						paginationPageSize={20}
						theme="legacy"
					/>
				</div>
			)}
		</DashboardLayout>
	);
}
