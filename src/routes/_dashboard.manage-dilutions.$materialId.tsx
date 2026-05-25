import { useEffect, useState, useCallback } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Dilution } from "./api.dilutions";
import { FeedbackWithNotes } from "./api.feedback";
import { authedFetch } from "@/utils/authed-fetch";
import type { UserSettingsEffective } from "@/utils/user-settings";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

function formatBatchGrams(grams: number): string {
	return `${grams.toLocaleString(undefined, { maximumFractionDigits: 5, useGrouping: false })} g`;
}

export const Route = createFileRoute(
	"/_dashboard/manage-dilutions/$materialId",
)({
	head: () => ({
		meta: [
			{ title: "Fumestory | Manage Dilutions" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: ManageDilutions,
});

function ManageDilutions() {
	const { materialId } = useParams({
		from: "/_dashboard/manage-dilutions/$materialId",
	});
	const [dilutions, setDilutions] = useState<Dilution[]>([]);
	const [materialName, setMaterialName] = useState("");
	const [materialLabel, setMaterialLabel] = useState("");
	const [feedback, setFeedback] = useState<Record<number, FeedbackWithNotes[]>>(
		{},
	);
	const [loading, setLoading] = useState(false);
	const [guestFeedbackEnabled, setGuestFeedbackEnabled] = useState<
		boolean | null
	>(null);

	const loadGuestFeedbackSetting = useCallback(async () => {
		try {
			const res = await authedFetch("/api/user-settings");
			const json = (await res.json()) as { data?: UserSettingsEffective };
			if (res.ok && json.data) {
				setGuestFeedbackEnabled(json.data.guest_feedback_enabled);
			} else {
				setGuestFeedbackEnabled(false);
			}
		} catch {
			setGuestFeedbackEnabled(false);
		}
	}, []);

	useEffect(() => {
		void loadGuestFeedbackSetting();
	}, [loadGuestFeedbackSetting]);

	useEffect(() => {
		// Fetch all dilutions for this material
		authedFetch("/api/dilutions")
			.then((res) => res.json())
			.then((data) => {
				const allDilutions = Array.isArray(data?.data)
					? (data.data as Dilution[])
					: [];
				const filtered = allDilutions.filter(
					(d) => d.raw_material_id === Number(materialId),
				);
				setDilutions(filtered);
			})
			.catch((err) => console.error("Error:", err));

		// Fetch material info
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				const materials = Array.isArray(data?.data) ? data.data : [];
				const material = materials.find(
					(m: { id: number; name: string; label: string }) =>
						m.id === Number(materialId),
				);
				if (material) {
					setMaterialName(material.name);
					setMaterialLabel(material.label);
				}
			})
			.catch((err) => console.error("Error:", err));
	}, [materialId]);

	useEffect(() => {
		if (guestFeedbackEnabled === false) {
			setFeedback({});
			return;
		}
		if (guestFeedbackEnabled !== true || dilutions.length === 0) {
			return;
		}

		let cancelled = false;
		const dilutionIds = dilutions.map((d) => d.id);

		void (async () => {
			const feedbackData: Record<number, FeedbackWithNotes[]> = {};

			for (const id of dilutionIds) {
				if (cancelled) return;
				try {
					const response = await authedFetch(`/api/feedback?dilutionId=${id}`);
					const data = await response.json();
					feedbackData[id] = data.data || [];
				} catch (err) {
					console.error(`Error fetching feedback for dilution ${id}:`, err);
					feedbackData[id] = [];
				}
			}

			if (!cancelled) {
				setFeedback(feedbackData);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [dilutions, guestFeedbackEnabled]);

	const toggleAvailability = async (
		dilutionId: number,
		currentAvailable: boolean,
	) => {
		setLoading(true);
		try {
			const response = await authedFetch("/api/dilutions", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: dilutionId,
					available: !currentAvailable,
				}),
			});

			if (response.ok) {
				// Update local state
				setDilutions((prev) =>
					prev.map((d) =>
						d.id === dilutionId ? { ...d, available: !currentAvailable } : d,
					),
				);
			} else {
				alert("Failed to update dilution");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("Error updating dilution");
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout
			title="Raw Materials Inventory / Manage Dilutions"
			backButton={{ to: "/inventory" }}
		>
			<div className="space-y-3 max-w-200 mx-auto">
				{(materialLabel || materialName) && (
					<p className="text-slate-300 mb-4">
						<span className="text-white font-medium">{materialLabel}</span>
						{materialName ? (
							<span className="text-slate-400"> — {materialName}</span>
						) : null}
					</p>
				)}
				{dilutions.length === 0 ? (
					<p className="text-slate-400">No dilutions found</p>
				) : (
					dilutions.map((dilution) => (
						<div
							key={dilution.id}
							className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3"
						>
							<div className="flex items-center justify-between">
								<div>
									<span className="text-white font-semibold text-lg">
										{dilution.percentage}%
									</span>
									<span className="text-slate-400 ml-4">
										{dilution.dilution_date
											? new Date(dilution.dilution_date).toLocaleDateString()
											: "No date"}
									</span>
									{dilution.batch_weight_grams != null && (
										<p className="text-sm text-slate-400 mt-2">
											Batch weight:{" "}
											<span className="text-slate-200">
												{formatBatchGrams(dilution.batch_weight_grams)}
											</span>
										</p>
									)}
								</div>
								<div className="flex items-center gap-3">
									<span
										className={`text-sm font-medium ${
											dilution.available ? "text-green-300" : "text-red-300"
										}`}
									>
										{dilution.available ? "Available" : "Finished"}
									</span>
									<button
										type="button"
										onClick={() =>
											toggleAvailability(dilution.id, dilution.available)
										}
										disabled={loading}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
											dilution.available ? "bg-green-500" : "bg-red-500/50"
										}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												dilution.available ? "translate-x-6" : "translate-x-1"
											}`}
										/>
									</button>
								</div>
							</div>

							{/* Feedback Section (guest add-on) */}
							{guestFeedbackEnabled === true &&
								feedback[dilution.id] &&
								feedback[dilution.id].length > 0 && (
									<div className="pt-3 border-t border-slate-700">
										<h3 className="text-sm font-semibold text-slate-300 mb-2">
											Feedback ({feedback[dilution.id].length})
										</h3>
										<div className="space-y-2">
											{feedback[dilution.id].map((fb) => (
												<div
													key={fb.id}
													className="text-sm bg-slate-700/50 p-3 rounded"
												>
													<div className="flex justify-between items-start gap-2 mb-1.5">
														<div className="flex flex-wrap items-center gap-2 min-w-0">
															<span className="font-medium text-blue-300">
																{fb.person_name}
															</span>
															{typeof fb.rating === "number" && (
																<span
																	className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5"
																	title={`Guest rating: ${fb.rating} out of 5`}
																>
																	<span
																		className="flex items-center gap-px leading-none"
																		aria-hidden
																	>
																		{Array.from({ length: 5 }, (_, i) => (
																			<span
																				key={i}
																				className={`text-[11px] ${
																					i < fb.rating!
																						? "text-amber-400"
																						: "text-slate-600"
																				}`}
																			>
																				★
																			</span>
																		))}
																	</span>
																	<span className="text-xs font-medium tabular-nums text-amber-200/90">
																		{fb.rating}/5
																	</span>
																</span>
															)}
														</div>
														<span className="text-xs text-slate-400 shrink-0">
															{new Date(fb.created_at).toLocaleDateString()}
														</span>
													</div>
													<div className="text-slate-300">
														Notes: {fb.notes.join(", ")}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
						</div>
					))
				)}
			</div>
		</DashboardLayout>
	);
}
