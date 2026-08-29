import { useCallback, useEffect, useState } from "react";
import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { z } from "zod";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { PaygRedeemForm } from "@/components/PaygRedeemForm";
import {
	PaygRedeemModal,
	type PaygCapacityKind,
} from "@/components/PaygRedeemModal";
import { isOffline } from "@/runtime";
import { getPaygUsage, type PaygUsageSnapshot } from "@/utils/get-payg-usage";

const usageSearchSchema = z.object({
	session_id: z.string().min(1).optional(),
});

export const Route = createFileRoute("/_dashboard/usage")({
	validateSearch: usageSearchSchema,
	head: () => ({
		meta: [
			{ title: "Fumestory | Usage" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: UsagePage,
});

const USAGE_ROWS: {
	key: keyof Omit<PaygUsageSnapshot, "email">;
	label: string;
	kind: PaygCapacityKind;
}[] = [
	{ key: "materials", label: "Raw materials", kind: "materials" },
	{ key: "dilutions", label: "Dilutions", kind: "dilutions" },
	{ key: "compositions", label: "Compositions", kind: "compositions" },
	{ key: "mods", label: "Formula mods", kind: "mods" },
];

type CheckoutNotice = "success" | "pending";

async function fetchCheckoutAutoRedeemed(sessionId: string): Promise<boolean> {
	const res = await fetch(
		`/api/stripe/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
	);
	const json = (await res.json()) as {
		data?: { autoRedeemed?: boolean };
		error?: string;
	};
	if (!res.ok || !json.data) {
		throw new Error(json.error ?? "Could not verify purchase");
	}
	return Boolean(json.data.autoRedeemed);
}

function UsagePage() {
	const offline = isOffline();
	const navigate = useNavigate();
	const { session_id: sessionId } = useSearch({ from: "/_dashboard/usage" });
	const [usage, setUsage] = useState<PaygUsageSnapshot | null>(null);
	const [usageError, setUsageError] = useState<string | null>(null);
	const [buyKind, setBuyKind] = useState<PaygCapacityKind | null>(null);
	const [checkoutNotice, setCheckoutNotice] = useState<CheckoutNotice | null>(
		null,
	);

	const refreshUsage = useCallback(async () => {
		try {
			setUsageError(null);
			setUsage(await getPaygUsage());
		} catch (e) {
			setUsageError(e instanceof Error ? e.message : "Failed to load usage");
		}
	}, []);

	useEffect(() => {
		void refreshUsage();
	}, [refreshUsage]);

	useEffect(() => {
		if (!sessionId) return;

		let cancelled = false;

		void (async () => {
			const check = async () => {
				try {
					return await fetchCheckoutAutoRedeemed(sessionId);
				} catch {
					return false;
				}
			};

			await new Promise((r) => setTimeout(r, 1000));
			if (cancelled) return;

			if (await check()) {
				if (cancelled) return;
				setCheckoutNotice("success");
				void navigate({ to: "/usage", search: {}, replace: true });
				void refreshUsage();
				return;
			}

			if (cancelled) return;
			setCheckoutNotice("pending");
			void navigate({ to: "/usage", search: {}, replace: true });
			void refreshUsage();

			for (let i = 0; i < 14; i++) {
				await new Promise((r) => setTimeout(r, 1000));
				if (cancelled) return;
				if (await check()) {
					if (cancelled) return;
					setCheckoutNotice("success");
					void refreshUsage();
					return;
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [sessionId, navigate, refreshUsage]);

	return (
		<DashboardLayout title="Usage">
			<div className="w-full max-w-170 mx-auto space-y-6">
				{checkoutNotice === "success" ? (
					<div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
						Credits applied to your account.
					</div>
				) : null}
				{checkoutNotice === "pending" ? (
					<div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
						Payment received. Credits can take up to a minute. If they don't
						appear, redeem with the email and code we gave you. You should have
						this code in an email from credits@fumestory.com.
					</div>
				) : null}

				<div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
					<h2 className="mb-4 text-lg font-medium text-white">Usage</h2>
					{!offline && usage?.email ? (
						<p className="mb-4 text-sm text-slate-400">
							Account: {usage.email}
						</p>
					) : null}
					{usageError && (
						<div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
							{usageError}
						</div>
					)}
					<ul className="space-y-3">
						{USAGE_ROWS.map((row) => {
							const bucket = usage?.[row.key];
							return (
								<li
									key={row.key}
									className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-600 bg-slate-900/40 px-4 py-3"
								>
									<div>
										<p className="text-sm font-medium text-slate-100">
											{row.label}
										</p>
										<p className="text-sm tabular-nums text-slate-400">
											{bucket
												? `${bucket.used} / ${bucket.limit} · ${bucket.left} left`
												: "Loading…"}
										</p>
									</div>
									<button
										type="button"
										onClick={() => setBuyKind(row.kind)}
										className="rounded border border-slate-600 px-2.5 py-1 text-sm font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 hover:text-slate-100"
									>
										Buy Credits
									</button>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
					<h2 className="mb-4 text-lg font-medium text-white">Redeem a code</h2>
					<PaygRedeemForm
						onRedeemed={() => {
							void refreshUsage();
						}}
					/>
				</div>
			</div>

			{buyKind ? (
				<PaygRedeemModal
					kind={buyKind}
					onClose={() => setBuyKind(null)}
					onRedeemed={() => {
						void refreshUsage();
					}}
				/>
			) : null}
		</DashboardLayout>
	);
}
