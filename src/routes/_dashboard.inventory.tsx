import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ModuleRegistry,
	ValueFormatterParams,
} from "ag-grid-community";
import { RawMaterial } from "./api.raw-materials";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/_dashboard/inventory")({
	component: App,
});

function App() {
	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

	useEffect(() => {
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				setRawMaterials(data.data as RawMaterial[]);
			})
			.catch((err) => console.error("Raw materials error:", err));
	}, []);

	const columnDefs = [
		// {
		// 	field: "id",
		// 	headerName: "ID",
		// 	width: 80,
		// },
		{
			field: "label",
			headerName: "Label",
			width: 110,
		},
		{ field: "material_nature", headerName: "Material Nature", width: 160 },
		{ field: "name", headerName: "Name", width: 240 },
		{
			field: "category_name",
			headerName: "Category",
			width: 140,
			valueFormatter: (params: ValueFormatterParams<string>) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		},
		{ field: "note_type", headerName: "Note Type", width: 140 },
		{
			field: "aggregated_note_counts",
			headerName: "Notes (* = from friend feedback only)",
			flex: 1,
			wrapText: true,
			autoHeight: true,
			cellClass: "notes-cell",
			filter: "agTextColumnFilter",
			valueGetter: (p: any) => {
				const m = p.data?.aggregated_note_counts as
					| Record<string, number>
					| undefined;
				return m ? Object.keys(m).join(", ") : "";
			},
			cellRenderer: (p: any) => {
				const noteCounts = (p.data?.aggregated_note_counts ?? {}) as Record<
					string,
					number
				>;
				const originalNotes = p.data?.notes as string[] | undefined;
				const entries = Object.entries(noteCounts);
				if (entries.length === 0)
					return <span className="text-slate-500">—</span>;

				const max = Math.max(...entries.map(([, c]) => c));
				const color = (c: number) => {
					if (max === 1) return "rgb(255, 255, 255)";
					const t = (c - 1) / (max - 1);
					const r = Math.round(255 - (255 - 34) * t);
					const g = Math.round(255 - (255 - 197) * t);
					const b = Math.round(255 - (255 - 94) * t);
					return `rgb(${r}, ${g}, ${b})`;
				};
				const isFeedbackOnly = (n: string) =>
					!originalNotes || !originalNotes.includes(n);

				return (
					<div className="flex flex-wrap gap-2 py-2">
						{entries
							.sort(([, a], [, b]) => b - a)
							.map(([note, count]) => (
								<span
									key={note}
									className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs text-white bg-transparent"
									style={{
										borderWidth: "1px",
										borderStyle: "solid",
										borderColor: color(count),
									}}
								>
									{note}
									{isFeedbackOnly(note) && "*"}
									{count > 1 && <span className="font-semibold">×{count}</span>}
								</span>
							))}
					</div>
				);
			},
		},
		{
			field: "available_dilutions",
			headerName: "Available Dilutions (%)",
			width: 230,
			cellRenderer: (params: any) => {
				const percentages = params.value as number[] | undefined;
				const hasPercentages = percentages && percentages.length > 0;
				const material = params.data as RawMaterial;

				return (
					<div className="flex items-center justify-between h-full gap-2 pr-2">
						<span className="flex-1">
							{hasPercentages
								? percentages.map((v: number) => `${v}%`).join(", ")
								: "—"}
						</span>
						<Link
							to="/manage-dilutions/$materialId"
							params={{ materialId: String(material.id) }}
							className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm border border-blue-500/30"
						>
							👁️
						</Link>
					</div>
				);
			},
		},
		// { field: "created_at", headerName: "Created At", width: 180 },
	];

	return (
		<DashboardLayout
			title="Raw Materials Inventory"
			plusButton={{ to: "/add-raw-material" }}
		>
			<div
				className="ag-theme-quartz-dark"
				style={{ height: "100%", width: "100%", minHeight: "680px" }}
			>
				<AgGridReact
					rowData={rawMaterials}
					columnDefs={columnDefs as ColDef<RawMaterial>[]}
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
		</DashboardLayout>
	);
}
