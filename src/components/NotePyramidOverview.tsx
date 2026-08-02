export type NoteTypeTotals = {
	top: number;
	mid: number;
	base: number;
};

type LineLike = {
	note_type: string | null;
	percentage: number;
};

const BANDS = [
	{ key: "top" as const, label: "Top", rgb: "125 211 252" },
	{ key: "mid" as const, label: "Heart", rgb: "167 139 250" },
	{ key: "base" as const, label: "Base", rgb: "252 211 77" },
];

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

function formatBandPct(pct: number): string {
	if (!Number.isFinite(pct) || pct <= 0) return "0%";
	return `${Number(pct.toFixed(1))}%`;
}

function bandFill(rgb: string, pct: number): string {
	const opacity = Math.max(0, Math.min(1, pct / 100));
	return `rgb(${rgb} / ${opacity})`;
}

type Props = {
	totals: NoteTypeTotals;
	className?: string;
};

/** Overview pyramid: Top / Mid / Base share, with legend on the right. */
export function NotePyramidOverview({ totals, className }: Props) {
	const { top, mid, base } = totals;
	const values = { top, mid, base };

	return (
		<div className={`flex items-center gap-4 ${className ?? ""}`}>
			<svg
				viewBox="0 0 200 180"
				width="120"
				height="108"
				role="img"
				aria-label={`Top ${formatBandPct(top)}, heart ${formatBandPct(mid)}, base ${formatBandPct(base)}`}
			>
				<path
					d="M100 8 L188 172 H12 Z"
					fill="none"
					stroke="rgb(71 85 105)"
					strokeWidth="1.5"
				/>
				<path d="M100 8 L130 62 H70 Z" fill={bandFill(BANDS[0].rgb, top)} />
				<path
					d="M70 62 H130 L159 118 H41 Z"
					fill={bandFill(BANDS[1].rgb, mid)}
				/>
				<path
					d="M41 118 H159 L188 172 H12 Z"
					fill={bandFill(BANDS[2].rgb, base)}
				/>
				<path
					d="M70 62 H130 M41 118 H159"
					fill="none"
					stroke="rgb(71 85 105)"
					strokeWidth="1.5"
				/>
			</svg>
			<ul className="space-y-0.5 text-xs leading-tight text-slate-300">
				{BANDS.map((band) => (
					<li key={band.key} className="flex items-center gap-1.5">
						<span
							className="inline-block h-2 w-2 shrink-0 rounded-sm"
							style={{ backgroundColor: `rgb(${band.rgb})` }}
						/>
						<span className="min-w-0 truncate">{band.label}</span>
						<span className="tabular-nums text-slate-400">
							{formatBandPct(values[band.key])}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
