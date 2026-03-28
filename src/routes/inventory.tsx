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
import {
	SignedIn,
	RedirectToSignIn,
} from "@neondatabase/neon-js/auth/react/ui";

ModuleRegistry.registerModules([AllCommunityModule]);

export const Route = createFileRoute("/inventory")({ component: App });

function App() {
	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

	useEffect(() => {
		fetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched raw materials:", data.data);
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
			width: 80,
		},
		{ field: "name", headerName: "Name", width: 240 },
		{
			field: "category_name",
			headerName: "Category",
			width: 100,
			valueFormatter: (params: ValueFormatterParams<string>) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		},
		{ field: "note_type", headerName: "Note Type", width: 120 },
		{
			field: "aggregated_note_counts",
			headerName: "Notes (* = from friend feedback only)",
			flex: 1,
			wrapText: true,
			autoHeight: true,
			cellClass: "notes-cell",
			cellRenderer: (params: any) => {
				const noteCounts = params.value as Record<string, number> | undefined;
				const originalNotes = params.data.notes as string[] | undefined;

				if (!noteCounts || Object.keys(noteCounts).length === 0) {
					return <span className="text-slate-500">—</span>;
				}

				const entries = Object.entries(noteCounts);
				const maxCount = Math.max(...entries.map(([, count]) => count));

				const getBorderColor = (count: number) => {
					if (maxCount === 1) return "rgb(255, 255, 255)";

					const percentage = (count - 1) / (maxCount - 1);

					const r = Math.round(255 - (255 - 34) * percentage);
					const g = Math.round(255 - (255 - 197) * percentage);
					const b = Math.round(255 - (255 - 94) * percentage);

					return `rgb(${r}, ${g}, ${b})`;
				};

				// Check if note is from feedback only (not in original notes)
				const isFeedbackOnly = (noteName: string) => {
					return !originalNotes || !originalNotes.includes(noteName);
				};

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
										borderColor: getBorderColor(count),
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
			width: 190,
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
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-8xl mx-auto">
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
