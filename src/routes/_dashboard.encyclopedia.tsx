import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ICellRendererParams,
	ModuleRegistry,
	ValueFormatterParams,
} from "ag-grid-community";
import { curatedMaterialsData } from "@/curation/materials/data/data";
import type { MaterialRecord } from "@/curation/materials/types";
import { getNoteDotStyle } from "@/components/academy/utils/note-dot-styles";
import { toTitleCaseWords } from "@/utils/display-names";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

ModuleRegistry.registerModules([AllCommunityModule]);

const OTHER_NAMES_SCROLL_THRESHOLD = 10;
const LIST_LINE_PX = 17; // ~1.4 line-height at 0.75rem
const LIST_PADDING_PX = 24; // 0.75rem top + bottom

export const Route = createFileRoute("/_dashboard/encyclopedia")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Materials Encyclopedia" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: MaterialsEncyclopedia,
});

type EncyclopediaRow = {
	canonicalName: string;
	otherNames: string[];
	cas: string[];
	sources: string[];
	notes: string[];
};

function normalizeNote(note: string): string {
	return note.trim().toLowerCase().replace(/\s+/g, " ");
}

function sortByShortestFirst(items: string[]): string[] {
	return [...items].sort((a, b) => a.length - b.length || a.localeCompare(b));
}

function listLineCount(items: string[]): number {
	return items.length === 0 ? 1 : items.length;
}

function getRowContentLines(row: EncyclopediaRow): number {
	const otherNamesLines =
		row.otherNames.length > OTHER_NAMES_SCROLL_THRESHOLD
			? OTHER_NAMES_SCROLL_THRESHOLD
			: listLineCount(row.otherNames);

	return Math.max(
		1,
		otherNamesLines,
		listLineCount(row.cas),
		listLineCount(row.sources),
		listLineCount(row.notes),
	);
}

function getRowHeightPx(row: EncyclopediaRow): number {
	return getRowContentLines(row) * LIST_LINE_PX + LIST_PADDING_PX;
}

function ListCell({ items }: { items: string[] }) {
	if (items.length === 0) {
		return <span className="text-slate-500">—</span>;
	}

	return (
		<div className="encyclopedia-list-cell">
			{items.map((item) => (
				<div key={item} className="encyclopedia-list-item">
					{item}
				</div>
			))}
		</div>
	);
}

function OtherNamesCell({ items }: { items: string[] }) {
	if (items.length === 0) {
		return <span className="text-slate-500">—</span>;
	}

	const scrollable = items.length > OTHER_NAMES_SCROLL_THRESHOLD;

	const content = (
		<div className="encyclopedia-list-cell">
			{items.map((item) => (
				<div key={item} className="encyclopedia-list-item">
					{item}
				</div>
			))}
		</div>
	);

	if (!scrollable) {
		return content;
	}

	return <div className="encyclopedia-other-names-scroll">{content}</div>;
}

function NotesListCell({ items }: { items: string[] }) {
	if (items.length === 0) {
		return <span className="text-slate-500">—</span>;
	}

	return (
		<div className="encyclopedia-list-cell">
			{items.map((note) => {
				const dotStyle = getNoteDotStyle(note);

				return (
					<div key={note} className="encyclopedia-note-item">
						{dotStyle ? (
							<span
								className="encyclopedia-note-dot"
								style={{ background: dotStyle }}
								aria-hidden="true"
							/>
						) : null}
						<span>{toTitleCaseWords(note)}</span>
					</div>
				);
			})}
		</div>
	);
}

function listCellRenderer(
	params: ICellRendererParams<EncyclopediaRow, string[]>,
) {
	return <ListCell items={params.value ?? []} />;
}

function otherNamesCellRenderer(
	params: ICellRendererParams<EncyclopediaRow, string[]>,
) {
	return <OtherNamesCell items={params.value ?? []} />;
}

function notesCellRenderer(
	params: ICellRendererParams<EncyclopediaRow, string[]>,
) {
	return <NotesListCell items={params.value ?? []} />;
}

function formatListForFilter(
	params: ValueFormatterParams<EncyclopediaRow, string[]>,
): string {
	return params.value && params.value.length > 0
		? params.value.join("\n")
		: "—";
}

function getMaterialSources(
	sources: MaterialRecord["sources"] | undefined,
): string[] {
	return [...new Set((sources ?? []).map((source) => source.sourceName))].sort(
		(a, b) => a.localeCompare(b),
	);
}

function getMaterialNotes(
	sources: MaterialRecord["sources"] | undefined,
): string[] {
	const seen = new Set<string>();
	const notes: string[] = [];

	for (const source of sources ?? []) {
		for (const note of source.data?.notes ?? []) {
			const trimmed = String(note).trim();
			const key = normalizeNote(trimmed);
			if (!key || seen.has(key)) continue;
			seen.add(key);
			notes.push(trimmed);
		}
	}

	return notes.sort((a, b) => a.localeCompare(b));
}

function MaterialsEncyclopedia() {
	const rowData = useMemo((): EncyclopediaRow[] => {
		return [...curatedMaterialsData.materials]
			.sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
			.map((material) => ({
				canonicalName: material.canonicalName,
				otherNames: sortByShortestFirst(material.otherNames ?? []),
				cas: material.cas ?? [],
				sources: getMaterialSources(material.sources),
				notes: getMaterialNotes(material.sources),
			}));
	}, []);

	const columnDefs: ColDef<EncyclopediaRow>[] = [
		{
			field: "canonicalName",
			headerName: "Name",
			flex: 1,
			minWidth: 200,
		},
		{
			field: "otherNames",
			headerName: "Other Names",
			flex: 1,
			minWidth: 200,
			cellClass: "encyclopedia-other-names-cell",
			cellRenderer: otherNamesCellRenderer,
			valueFormatter: formatListForFilter,
		},
		{
			field: "cas",
			headerName: "CAS",
			width: 130,
			cellRenderer: listCellRenderer,
			valueFormatter: formatListForFilter,
		},
		{
			field: "sources",
			headerName: "Sources",
			width: 110,
			cellRenderer: listCellRenderer,
			valueFormatter: formatListForFilter,
		},
		{
			field: "notes",
			headerName: "Notes",
			flex: 1,
			minWidth: 200,
			cellRenderer: notesCellRenderer,
			valueFormatter: formatListForFilter,
		},
	];

	return (
		<DashboardLayout title="Encyclopedia">
			<div
				className="ag-theme-quartz-dark"
				style={{ height: "100%", width: "100%", minHeight: "680px" }}
			>
				<AgGridReact<EncyclopediaRow>
					rowData={rowData}
					columnDefs={columnDefs}
					getRowHeight={(params) =>
						params.data
							? getRowHeightPx(params.data)
							: LIST_LINE_PX + LIST_PADDING_PX
					}
					defaultColDef={{
						filter: true,
						sortable: true,
						resizable: true,
					}}
					pagination={true}
					paginationPageSize={100}
					paginationPageSizeSelector={[50, 100, 200, 500]}
					theme="legacy"
				/>
			</div>
		</DashboardLayout>
	);
}
