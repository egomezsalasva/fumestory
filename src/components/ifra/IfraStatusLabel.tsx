import type { IfraStatus } from "@/curation/materials/types";

const statusConfig: Record<IfraStatus, { label: string; className: string }> = {
	prohibition: {
		label: "Prohibition",
		className: "text-red-400 border-red-400/50 bg-red-400/10",
	},
	restriction: {
		label: "Restriction",
		className: "text-orange-400 border-orange-400/50 bg-orange-400/10",
	},
	specification: {
		label: "Specification",
		className: "text-blue-400 border-blue-400/50 bg-blue-400/10",
	},
};

type IfraStatusLabelProps = {
	status: IfraStatus;
};

export function IfraStatusLabel({ status }: IfraStatusLabelProps) {
	const { label, className } = statusConfig[status];

	return (
		<span
			className={`inline-flex items-center px-2 py-1 rounded text-sm border ${className}`}
		>
			{label}
		</span>
	);
}
