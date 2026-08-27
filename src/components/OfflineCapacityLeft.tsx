import { useState } from "react";
import {
	PaygRedeemModal,
	type PaygCapacityKind,
} from "@/components/PaygRedeemModal";

type OfflineCapacityLeftProps = {
	kind: PaygCapacityKind;
	left: number | null;
	onRedeemed?: () => void;
};

export function OfflineCapacityLeft({
	kind,
	left,
	onRedeemed,
}: OfflineCapacityLeftProps) {
	const [open, setOpen] = useState(false);

	if (left == null) return null;

	return (
		<>
			<span className="inline-flex items-center gap-2">
				<span className="text-sm text-slate-400 tabular-nums font-normal">
					{left} left
				</span>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="rounded border border-slate-600 px-1.5 py-0.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 hover:text-slate-100"
					aria-label="Buy credits"
				>
					Buy Credits
				</button>
			</span>
			{open ? (
				<PaygRedeemModal
					kind={kind}
					onClose={() => setOpen(false)}
					onRedeemed={() => {
						onRedeemed?.();
					}}
				/>
			) : null}
		</>
	);
}
