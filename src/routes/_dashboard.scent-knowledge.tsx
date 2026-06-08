import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import type { Dilution } from "./api.dilutions";
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

type ScentKnowledgeRow = {
	dilution_id: number;
	material_name: string;
	percentage: number;
	attempts: number;
	success_percentage: number;
};

function resolveDilutionMeta(
	dilutionId: number,
	dilutions: Dilution[],
	materials: { id: number; name: string }[],
): { material_name: string; percentage: number } {
	const d = dilutions.find((x) => x.id === dilutionId);
	if (!d) {
		return { material_name: `Dilution #${dilutionId}`, percentage: 0 };
	}
	const material = materials.find((m) => m.id === d.raw_material_id);
	return {
		material_name: material?.name ?? "Unknown",
		percentage: d.percentage,
	};
}

function ScentKnowledge() {
	const [stats, setStats] = useState<DilutionBlindTestStats[]>([]);
	const [dilutions, setDilutions] = useState<Dilution[]>([]);
	const [materials, setMaterials] = useState<{ id: number; name: string }[]>(
		[],
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const [statsRes, materialsRes, dilutionsRes] = await Promise.all([
					authedFetch("/api/scent-blind-tests"),
					authedFetch("/api/raw-materials"),
					authedFetch("/api/dilutions"),
				]);
				const [statsJson, materialsJson, dilutionsJson] = await Promise.all([
					statsRes.json(),
					materialsRes.json(),
					dilutionsRes.json(),
				]);
				if (cancelled) return;

				if (statsRes.ok && Array.isArray(statsJson.data)) {
					setStats(statsJson.data as DilutionBlindTestStats[]);
				}
				if (materialsRes.ok && Array.isArray(materialsJson.data)) {
					setMaterials(materialsJson.data);
				}
				if (dilutionsRes.ok && Array.isArray(dilutionsJson.data)) {
					setDilutions(dilutionsJson.data as Dilution[]);
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
		return stats
			.map((s) => {
				const { material_name, percentage } = resolveDilutionMeta(
					s.dilution_id,
					dilutions,
					materials,
				);
				return {
					dilution_id: s.dilution_id,
					material_name,
					percentage,
					attempts: s.attempts,
					success_percentage: s.success_percentage,
				};
			})
			.sort((a, b) => {
				if (a.success_percentage !== b.success_percentage) {
					return a.success_percentage - b.success_percentage;
				}
				const nameCmp = a.material_name.localeCompare(b.material_name);
				if (nameCmp !== 0) return nameCmp;
				return a.percentage - b.percentage;
			});
	}, [stats, dilutions, materials]);

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
