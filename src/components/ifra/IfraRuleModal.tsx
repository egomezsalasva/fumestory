import type { IfraStatus } from "@/curation/materials/types";
import type { IfraMaterialRules } from "@/utils/ifra/lookup";

const statusTitles: Record<IfraStatus, string> = {
	prohibition: "IFRA Prohibition",
	restriction: "IFRA Restriction",
	specification: "IFRA Specification",
};

type IfraRuleModalProps = {
	status: IfraStatus;
	entries: IfraMaterialRules[];
	onClose: () => void;
};

export function IfraRuleModal({
	status,
	entries,
	onClose,
}: IfraRuleModalProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<div
				className="relative flex w-full max-w-lg max-h-[80vh] flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="ifra-rule-modal-title"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-700 px-5 py-4">
					<h2
						id="ifra-rule-modal-title"
						className="pr-2 text-lg font-medium text-slate-100"
					>
						{statusTitles[status]}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xl leading-none text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100"
					>
						×
					</button>
				</div>

				<div className="space-y-4 overflow-y-auto px-5 py-4">
					{entries.map(({ material, rules }) => (
						<div key={material.canonicalName} className="space-y-3">
							<div className="space-y-3 rounded border border-slate-700 bg-slate-900/40 p-4">
								<div>
									<p className="text-sm font-medium text-slate-100">
										{material.canonicalName}
									</p>
									{material.cas?.length ? (
										<p className="text-xs text-slate-400">
											CAS: {material.cas.join(", ")}
										</p>
									) : null}
								</div>

								{rules.map((rule, index) => (
									<div key={index} className="space-y-2">
										{rule.categoryLimits?.["4"] != null && (
											<p className="text-sm text-slate-200">
												Category 4 limit: {rule.categoryLimits["4"]}%
											</p>
										)}

										{rule.notes?.map((note) => (
											<p key={note} className="text-sm text-slate-300">
												{note}
											</p>
										))}
									</div>
								))}
							</div>

							{material.regulatory?.ifra?.pdfUrl && (
								<div className="flex justify-center">
									<a
										href={material.regulatory.ifra.pdfUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-700"
									>
										View IFRA standard (PDF)
									</a>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
