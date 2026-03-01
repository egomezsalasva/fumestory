import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Dilution } from "./api.dilutions";

export const Route = createFileRoute("/manage-dilutions/$materialId")({
	component: ManageDilutions,
});

function ManageDilutions() {
	const { materialId } = useParams({ from: "/manage-dilutions/$materialId" });
	const [dilutions, setDilutions] = useState<Dilution[]>([]);
	const [materialName, setMaterialName] = useState("");
	const [materialLabel, setMaterialLabel] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Fetch all dilutions for this material
		fetch("/api/dilutions")
			.then((res) => res.json())
			.then((data) => {
				const allDilutions = data.data as Dilution[];
				const filtered = allDilutions.filter(
					(d) => d.raw_material_id === Number(materialId),
				);
				setDilutions(filtered);
			})
			.catch((err) => console.error("Error:", err));

		// Fetch material info
		fetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				const material = data.data.find(
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
			const response = await fetch("/api/dilutions", {
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
								className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
							>
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
						))
					)}
				</div>
			</div>
		</div>
	);
}
