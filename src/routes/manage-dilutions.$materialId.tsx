import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Dilution } from "./api.dilutions";
import { FeedbackWithNotes } from "./api.feedback";
import { authedFetch } from "@/utils/authed-fetch";

export const Route = createFileRoute("/manage-dilutions/$materialId")({
	component: ManageDilutions,
});

function ManageDilutions() {
	const { materialId } = useParams({ from: "/manage-dilutions/$materialId" });
	const [dilutions, setDilutions] = useState<Dilution[]>([]);
	const [materialName, setMaterialName] = useState("");
	const [materialLabel, setMaterialLabel] = useState("");
	const [feedback, setFeedback] = useState<Record<number, FeedbackWithNotes[]>>(
		{},
	);
	const [loading, setLoading] = useState(false);

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
				if (filtered.length > 0) {
					fetchFeedback(filtered.map((d) => d.id));
				}
			})
			.catch((err) => console.error("Error:", err));

		// Fetch material info
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				const materials = Array.isArray(data?.data) ? data.data : [];
				const material = materials.find(
					(m: any) => m.id === Number(materialId),
				);
				if (material) {
					setMaterialName(material.name);
					setMaterialLabel(material.label);
				}
			})
			.catch((err) => console.error("Error:", err));
	}, [materialId]);

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

	const fetchFeedback = async (dilutionIds: number[]) => {
		const feedbackData: Record<number, FeedbackWithNotes[]> = {};

		for (const id of dilutionIds) {
			try {
				const response = await authedFetch(`/api/feedback?dilutionId=${id}`);
				const data = await response.json();
				feedbackData[id] = data.data || [];
			} catch (err) {
				console.error(`Error fetching feedback for dilution ${id}:`, err);
				feedbackData[id] = [];
			}
		}

		setFeedback(feedbackData);
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center gap-4 mb-7">
					<Link
						to="/"
						className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
					>
						← Back
					</Link>
					<h1 className="text-2xl font-bold text-white">
						<span>{materialLabel}</span> — {materialName}
					</h1>
				</div>

				<div className="space-y-3">
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

								{/* Feedback Section */}
								{feedback[dilution.id] && feedback[dilution.id].length > 0 && (
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
													<div className="flex justify-between items-start mb-1">
														<span className="font-medium text-blue-300">
															{fb.person_name}
														</span>
														<span className="text-xs text-slate-400">
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
			</div>
		</div>
	);
}
