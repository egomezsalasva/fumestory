import { useState } from "react";

export type NoteTypeTotals = {
	top: number;
	mid: number;
	base: number;
};

type BandKey = keyof NoteTypeTotals;

type LineLike = {
	note_type: string | null;
	percentage: number;
};

const BANDS = [
	{ key: "top" as const, label: "Top", rgb: "125 211 252", y0: 8, y1: 62 },
	{ key: "mid" as const, label: "Heart", rgb: "167 139 250", y0: 62, y1: 118 },
	{ key: "base" as const, label: "Base", rgb: "252 211 77", y0: 118, y1: 172 },
];

const PYRAMID = {
	apexX: 100,
	apexY: 8,
	baseLeftX: 12,
	baseRightX: 188,
	baseY: 172,
};

export function aggregateNoteTypePercents(lines: LineLike[]): NoteTypeTotals {
	const totals: NoteTypeTotals = { top: 0, mid: 0, base: 0 };
	for (const line of lines) {
		const pct = Number(line.percentage) || 0;
		if (line.note_type === "High") totals.top += pct;
		else if (line.note_type === "Mid(Heart)") totals.mid += pct;
		else if (line.note_type === "Base") totals.base += pct;
	}
	return totals;
}

/** Materials mode: share of ingredient lines per note type (count / total lines). */
export function aggregateNoteTypeByCount(lines: LineLike[]): NoteTypeTotals {
	const n = lines.length;
	if (n === 0) return { top: 0, mid: 0, base: 0 };
	let top = 0;
	let mid = 0;
	let base = 0;
	for (const line of lines) {
		if (line.note_type === "High") top += 1;
		else if (line.note_type === "Mid(Heart)") mid += 1;
		else if (line.note_type === "Base") base += 1;
	}
	return {
		top: (top / n) * 100,
		mid: (mid / n) * 100,
		base: (base / n) * 100,
	};
}

function formatBandPct(pct: number): string {
	if (!Number.isFinite(pct) || pct <= 0) return "0%";
	return `${Number(pct.toFixed(1))}%`;
}

function edgesAtY(y: number): { left: number; right: number } {
	const t = (y - PYRAMID.apexY) / (PYRAMID.baseY - PYRAMID.apexY);
	return {
		left: PYRAMID.apexX + t * (PYRAMID.baseLeftX - PYRAMID.apexX),
		right: PYRAMID.apexX + t * (PYRAMID.baseRightX - PYRAMID.apexX),
	};
}

/** Full band outline (empty container). */
function bandOutlinePath(y0: number, y1: number): string {
	const top = edgesAtY(y0);
	const bot = edgesAtY(y1);
	if (Math.abs(top.left - top.right) < 0.01) {
		return `M${PYRAMID.apexX} ${y0} L${bot.right} ${y1} L${bot.left} ${y1} Z`;
	}
	return `M${top.left} ${y0} L${top.right} ${y0} L${bot.right} ${y1} L${bot.left} ${y1} Z`;
}

/** Fill rising from the bottom of the band; 100% = full band height. */
function bandFillPath(y0: number, y1: number, pct: number): string | null {
	const f = Math.max(0, Math.min(1, pct / 100));
	if (f <= 0) return null;
	const yFill = y1 - f * (y1 - y0);
	const top = edgesAtY(yFill);
	const bot = edgesAtY(y1);
	return `M${top.left} ${yFill} L${top.right} ${yFill} L${bot.right} ${y1} L${bot.left} ${y1} Z`;
}

type Props = {
	totals: NoteTypeTotals;
	className?: string;
};

/** Overview pyramid: Top / Mid / Base share, with legend on the right. */
export function NotePyramidOverview({ totals, className }: Props) {
	const { top, mid, base } = totals;
	const values = { top, mid, base };
	const [hovered, setHovered] = useState<BandKey | null>(null);

	return (
		<div className={`flex items-center gap-4 ${className ?? ""}`}>
			<svg
				viewBox="0 0 200 180"
				width="120"
				height="108"
				role="img"
				aria-label={`Top ${formatBandPct(top)}, heart ${formatBandPct(mid)}, base ${formatBandPct(base)}`}
			>
				{BANDS.map((band) => {
					const fillD = bandFillPath(band.y0, band.y1, values[band.key]);
					const color = `rgb(${band.rgb})`;
					const fillOpacity =
						hovered === null ? 0.5 : hovered === band.key ? 1 : 0.5;
					return (
						<g
							key={band.key}
							onMouseEnter={() => setHovered(band.key)}
							onMouseLeave={() => setHovered(null)}
							className="cursor-pointer"
						>
							<path
								d={bandOutlinePath(band.y0, band.y1)}
								fill="rgb(30 41 59)"
								stroke={color}
								strokeOpacity={0.5}
								strokeWidth="1.5"
							/>
							{fillD && <path d={fillD} fill={color} opacity={fillOpacity} />}
						</g>
					);
				})}
			</svg>
			<ul className="space-y-0.5 text-xs leading-tight text-slate-300">
				{BANDS.map((band) => {
					const legendOpacity =
						hovered === null || hovered === band.key ? 1 : 0.35;
					return (
						<li
							key={band.key}
							className="flex items-center gap-1.5 transition-opacity"
							style={{ opacity: legendOpacity }}
						>
							<span
								className="inline-block h-2 w-2 shrink-0 rounded-sm"
								style={{ backgroundColor: `rgb(${band.rgb})` }}
							/>
							<span className="min-w-0 truncate">{band.label}</span>
							<span className="tabular-nums text-slate-400">
								{formatBandPct(values[band.key])}
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
