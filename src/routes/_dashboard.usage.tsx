import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { PaygRedeemForm } from "@/components/PaygRedeemForm";
import {
	PaygRedeemModal,
	type PaygCapacityKind,
} from "@/components/PaygRedeemModal";
import { getOfflineUsage, type OfflineUsage } from "@/offline/db";
import { isOffline } from "@/runtime";

export const Route = createFileRoute("/_dashboard/usage")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Usage" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: UsagePage,
});

const USAGE_ROWS: {
	key: keyof OfflineUsage;
	label: string;
	kind: PaygCapacityKind;
}[] = [
	{ key: "materials", label: "Raw materials", kind: "materials" },
	{ key: "dilutions", label: "Dilutions", kind: "dilutions" },
	{ key: "compositions", label: "Compositions", kind: "compositions" },
	{ key: "mods", label: "Formula mods", kind: "mods" },
];

function UsagePage() {
	const offline = isOffline();
	const [usage, setUsage] = useState<OfflineUsage | null>(null);
	const [usageError, setUsageError] = useState<string | null>(null);
	const [buyKind, setBuyKind] = useState<PaygCapacityKind | null>(null);

	const refreshUsage = useCallback(async () => {
		if (!offline) return;
		try {
			setUsageError(null);
			setUsage(await getOfflineUsage());
		} catch (e) {
			setUsageError(e instanceof Error ? e.message : "Failed to load usage");
		}
	}, [offline]);

	useEffect(() => {
		void refreshUsage();
	}, [refreshUsage]);

	return (
		<DashboardLayout title="Usage">
			<div className="w-full max-w-170 mx-auto space-y-6">
				{!offline ? (
					<div className="rounded-lg border border-slate-700 bg-slate-800 p-6 text-sm text-slate-300">
						Capacity packs and usage limits apply to the offline desktop app.
					</div>
				) : (
					<>
						<div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
							<h2 className="mb-4 text-lg font-medium text-white">Usage</h2>
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
							<h2 className="mb-4 text-lg font-medium text-white">
								Redeem a code
							</h2>
							<PaygRedeemForm
								onRedeemed={() => {
									void refreshUsage();
								}}
							/>
						</div>
					</>
				)}
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
