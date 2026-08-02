import { toTitleCaseWords } from "@/utils/display-names";

export type FamilySlice = {
	name: string;
	percentage: number;
};

type LineLike = {
	category_name: string | null;
	percentage: number;
};

const SLICE_COLORS = [
	"rgb(148 163 184)",
	"rgb(125 211 252)",
	"rgb(167 139 250)",
	"rgb(252 211 77)",
	"rgb(110 231 183)",
	"rgb(251 146 60)",
	"rgb(244 114 182)",
	"rgb(94 234 212)",
];

export function aggregateFamilyPercents(lines: LineLike[]): FamilySlice[] {
	const byName = new Map<string, number>();
	for (const line of lines) {
		const key = line.category_name?.trim() || "Unknown";
		const pct = Number(line.percentage) || 0;
		byName.set(key, (byName.get(key) ?? 0) + pct);
	}
	return [...byName.entries()]
		.map(([name, percentage]) => ({ name, percentage }))
		.filter((s) => s.percentage > 0)
		.sort((a, b) => b.percentage - a.percentage);
}

function formatPct(pct: number): string {
	if (!Number.isFinite(pct) || pct <= 0) return "0%";
	return `${Number(pct.toFixed(1))}%`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
	const rad = ((angleDeg - 90) * Math.PI) / 180;
	return {
		x: cx + r * Math.cos(rad),
		y: cy + r * Math.sin(rad),
	};
}

function describeSlice(
	cx: number,
	cy: number,
	r: number,
	startAngle: number,
	endAngle: number,
): string {
	const start = polarToCartesian(cx, cy, r, endAngle);
	const end = polarToCartesian(cx, cy, r, startAngle);
	const largeArc = endAngle - startAngle > 180 ? 1 : 0;
	return [
		`M ${cx} ${cy}`,
		`L ${start.x} ${start.y}`,
		`A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
		"Z",
	].join(" ");
}

type Props = {
	slices: FamilySlice[];
	className?: string;
};

/** Pie of formula % by olfactory family (primary category). */
export function FamilyPieOverview({ slices, className }: Props) {
	const cx = 60;
	const cy = 60;
	const r = 52;
	let angle = 0;

	const paths =
		slices.length === 0
			? []
			: slices.map((slice, i) => {
					const sweep = (slice.percentage / 100) * 360;
					const start = angle;
					const end = angle + sweep;
					angle = end;
					if (slices.length === 1 && slice.percentage >= 99.9) {
						return {
							...slice,
							d: `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`,
							color: SLICE_COLORS[i % SLICE_COLORS.length],
						};
					}
					return {
						...slice,
						d: describeSlice(cx, cy, r, start, end),
						color: SLICE_COLORS[i % SLICE_COLORS.length],
					};
				});

	return (
		<div className={`flex items-center gap-4 ${className ?? ""}`}>
			<svg
				viewBox="0 0 120 120"
				width="120"
				height="120"
				role="img"
				aria-label="Olfactory family distribution"
			>
				{paths.length === 0 ? (
					<circle
						cx={cx}
						cy={cy}
						r={r}
						fill="rgb(30 41 59)"
						stroke="rgb(71 85 105)"
					/>
				) : (
					paths.map((p) => (
						<path
							key={p.name}
							d={p.d}
							fill={p.color}
							stroke="rgb(15 23 42)"
							strokeWidth="1"
							opacity={0.5}
						/>
					))
				)}
			</svg>
			<ul className="space-y-0.5 text-xs leading-tight text-slate-300">
				{slices.map((s, i) => (
					<li key={s.name} className="flex items-center gap-1.5">
						<span
							className="inline-block h-2 w-2 shrink-0 rounded-sm"
							style={{
								backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length],
							}}
						/>
						<span className="min-w-0 truncate">{toTitleCaseWords(s.name)}</span>
						<span className="tabular-nums text-slate-400">
							{formatPct(s.percentage)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
