import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ICellRendererParams,
	ModuleRegistry,
} from "ag-grid-community";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/_dashboard/compositions")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Compositions" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: Compositions,
});

type Composition = {
	id: number;
	name: string;
	type: "trial" | "accord" | "perfume";
	created_at: string;
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

function Compositions() {
	const [compositions, setCompositions] = useState<Composition[]>([]);

	useEffect(() => {
		authedFetch("/api/compositions")
			.then((res) => res.json())
			.then((data) => {
				setCompositions(data.data as Composition[]);
			})
			.catch((err) => console.error("Compositions error:", err));
	}, []);

	const columnDefs: ColDef<Composition>[] = [
		{ field: "name", headerName: "Name", flex: 1 },
		{
			field: "type",
			headerName: "Type",
			flex: 1,
			valueFormatter: (params) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		},
		{
			headerName: "",
			width: 140,
			sortable: false,
			filter: false,
			cellStyle: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
			cellRenderer: (params: ICellRendererParams<Composition>) => {
				const id = params.data?.id;
				if (!id) return null;
				return (
					<Link
						to="/composition/$compositionId"
						params={{ compositionId: String(id) }}
						className="inline-flex shrink-0 items-center justify-center whitespace-nowrap px-2.5 py-1 rounded-[0.25rem] bg-[#0b172d] text-white font-medium border border-[#d8e3f0] shadow-sm shadow-black/40 hover:bg-[#243044] hover:border-[#f0f4fa] transition-colors text-xs"
					>
						Details
					</Link>
				);
			},
		},
	];

	return (
		<>
			<style>{gridStyles}</style>
			<DashboardLayout
				title="Compositions"
				plusButton={{ to: "/add-composition" }}
			>
				<div
					className="ag-theme-quartz-dark"
					style={{ height: "100%", width: "100%", minHeight: "680px" }}
				>
					<AgGridReact
						rowData={compositions}
						columnDefs={columnDefs}
						pagination={true}
						paginationPageSize={20}
						theme="legacy"
					/>
				</div>
			</DashboardLayout>
		</>
	);
}
