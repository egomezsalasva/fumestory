export const CURATED_CATEGORY_COLORS: Record<string, string> = {
	animalic: "#8b4513",
	musk: "#a78b9a",
	leather: "#6b3a2a",
	smoky: "#5c5c5c",
	woody: "#8b6914",
	earthy: "#6b5b3a",
	amber: "#FFC107",
	"resinous / balsamic": "#9a6b2f",
	spices: "#c45c26",
	floral: "#d4849a",
	green: "#4a8f5c",
	herbal: "#5f8f6a",
	citrus: "#e8c84a",
	fruity: "#e07a5f",
	aldehydic: "#b8c4d4",
	"marine / ozonic": "#4a90a4",
	gourmand: "#c47a5a",
	sulfurous: "#a3a34a",
};

export const NEUTRAL_CATEGORY_COLOR = "#94a3b8";

export function resolveCategoryColor(
	name: string,
	overrides?: Record<string, string>,
): string {
	const key = name.trim().toLowerCase();
	return (
		overrides?.[key] ?? CURATED_CATEGORY_COLORS[key] ?? NEUTRAL_CATEGORY_COLOR
	);
}

export function hexToRgba(hex: string, alpha: number): string {
	const h = hex.replace("#", "").trim();
	const full =
		h.length === 3
			? h
					.split("")
					.map((c) => c + c)
					.join("")
			: h;
	const n = Number.parseInt(full, 16);
	if (!Number.isFinite(n) || full.length !== 6) {
		return `rgba(148, 163, 184, ${alpha})`;
	}
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
