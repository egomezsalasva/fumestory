import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ColDef,
	ICellRendererParams,
	ModuleRegistry,
} from "ag-grid-community";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { NotePyramidIcon } from "@/components/NotePyramidIcon";
import {
	aggregateNoteTypeByCount,
	aggregateNoteTypePercents,
	NotePyramidOverview,
} from "@/components/NotePyramidOverview";
import {
	aggregateFamilyByCount,
	aggregateFamilyPercents,
	FamilyPieOverview,
} from "@/components/FamilyPieOverview";
import styles from "@/components/Form.module.css";
import { toTitleCaseWords } from "@/utils/display-names";

ModuleRegistry.registerModules([AllCommunityModule]);

const COMMENT_MAX_LENGTH = 2000;

const COMMENT_ACTION_BTN =
	"inline-flex shrink-0 items-center justify-center whitespace-nowrap px-2.5 py-1 rounded-[0.25rem] bg-[#0b172d] text-white font-medium border border-[#d8e3f0] shadow-sm shadow-black/40 hover:bg-[#243044] hover:border-[#f0f4fa] transition-colors text-xs disabled:cursor-not-allowed disabled:opacity-40";

const OVERVIEW_MIX_STORAGE_KEY = "fumestory.overviewMixMode";

type OverviewMixMode = "formula" | "materials";

export const Route = createFileRoute("/_dashboard/composition/$compositionId")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Composition Details" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: CompositionDetail,
});

type FormulaLine = {
	dilution_id: number;
	material_label: string | null;
	material_name: string;
	note_type: string | null;
	category_name: string | null;
	percentage: number;
	weight_grams: number;
};

type FormulaRow = {
	id: number;
	composition_id: number;
	mods: string;
	created_at: string;
	comment: string | null;
	lines?: FormulaLine[];
};

type ApiResponse = {
	success: boolean;
	data: {
		composition: {
			id: number;
			name: string;
			type: string;
			created_at: string;
		};
		formulas: FormulaRow[];
	};
};

const NOTE_TYPE_SORT_ORDER: Record<string, number> = {
	High: 0,
	"Mid(Heart)": 1,
	Base: 2,
};

function formatWeightGrams(v: number): string {
	if (!Number.isFinite(v)) return "";
	return Number(v.toFixed(4)).toString();
}

function normalizeComment(value: string): string | null {
	const trimmed = value.trim();
	return trimmed === "" ? null : trimmed;
}

function OverviewMixTabs({
	mode,
	onChange,
}: {
	mode: OverviewMixMode;
	onChange: (mode: OverviewMixMode) => void;
}) {
	const tabClass = (active: boolean) =>
		[
			"rounded-[0.2rem] px-2.5 py-1 text-xs font-medium transition-colors",
			active
				? "bg-[#243044] text-white border border-[#f0f4fa]/40"
				: "text-slate-400 hover:text-slate-200 border border-transparent",
		].join(" ");

	return (
		<div
			className="inline-flex items-center gap-0.5 rounded-[0.25rem] border border-[#d8e3f0]/25 bg-[#0b172d] p-0.5"
			role="tablist"
			aria-label="Overview mix mode"
		>
			<button
				type="button"
				role="tab"
				aria-selected={mode === "formula"}
				className={tabClass(mode === "formula")}
				onClick={() => onChange("formula")}
			>
				Formula
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={mode === "materials"}
				className={tabClass(mode === "materials")}
				onClick={() => onChange("materials")}
			>
				Materials
			</button>
		</div>
	);
}

