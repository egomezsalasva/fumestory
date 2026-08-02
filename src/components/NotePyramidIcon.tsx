type NoteBand = "top" | "mid" | "base";

function bandFromNoteType(
	noteType: string | null | undefined,
): NoteBand | null {
	if (noteType === "High") return "top";
	if (noteType === "Mid(Heart)") return "mid";
	if (noteType === "Base") return "base";
	return null;
}

type Props = {
	noteType: string | null | undefined;
	className?: string;
};

/** Compact fragrance pyramid; one lit band for High / Mid(Heart) / Base. */
export function NotePyramidIcon({ noteType, className }: Props) {
	const active = bandFromNoteType(noteType);

	const fill = (band: NoteBand) => {
		if (active === band) return "rgb(226 232 240 / 0.66)";
		return "rgb(30 41 59)";
	};

	return (
		<svg
			viewBox="0 0 32 32"
			width="24"
			height="24"
			className={className}
			aria-label={
				active === "top"
					? "Top note"
					: active === "mid"
						? "Heart note"
						: active === "base"
							? "Base note"
							: "Unknown note type"
			}
			role="img"
		>
			{/* Outer triangle guide */}
			<path
				d="M16 3 L29 29 H3 Z"
				fill="none"
				stroke="rgb(71 85 105)"
				strokeWidth="1"
			/>
			{/* Top */}
			<path d="M16 3 L21.5 12 H10.5 Z" fill={fill("top")} />
			{/* Mid */}
			<path d="M10.5 12 H21.5 L25.5 20.5 H6.5 Z" fill={fill("mid")} />
			{/* Base */}
			<path d="M6.5 20.5 H25.5 L29 29 H3 Z" fill={fill("base")} />
			{/* Dividers */}
			<path
				d="M10.5 12 H21.5 M6.5 20.5 H25.5"
				fill="none"
				stroke="rgb(71 85 105)"
				strokeWidth="1"
			/>
		</svg>
	);
}
