import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ModuleRegistry,
	ValueFormatterParams,
} from "ag-grid-community";
import { RawMaterial } from "./api.raw-materials";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/")({ component: App });

function App() {
	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

	useEffect(() => {
		fetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => setRawMaterials(data.data as RawMaterial[]))
			.catch((err) => console.error("Raw materials error:", err));
	}, []);

	const columnDefs = [
		{
			field: "id",
			headerName: "ID",
			width: 80,
		},
		{ field: "name", headerName: "Name", width: 250 },
		{
			field: "category_name",
			headerName: "Category",
			width: 120,
			valueFormatter: (params: ValueFormatterParams<string>) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		},
		{ field: "note_type", headerName: "Note Type", width: 120 },
		{
			field: "notes",
			headerName: "Notes",
			flex: 1,
			valueFormatter: (params: ValueFormatterParams<string>) =>
				params.value ? params.value.join(", ") : "",
			filter: true,
		},
		{
			field: "prepared_dilution_percentages",
			headerName: "Dilutions (%)",
			width: 120,
			valueFormatter: (params: ValueFormatterParams<number[]>) =>
				params.value && params.value.length > 0
					? params.value.map((v: number) => `${v}%`).join(", ")
					: "—",
		},
		// { field: "created_at", headerName: "Created At", width: 180 },
	];

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-7">
					Raw Materials Inventory
				</h1>
				<div
					className="ag-theme-quartz-dark"
					style={{ height: "680px", width: "100%" }}
				>
					<AgGridReact
						rowData={rawMaterials}
						columnDefs={columnDefs as ColDef<RawMaterial>[]}
						pagination={true}
						paginationPageSize={20}
						theme="legacy"
					/>
				</div>
			</div>
		</div>
	);
}
