import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PaygRedeemForm } from "@/components/PaygRedeemForm";
import type { RedeemPaygCodeResult } from "@/offline/redeemPaygCode";
import { isOffline } from "@/runtime";
import { startStripeCheckout } from "@/utils/start-stripe-checkout";
import type { StripePackId } from "@/utils/stripe";

export type PaygCapacityKind =
	| "materials"
	| "dilutions"
	| "compositions"
	| "mods";

type PaygRedeemModalProps = {
	kind: PaygCapacityKind;
	onClose: () => void;
	onRedeemed?: (result: RedeemPaygCodeResult) => void;
};

const PACK_BY_KIND: Record<
	PaygCapacityKind,
	{
		title: string;
		extras: number;
		unit: string;
		price: string;
		stripePackId: StripePackId;
	}
> = {
	materials: {
		title: "1. Raw Materials Credits Pack",
		extras: 50,
		unit: "materials",
		price: "€10",
		stripePackId: "raw-materials",
	},
	dilutions: {
		title: "1. Dilutions Credits Pack",
		extras: 100,
		unit: "dilutions",
		price: "€10",
		stripePackId: "dilutions",
	},
	compositions: {
		title: "1. Compositions Credits Pack",
		extras: 50,
		unit: "compositions",
		price: "€10",
		stripePackId: "compositions",
	},
	mods: {
		title: "1. Formula Mods Credits Pack",
		extras: 100,
		unit: "mods",
		price: "€10",
		stripePackId: "formula-mods",
	},
};

export function PaygRedeemModal({
	kind,
	onClose,
	onRedeemed,
}: PaygRedeemModalProps) {
	const pack = PACK_BY_KIND[kind];
	const [buying, setBuying] = useState(false);

	const handleBuy = async () => {
		try {
			setBuying(true);
			if (isOffline()) {
				window.open(
					"https://fumestory.com/pricing",
					"_blank",
					"noopener,noreferrer",
				);
				setBuying(false);
				return;
			}
			await startStripeCheckout(pack.stripePackId);
		} catch (error) {
			console.error(error);
			setBuying(false);
			window.alert(error instanceof Error ? error.message : "Checkout failed");
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<div
				className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="payg-redeem-modal-title"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-700 px-5 py-4">
					<h2
						id="payg-redeem-modal-title"
						className="pr-2 text-lg font-medium text-slate-100"
					>
						Credits
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

				<div className="grid gap-0 sm:grid-cols-2">
					<div className="border-b border-slate-700 px-5 py-4 sm:border-b-0 sm:border-r">
						<h3 className="text-sm font-medium text-slate-100">{pack.title}</h3>
						<div className="my-2 h-px w-full bg-slate-600" />
						<p className="text-2xl font-medium tabular-nums text-white">
							{pack.price}
						</p>
						<p className="mt-2 text-sm text-slate-300">
							Adds {pack.extras} {pack.unit}
						</p>
						<div className="mt-4 flex flex-col gap-2">
							<button
								type="button"
								disabled={buying}
								onClick={() => void handleBuy()}
								className="inline-flex items-center justify-center rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
							>
								{buying ? "Redirecting…" : "Buy Pack"}
							</button>
							<Link
								to="/pricing"
								className="inline-flex items-center justify-center rounded-md border border-slate-500 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700/50"
								onClick={onClose}
							>
								View Pricing Packs
							</Link>
						</div>
					</div>

					<div className="px-5 py-4">
						<h3 className="text-sm font-medium text-slate-100">
							2. Redeem Credits
						</h3>
						<div className="my-2 h-px w-full bg-slate-600" />
						<PaygRedeemForm
							onRedeemed={(result) => {
								onRedeemed?.(result);
								onClose();
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
