type WhiteSpinnerProps = {
	size?: number;
	className?: string;
};

export default function WhiteSpinner({
	size = 12,
	className,
}: WhiteSpinnerProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={["animate-spin", className].filter(Boolean).join(" ")}
		>
			<circle
				cx="12"
				cy="12"
				r="9"
				stroke="white"
				strokeOpacity="0.25"
				strokeWidth="3"
			/>
			<path
				d="M21 12a9 9 0 0 0-9-9"
				stroke="white"
				strokeWidth="3"
				strokeLinecap="round"
			/>
		</svg>
	);
}