function FormulaCommentCard({
	compositionId,
	formulaId,
	initialComment,
	onSaved,
}: {
	compositionId: string;
	formulaId: number;
	initialComment: string | null;
	onSaved: (comment: string | null) => void;
}) {
	const [value, setValue] = useState(initialComment ?? "");
	const [editing, setEditing] = useState(false);
	const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
		"idle",
	);
	const [error, setError] = useState<string | null>(null);
	const lastSavedRef = useRef(normalizeComment(initialComment ?? ""));
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const next = initialComment ?? "";
		setValue(next);
		lastSavedRef.current = normalizeComment(next);
		setEditing(false);
		setStatus("idle");
		setError(null);
	}, [formulaId, initialComment]);

	useEffect(() => {
		if (!editing) return;
		const el = textareaRef.current;
		if (!el) return;
		el.focus();
		const len = el.value.length;
		el.setSelectionRange(len, len);
	}, [editing]);

	const save = async () => {
		const next = normalizeComment(value);
		if (next === lastSavedRef.current) {
			setEditing(false);
			setStatus("idle");
			return;
		}

		setStatus("saving");
		setError(null);
		try {
			const res = await authedFetch(`/api/compositions/${compositionId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ formula_id: formulaId, comment: next }),
			});
			const text = await res.text();
			let json: unknown;
			try {
				json = JSON.parse(text) as
					| { success: true; data: { comment: string | null } }
					| { error?: string };
			} catch {
				throw new Error(
					res.ok
						? "Unexpected response from server"
						: `Save failed (${res.status})`,
				);
			}
			if (!res.ok) {
				const errMsg =
					typeof json === "object" &&
					json &&
					"error" in json &&
					typeof (json as { error?: unknown }).error === "string"
						? (json as { error: string }).error
						: res.statusText;
				throw new Error(errMsg);
			}
			const saved =
				typeof json === "object" &&
				json &&
				"data" in json &&
				(json as { data?: { comment?: string | null } }).data
					? ((json as { data: { comment: string | null } }).data.comment ??
						next)
					: next;
			lastSavedRef.current = saved;
			setValue(saved ?? "");
			onSaved(saved);
			setStatus("saved");
			setEditing(false);
		} catch (e: unknown) {
			setStatus("error");
			setError(e instanceof Error ? e.message : "Failed to save");
		}
	};

	const cancelEdit = () => {
		setValue(lastSavedRef.current ?? "");
		setEditing(false);
		setStatus("idle");
		setError(null);
	};

	const hasComment = Boolean(normalizeComment(lastSavedRef.current ?? ""));
	const dirty = normalizeComment(value) !== lastSavedRef.current;

	return (
		<div className="flex h-full min-h-[10rem] flex-col rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 md:col-span-5">
			<div className="mb-3 flex items-center justify-between gap-2">
				<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
					Comment
				</p>
				{!editing ? (
					<button
						type="button"
						onClick={() => setEditing(true)}
						className={COMMENT_ACTION_BTN}
					>
						{hasComment ? "Edit" : "Add comment"}
					</button>
				) : (
					<div className="flex items-center gap-2">
						<span className="text-[11px] tabular-nums text-slate-500">
							{value.length}/{COMMENT_MAX_LENGTH}
						</span>
						<button
							type="button"
							onClick={() => {
								void save();
							}}
							disabled={status === "saving" || !dirty}
							title="Save comment"
							aria-label="Save comment"
							className={`${COMMENT_ACTION_BTN} h-[26px] w-[26px] !px-0`}
						>
							✓
						</button>
						<button
							type="button"
							onClick={cancelEdit}
							disabled={status === "saving"}
							title="Cancel"
							aria-label="Cancel"
							className={`${COMMENT_ACTION_BTN} h-[26px] w-[26px] !px-0`}
						>
							×
						</button>
					</div>
				)}
			</div>

			{editing ? (
				<textarea
					ref={textareaRef}
					value={value}
					maxLength={COMMENT_MAX_LENGTH}
					onChange={(e) => {
						setValue(e.target.value);
						if (status === "saved" || status === "error") setStatus("idle");
					}}
					placeholder="What to change on the next mod…"
					rows={6}
					className="min-h-0 w-full flex-1 resize-y rounded-md border border-slate-600 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
				/>
			) : (
				<div className="min-h-[8rem] flex-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
					{hasComment ? (
						lastSavedRef.current
					) : (
						<span className="text-slate-500">
							What to change on the next mod…
						</span>
					)}
				</div>
			)}

			<p className="mt-2 min-h-[1rem] text-[11px] text-slate-500">
				{status === "saving" && "Saving…"}
				{status === "saved" && "Saved"}
				{status === "error" && (
					<span className="text-red-400">{error ?? "Failed to save"}</span>
				)}
			</p>
		</div>
	);
}

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
	.nested-grid .ag-floating-bottom {
		border-top: 1px solid rgb(71 85 105 / 0.5);
	}
	.nested-grid .ag-row-pinned {
		font-weight: 600;
		background-color: rgb(30 41 59 / 0.2) !important;
	}
	.nested-grid .ag-row-pinned .ag-cell {
		color: rgb(203 213 225);
		border-bottom: 1px solid rgb(71 85 105 / 0.5) !important;
	}
`;

function CompositionDetail() {
	const { compositionId } = Route.useParams();
	const [payload, setPayload] = useState<ApiResponse["data"] | null>(null);
	const [err, setErr] = useState<string | null>(null);
	const [overviewMode, setOverviewMode] = useState<OverviewMixMode>("formula");
	const [overviewModeReady, setOverviewModeReady] = useState(false);

	useEffect(() => {
		const stored = window.localStorage.getItem(OVERVIEW_MIX_STORAGE_KEY);
		if (stored === "formula" || stored === "materials") {
			setOverviewMode(stored);
		}
		setOverviewModeReady(true);
	}, []);

	useEffect(() => {
		if (!overviewModeReady) return;
		window.localStorage.setItem(OVERVIEW_MIX_STORAGE_KEY, overviewMode);
	}, [overviewMode, overviewModeReady]);

	const columnDefs = useMemo<ColDef<FormulaLine>[]>(
		() => [
			{
				field: "material_name",
				headerName: "Material",
				flex: 1,
				minWidth: 220,
				colSpan: (params) => (params.node?.rowPinned ? 4 : 1),
			},
			{
				field: "note_type",
				headerName: "Note",
				width: 60,
				sortable: true,
				comparator: (
					a: string | null | undefined,
					b: string | null | undefined,
				) => {
					const av =
						a != null && a in NOTE_TYPE_SORT_ORDER
							? NOTE_TYPE_SORT_ORDER[a]
							: 99;
					const bv =
						b != null && b in NOTE_TYPE_SORT_ORDER
							? NOTE_TYPE_SORT_ORDER[b]
							: 99;
					return av - bv;
				},
				cellRenderer: (params: ICellRendererParams<FormulaLine>) => {
					if (params.node?.rowPinned) return null;
					return (
						<div className="flex h-full items-center justify-center">
							<NotePyramidIcon noteType={params.value} />
						</div>
					);
				},
			},
			{
				field: "category_name",
				headerName: "Family",
				width: 80,
				valueFormatter: (params) => {
					if (params.node?.rowPinned) return "";
					return params.value ? toTitleCaseWords(params.value) : "—";
				},
			},
			{
				field: "percentage",
				headerName: "Formula %",
				width: 130,
				sort: "desc",
				cellRenderer: (params: ICellRendererParams<FormulaLine>) => {
					if (params.node?.rowPinned) return null;
					const pct = typeof params.value === "number" ? params.value : 0;
					const fill = Math.max(0, Math.min(100, pct));

					return (
						<div className="flex h-full w-full items-center gap-3">
							<span className="w-9 shrink-0 tabular-nums">
								{Number.isInteger(pct) ? pct : pct.toFixed(2)}
							</span>
							<div
								className="h-4 min-w-0 flex-1 overflow-hidden border border-slate-500 bg-slate-800"
								aria-hidden="true"
							>
								<div
									className="h-full bg-slate-300"
									style={{ width: `${fill}%` }}
								/>
							</div>
						</div>
					);
				},
			},
			{
				field: "weight_grams",
				headerName: "Weight (g)",
				width: 90,
				valueFormatter: (params) => {
					const v = params.value;
					if (typeof v !== "number") return "";
					return formatWeightGrams(v);
				},
			},
		],
		[],
	);

	useEffect(() => {
		let cancelled = false;
		setErr(null);
		authedFetch(`/api/compositions/${compositionId}`)
			.then(async (res) => {
				const json = (await res.json()) as ApiResponse | { error?: string };
				if (!res.ok) {
					throw new Error(
						"error" in json && json.error ? json.error : res.statusText,
					);
				}
				if ("data" in json && json.data && !cancelled) setPayload(json.data);
			})
			.catch((e: unknown) => {
				if (!cancelled)
					setErr(e instanceof Error ? e.message : "Failed to load");
			});
		return () => {
			cancelled = true;
		};
	}, [compositionId]);

	const handleCommentSaved = (formulaId: number, comment: string | null) => {
		setPayload((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				formulas: prev.formulas.map((f) =>
					f.id === formulaId ? { ...f, comment } : f,
				),
			};
		});
	};

	return (
		<>
			<style>{gridStyles}</style>
			<DashboardLayout
				title="Compositions / Composition Details"
				backButton={{ to: "/compositions" }}
			>
				{err && <p className="mt-4 text-red-400">{err}</p>}
				{!payload && !err && <p className="mt-4 text-slate-400">Loading…</p>}
				{payload && (
					<div className="mx-auto max-w-5xl">
						<div className="mt-4 flex items-start justify-between gap-4">
							<div className="min-w-0 flex-1">
								<h1 className="break-words text-2xl font-bold">
									{payload.composition.name}
								</h1>
								<p className="capitalize text-slate-400">
									{payload.composition.type}
								</p>
							</div>
							<Link
								to="/add-formula/$compositionId"
								params={{ compositionId: String(compositionId) }}
								className={styles.formSubmitButton}
							>
								Add Formula
							</Link>
						</div>

						{payload.formulas.length === 0 ? (
							<p className="mt-6 text-slate-400">No formulas yet.</p>
						) : (
							[...payload.formulas]
								.sort((a, b) => b.id - a.id)
								.map((f) => {
									const lines = f.lines ?? [];
									const totalWeight = lines.reduce(
										(sum, l) => sum + (l.weight_grams || 0),
										0,
									);
									const noteTotals =
										overviewMode === "materials"
											? aggregateNoteTypeByCount(lines)
											: aggregateNoteTypePercents(lines);
									const familySlices =
										overviewMode === "materials"
											? aggregateFamilyByCount(lines)
											: aggregateFamilyPercents(lines);
									const pinnedBottomRowData: FormulaLine[] = [
										{
											dilution_id: -1,
											material_label: null,
											material_name: "Total",
											note_type: null,
											category_name: null,
											percentage: 0,
											weight_grams: totalWeight,
										},
									];
									return (
										<section key={f.id} className="mt-8">
											<h2 className="mb-3 text-lg font-semibold text-white">
												Formula (Mod) #{f.mods}
											</h2>
											{lines.length === 0 ? (
												<p className="text-sm text-slate-400">
													No ingredient lines.
												</p>
											) : (
												<>
													<div
														className="nested-grid ag-theme-quartz-dark"
														style={{ height: "auto", width: "100%" }}
													>
														<AgGridReact<FormulaLine>
															rowData={lines}
															pinnedBottomRowData={pinnedBottomRowData}
															columnDefs={columnDefs}
															getRowId={(p) =>
																p.data?.material_name === "Total"
																	? `${f.id}-total`
																	: `${f.id}-${String(p.data?.dilution_id)}`
															}
															domLayout="autoHeight"
															theme="legacy"
														/>
													</div>
													<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
														<div className="flex flex-col rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3 md:col-span-7">
															<div className="mb-3 flex items-center justify-between gap-2">
																<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
																	Overview
																</p>
																<OverviewMixTabs
																	mode={overviewMode}
																	onChange={setOverviewMode}
																/>
															</div>
															<div className="flex flex-1 flex-wrap items-center justify-center gap-12">
																<NotePyramidOverview totals={noteTotals} />
																<FamilyPieOverview slices={familySlices} />
															</div>
														</div>
														<FormulaCommentCard
															compositionId={String(compositionId)}
															formulaId={f.id}
															initialComment={f.comment}
															onSaved={(comment) =>
																handleCommentSaved(f.id, comment)
															}
														/>
													</div>
												</>
											)}
										</section>
									);
								})
						)}
					</div>
				)}
			</DashboardLayout>
		</>
	);
}
