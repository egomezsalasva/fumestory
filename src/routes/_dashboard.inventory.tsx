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
	type CategoryColorsJson,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import CopyIcon from "@/components/dashboard-layout/svgs/CopyIcon";
import CheckIcon from "@/components/svgs/CheckIcon";
import { toTitleCaseWords } from "@/utils/display-names";
import {
	hexToRgba,
	resolveCategoryColor,
} from "@/utils/curated-category-colors";
import { buildInventoryMarkdown } from "@/utils/inventory-markdown";

ModuleRegistry.registerModules([AllCommunityModule]);

type InventoryNotesDisplay = "with_guest_feedback" | "without_guest_feedback";

export const Route = createFileRoute("/_dashboard/inventory")({
	...requireNavRoute("/inventory"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Inventory" },
			{ name: "robots", content: "noindex" },
		],
	}),
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
	const [
		hideRawMaterialsWithoutAvailableDilutions,
		setHideRawMaterialsWithoutAvailableDilutions,
	] = useState<boolean | null>(null);
	const [showInventoryLabelColumn, setShowInventoryLabelColumn] = useState<
		boolean | null
	>(null);
	const [showInventoryCasNumberColumn, setShowInventoryCasNumberColumn] =
		useState<boolean | null>(null);
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
	const [categoryColors, setCategoryColors] = useState<CategoryColorsJson>({});
	const [copied, setCopied] = useState(false);

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
					setHideRawMaterialsWithoutAvailableDilutions(
						json.data.hide_raw_materials_without_available_dilutions,
					);
					setShowInventoryLabelColumn(json.data.inventory_columns.label);
					setShowInventoryCasNumberColumn(
						json.data.inventory_columns.cas_number,
					);
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
					setCategoryColors(json.data.category_colors ?? {});
				} else {
					setGuestFeedbackEnabled(false);
					setGuestFeedbackAggregateNote(true);
					setHideRawMaterialsWithoutAvailableDilutions(false);
					setShowInventoryLabelColumn(false);
					setShowInventoryCasNumberColumn(false);
					setShowInventoryMaterialNatureColumn(false);
					setShowInventoryCategoryNameColumn(true);
					setShowInventoryNoteTypeColumn(true);
					setShowInventoryNotesDisplayColumn(true);
					setShowInventoryAvailableDilutionsColumn(true);
					setCategoryColors({});
				}
			})
			.catch(() => {
				setGuestFeedbackEnabled(false);
				setGuestFeedbackAggregateNote(true);
				setHideRawMaterialsWithoutAvailableDilutions(false);
				setShowInventoryLabelColumn(false);
				setShowInventoryCasNumberColumn(false);
				setShowInventoryMaterialNatureColumn(false);
				setShowInventoryCategoryNameColumn(true);
				setShowInventoryNoteTypeColumn(true);
				setShowInventoryNotesDisplayColumn(true);
				setShowInventoryAvailableDilutionsColumn(true);
				setCategoryColors({});
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

	const inventoryRowData = useMemo(() => {
		if (hideRawMaterialsWithoutAvailableDilutions !== true) return rawMaterials;
		return rawMaterials.filter(
			(m) =>
				Array.isArray(m.available_dilutions) &&
				m.available_dilutions.length > 0,
		);
	}, [rawMaterials, hideRawMaterialsWithoutAvailableDilutions]);

	const handleCopyMarkdown = useCallback(async () => {
		const md = buildInventoryMarkdown(inventoryRowData, {
			showCas: showInventoryCasNumberColumn !== false,
			showMaterialNature: showInventoryMaterialNatureColumn !== false,
			showNoteType: showInventoryNoteTypeColumn !== false,
			showCategory: showInventoryCategoryNameColumn !== false,
			showNotes: showInventoryNotesDisplayColumn !== false,
			showDilutions: showInventoryAvailableDilutionsColumn !== false,
			includeGuestFeedbackInNotes,
		});
		try {
			await navigator.clipboard.writeText(md);
			setCopied(true);
		} catch (err) {
			console.error("Copy failed:", err);
		}
	}, [
		inventoryRowData,
		showInventoryCasNumberColumn,
		showInventoryMaterialNatureColumn,
		showInventoryNoteTypeColumn,
		showInventoryCategoryNameColumn,
		showInventoryNotesDisplayColumn,
		showInventoryAvailableDilutionsColumn,
		includeGuestFeedbackInNotes,
	]);

	const columnDefs = useMemo(() => {
		const labelCol: ColDef<RawMaterial> = {
			field: "label",
			headerName: "Label",
			width: 88,
			valueFormatter: (
				params: ValueFormatterParams<RawMaterial, string | null>,
			) => params.value ?? "—",
		};

		const casNumberCol: ColDef<RawMaterial> = {
			field: "cas_number",
			headerName: "CAS",
			width: 120,
			valueFormatter: (
				params: ValueFormatterParams<RawMaterial, string | null>,
			) => params.value ?? "—",
		};

		const materialNatureCol: ColDef<RawMaterial> = {
			field: "material_nature",
			headerName: "Material Nature",
			width: 136,
			valueFormatter: (
				params: ValueFormatterParams<RawMaterial, string | null>,
			) => params.value ?? "—",
		};

		const categoryNameCol: ColDef<RawMaterial> = {
			field: "category_name",
			headerName: "Category",
			width: 140,
			filter: "agTextColumnFilter",
			valueFormatter: (params: ValueFormatterParams<RawMaterial, string>) =>
				params.value ? toTitleCaseWords(params.value) : "—",
			cellStyle: (params) => {
				const raw = params.data?.category_name?.trim();
				if (!raw) return undefined;
				const color = resolveCategoryColor(raw, categoryColors);
				return {
					backgroundColor: hexToRgba(color, 0.2),
				};
			},
		};
		const noteTypeCol: ColDef<RawMaterial> = {
			field: "note_type",
			headerName: "Note Type",
			width: 104,
		};

		const nameCol: ColDef<RawMaterial> = {
			field: "name",
			headerName: "Name",
			flex: 1,
			minWidth: 100,
		};

		const notesDisplayCol: ColDef<RawMaterial> = {
			colId: "notes_display",
			field: includeGuestFeedbackInNotes ? "aggregated_note_counts" : "notes",
			headerName: "Notes",
			width: 160,
			autoHeight: true,
			filter: "agTextColumnFilter",
			valueGetter: (p: { data?: RawMaterial }) => {
				if (!includeGuestFeedbackInNotes) {
					const list = p.data?.notes ?? [];
					return list.length ? list.map(toTitleCaseWords).join(", ") : "";
				}
				const m = p.data?.aggregated_note_counts;
				return m && Object.keys(m).length
					? Object.keys(m).map(toTitleCaseWords).join(", ")
					: "";
			},
			cellRenderer: (p: { data?: RawMaterial }) => {
				const noteColors = p.data?.note_colors ?? {};

				const renderNoteRow = (
					note: string,
					count?: number,
					showDot = true,
				) => {
					const dotStyle = showDot ? (noteColors[note] ?? null) : null;
					return (
						<div key={note} className="encyclopedia-note-item">
							{dotStyle ? (
								<span
									className="encyclopedia-note-dot"
									style={{ background: dotStyle }}
									aria-hidden="true"
								/>
							) : null}
							<span>
								{toTitleCaseWords(note)}
								{count != null && count > 1 ? (
									<span className="font-semibold"> [x{count}]</span>
								) : null}
							</span>
						</div>
					);
				};

				if (!includeGuestFeedbackInNotes) {
					const list = [...(p.data?.notes ?? [])].sort((a, b) =>
						a.localeCompare(b),
					);
					if (list.length === 0)
						return <span className="text-slate-500">—</span>;
					return (
						<div className="encyclopedia-list-cell">
							{list.map((note) => renderNoteRow(note))}
						</div>
					);
				}

				const noteCounts = (p.data?.aggregated_note_counts ?? {}) as Record<
					string,
					number
				>;
				const originalNotes = [...(p.data?.notes ?? [])].sort((a, b) => {
					const ca = Number(noteCounts[a] ?? 1);
					const cb = Number(noteCounts[b] ?? 1);
					return cb - ca || a.localeCompare(b);
				});
				const originLower = new Set(originalNotes.map((n) => n.toLowerCase()));

				const guestEntries = Object.entries(noteCounts)
					.filter(([note]) => !originLower.has(note.toLowerCase()))
					.sort(
						([nameA, a], [nameB, b]) =>
							Number(b) - Number(a) || nameA.localeCompare(nameB),
					);

				if (originalNotes.length === 0 && guestEntries.length === 0) {
					return <span className="text-slate-500">—</span>;
				}

				return (
					<div className="encyclopedia-list-cell">
						{originalNotes.map((note) =>
							renderNoteRow(note, noteCounts[note] ?? 1),
						)}
						{guestEntries.length > 0 ? (
							<>
								<div className="mt-1.5 mb-[0.125rem] text-[0.65rem] font-medium uppercase tracking-wide text-slate-400">
									Guest Feedback
								</div>
								{guestEntries.map(([note, count]) =>
									renderNoteRow(note, count, false),
								)}
							</>
						) : null}
					</div>
				);
			},
		};

		const dilutionsCol: ColDef<RawMaterial> = {
			field: "available_dilutions",
			headerName: "Available Dilutions (%)",
			width: 170,
			valueFormatter: (params) => {
				const percentages = params.value as number[] | undefined;
				if (!percentages || percentages.length === 0) return "—";
				return percentages.map((v) => `${v}%`).join(", ");
			},
		};

		const detailsCol: ColDef<RawMaterial> = {
			headerName: "",
			colId: "details",
			width: 100,
			sortable: false,
			filter: false,
			cellRenderer: (params: { data?: RawMaterial }) => {
				const material = params.data;
				if (!material) return null;
				return (
					<div className="flex items-center h-full w-full justify-center">
						<Link
							to="/raw-material-details/$materialId"
							params={{ materialId: String(material.id) }}
							className="inline-flex shrink-0 items-center justify-center whitespace-nowrap px-2.5 py-1 rounded-[0.25rem] bg-[#0b172d] text-white font-medium border border-[#d8e3f0] shadow-sm shadow-black/40 hover:bg-[#243044] hover:border-[#f0f4fa] transition-colors text-xs"
						>
							Details
						</Link>
					</div>
				);
			},
		};

		const cols: ColDef<RawMaterial>[] = [];
		if (showInventoryLabelColumn !== false) cols.push(labelCol);
		cols.push(nameCol);
		if (showInventoryCasNumberColumn !== false) cols.push(casNumberCol);
		if (showInventoryMaterialNatureColumn !== false)
			cols.push(materialNatureCol);
		if (showInventoryNoteTypeColumn !== false) cols.push(noteTypeCol);
		if (showInventoryCategoryNameColumn !== false) cols.push(categoryNameCol);
		if (showInventoryNotesDisplayColumn !== false) cols.push(notesDisplayCol);
		if (showInventoryAvailableDilutionsColumn !== false)
			cols.push(dilutionsCol);
		cols.push(detailsCol);
		return cols as ColDef<RawMaterial>[];
	}, [
		includeGuestFeedbackInNotes,
		guestFeedbackAggregateNote,
		categoryColors,
		showInventoryLabelColumn,
		showInventoryCasNumberColumn,
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
			showCogButton={true}
			cogButtonHash="raw-materials-settings"
			headerActions={
				<button
					type="button"
					className="cursor-pointer"
					title={copied ? "Copied" : "Copy table as Markdown"}
					aria-label={copied ? "Copied" : "Copy table as Markdown"}
					onClick={() => {
						void handleCopyMarkdown();
					}}
				>
					{copied ? <CheckIcon /> : <CopyIcon />}
				</button>
			}
		>
			<div
				className="ag-theme-quartz-dark"
				style={{ height: "100%", width: "100%", minHeight: "680px" }}
			>
				<AgGridReact
					rowData={inventoryRowData}
					columnDefs={columnDefs}
					defaultColDef={{
						filter: true,
						sortable: true,
						resizable: true,
					}}
					enableCellTextSelection={true}
					ensureDomOrder={true}
					suppressCellFocus={true}
					pagination={true}
					paginationPageSize={200}
					paginationPageSizeSelector={[50, 100, 200, 500]}
					theme="legacy"
				/>
			</div>
		</DashboardLayout>
	);
}
