import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

type InventoryNotesDisplay = "with_guest_feedback" | "without_guest_feedback";

export const Route = createFileRoute("/_dashboard/inventory")({
	component: App,
});

function App() {
	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
	const [guestFeedbackEnabled, setGuestFeedbackEnabled] = useState<
		boolean | null
	>(null);
	const [guestFeedbackAggregateNote, setGuestFeedbackAggregateNote] = useState<
		boolean | null
	>(null);
	const [showInventoryLabelColumn, setShowInventoryLabelColumn] = useState<
		boolean | null
	>(null);
	const [
		showInventoryMaterialNatureColumn,
		setShowInventoryMaterialNatureColumn,
	] = useState<boolean | null>(null);
	const [showInventoryCategoryNameColumn, setShowInventoryCategoryNameColumn] =
		useState<boolean | null>(null);
	const [showInventoryNoteTypeColumn, setShowInventoryNoteTypeColumn] =
		useState<boolean | null>(null);
	const [showInventoryNotesDisplayColumn, setShowInventoryNotesDisplayColumn] =
		useState<boolean | null>(null);
	const [
		showInventoryAvailableDilutionsColumn,
		setShowInventoryAvailableDilutionsColumn,
	] = useState<boolean | null>(null);

	const notesDisplay: InventoryNotesDisplay =
		guestFeedbackEnabled === true
			? "with_guest_feedback"
			: "without_guest_feedback";
	const includeGuestFeedbackInNotes =
		notesDisplay === "with_guest_feedback" &&
		guestFeedbackAggregateNote !== false;

	const loadUserSettings = useCallback(() => {
		authedFetch("/api/user-settings")
			.then((res) => res.json())
			.then((json: { data?: UserSettingsEffective }) => {
				if (json.data) {
					setGuestFeedbackEnabled(json.data.guest_feedback_enabled);
					setGuestFeedbackAggregateNote(
						json.data.guest_feedback_aggregate_note,
					);
					setShowInventoryLabelColumn(json.data.inventory_columns.label);
					setShowInventoryMaterialNatureColumn(
						json.data.inventory_columns.material_nature,
					);
					setShowInventoryCategoryNameColumn(
						json.data.inventory_columns.category_name,
					);
					setShowInventoryNoteTypeColumn(json.data.inventory_columns.note_type);
					setShowInventoryNotesDisplayColumn(
						json.data.inventory_columns.notes_display,
					);
					setShowInventoryAvailableDilutionsColumn(
						json.data.inventory_columns.available_dilutions,
					);
				} else {
					setGuestFeedbackEnabled(false);
					setGuestFeedbackAggregateNote(true);
					setShowInventoryLabelColumn(true);
					setShowInventoryMaterialNatureColumn(true);
					setShowInventoryCategoryNameColumn(true);
					setShowInventoryNoteTypeColumn(true);
					setShowInventoryNotesDisplayColumn(true);
					setShowInventoryAvailableDilutionsColumn(true);
				}
			})
			.catch(() => {
				setGuestFeedbackEnabled(false);
				setGuestFeedbackAggregateNote(true);
				setShowInventoryLabelColumn(true);
				setShowInventoryMaterialNatureColumn(true);
				setShowInventoryCategoryNameColumn(true);
				setShowInventoryNoteTypeColumn(true);
				setShowInventoryNotesDisplayColumn(true);
				setShowInventoryAvailableDilutionsColumn(true);
			});
	}, []);

	useEffect(() => {
		loadUserSettings();
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		return () => {
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		};
	}, [loadUserSettings]);

	useEffect(() => {
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				setRawMaterials(data.data as RawMaterial[]);
			})
			.catch((err) => console.error("Raw materials error:", err));
	}, []);

	const columnDefs = useMemo(() => {
		const labelCol: ColDef<RawMaterial> = {
			field: "label",
			headerName: "Label",
			width: 110,
		};

		const materialNatureCol: ColDef<RawMaterial> = {
			field: "material_nature",
			headerName: "Material Nature",
			width: 160,
		};

		const categoryNameCol: ColDef<RawMaterial> = {
			field: "category_name",
			headerName: "Category",
			width: 140,
			valueFormatter: (params: ValueFormatterParams<RawMaterial, string>) =>
				params.value
					? params.value.charAt(0).toUpperCase() + params.value.slice(1)
					: "",
		};

		const noteTypeCol: ColDef<RawMaterial> = {
			field: "note_type",
			headerName: "Note Type",
			width: 140,
		};

		const nameCol: ColDef<RawMaterial> = {
			field: "name",
			headerName: "Name",
			...(showInventoryNotesDisplayColumn === false
				? { flex: 1, minWidth: 200 }
				: { width: 240 }),
		};

		const notesDisplayCol: ColDef<RawMaterial> = {
			colId: "notes_display",
			field: includeGuestFeedbackInNotes ? "aggregated_note_counts" : "notes",
			headerName: includeGuestFeedbackInNotes
				? "Notes (* = from friend feedback only)"
				: "Notes",
			flex: 1,
			wrapText: true,
			autoHeight: true,
			cellClass: "notes-cell",
			filter: "agTextColumnFilter",
			valueGetter: (p: { data?: RawMaterial }) => {
				if (!includeGuestFeedbackInNotes) {
					const list = p.data?.notes ?? [];
					return list.length ? list.join(", ") : "";
				}
				const m = p.data?.aggregated_note_counts;
				return m && Object.keys(m).length ? Object.keys(m).join(", ") : "";
			},
			cellRenderer: (p: { data?: RawMaterial }) => {
				if (!includeGuestFeedbackInNotes) {
					const list = [...(p.data?.notes ?? [])].sort((a, b) =>
						a.localeCompare(b),
					);
					if (list.length === 0)
						return <span className="text-slate-500">—</span>;
					return (
						<div className="flex flex-wrap gap-2 py-2">
							{list.map((note) => (
								<span
									key={note}
									className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs text-white bg-transparent border border-white/40"
								>
									{note}
								</span>
							))}
						</div>
					);
				}

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
		};

		const dilutionsCol: ColDef<RawMaterial> = {
			field: "available_dilutions",
			headerName: "Available Dilutions (%)",
			width: 230,
			cellRenderer: (params: { value?: number[]; data?: RawMaterial }) => {
				const percentages = params.value;
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
		};

		const cols: ColDef<RawMaterial>[] = [];
		if (showInventoryLabelColumn !== false) cols.push(labelCol);
		if (showInventoryMaterialNatureColumn !== false)
			cols.push(materialNatureCol);
		if (showInventoryCategoryNameColumn !== false) cols.push(categoryNameCol);
		if (showInventoryNoteTypeColumn !== false) cols.push(noteTypeCol);
		cols.push(nameCol);
		if (showInventoryNotesDisplayColumn !== false) cols.push(notesDisplayCol);
		if (showInventoryAvailableDilutionsColumn !== false)
			cols.push(dilutionsCol);
		return cols as ColDef<RawMaterial>[];
	}, [
		includeGuestFeedbackInNotes,
		guestFeedbackAggregateNote,
		showInventoryLabelColumn,
		showInventoryMaterialNatureColumn,
		showInventoryCategoryNameColumn,
		showInventoryNoteTypeColumn,
		showInventoryNotesDisplayColumn,
		showInventoryAvailableDilutionsColumn,
	]);

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
		</DashboardLayout>
	);
}
