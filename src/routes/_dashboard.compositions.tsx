import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ICellRendererParams,
	ModuleRegistry,
} from "ag-grid-community";
import type { Composition, CompositionStatus } from "@/routes/api.compositions";
import { authedFetch } from "@/utils/authed-fetch";
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/_dashboard/compositions")({
	...requireNavRoute("/compositions"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Compositions" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: Compositions,
});

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

const statusTabClass = (active: boolean) =>
	active
		? "text-white font-medium"
		: "text-white/45 hover:text-white/75 transition-colors";

function Compositions() {
	const [status, setStatus] = useState<CompositionStatus>("active");
	const [compositions, setCompositions] = useState<Composition[]>([]);
	const [showCompositionsLabelColumn, setShowCompositionsLabelColumn] =
		useState<boolean | null>(null);

	const loadUserSettings = useCallback(() => {
		authedFetch("/api/user-settings")
			.then((res) => res.json())
			.then((json: { data?: UserSettingsEffective }) => {
				if (json.data) {
					setShowCompositionsLabelColumn(json.data.compositions_columns.label);
				} else {
					setShowCompositionsLabelColumn(false);
				}
			})
			.catch(() => {
				setShowCompositionsLabelColumn(false);
			});
	}, []);

	const loadCompositions = useCallback((nextStatus: CompositionStatus) => {
		authedFetch(`/api/compositions?status=${nextStatus}`)
			.then((res) => res.json())
			.then((data) => {
				setCompositions((data.data as Composition[]) ?? []);
			})
			.catch((err) => console.error("Compositions error:", err));
	}, []);

	useEffect(() => {
		loadUserSettings();
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		return () => {
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		};
	}, [loadUserSettings]);

	useEffect(() => {
		loadCompositions(status);
	}, [status, loadCompositions]);

	const columnDefs = useMemo(() => {
		const labelCol: ColDef<Composition> = {
			field: "label",
			headerName: "Label",
			width: 88,
			valueFormatter: (params) => params.value ?? "—",
		};

		const nameCol: ColDef<Composition> = {
			field: "name",
			headerName: "Name",
			flex: 1,
		};

		const typeCol: ColDef<Composition> = {
			field: "type",
			headerName: "Type",
			flex: 1,
			valueFormatter: (params) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		};

		const detailsCol: ColDef<Composition> = {
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
		};

		const cols: ColDef<Composition>[] = [];
		if (showCompositionsLabelColumn !== false) cols.push(labelCol);
		cols.push(nameCol, typeCol, detailsCol);
		return cols;
	}, [showCompositionsLabelColumn]);

	const title = (
		<span className="inline-flex items-center gap-1.5">
			<span>Compositions</span>
			<span className="text-white/45">/</span>
			<button
				type="button"
				className={`${statusTabClass(status === "active")} cursor-pointer bg-transparent border-0 p-0 font-[inherit] text-[inherit] leading-[inherit]`}
				onClick={() => setStatus("active")}
			>
				Active
			</button>
			<span className="text-white/45" aria-hidden="true">
				·
			</span>
			<button
				type="button"
				className={`${statusTabClass(status === "archived")} cursor-pointer bg-transparent border-0 p-0 font-[inherit] text-[inherit] leading-[inherit]`}
				onClick={() => setStatus("archived")}
			>
				Archived
			</button>
		</span>
	);

	return (
		<>
			<style>{gridStyles}</style>
			<DashboardLayout
				title={title}
				plusButton={{ to: "/add-composition" }}
				showCogButton={true}
				cogButtonHash="compositions-settings"
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
