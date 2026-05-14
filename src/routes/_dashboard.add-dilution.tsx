import { DateTimeInput } from "@/components/DateTimeInput";
import { NumberInput } from "@/components/NumberInput";
import { RawMaterialAutocomplete } from "@/components/RawMaterialAutocomplete";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

export const Route = createFileRoute("/_dashboard/add-dilution")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Dilution" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AddDilution,
});

function AddDilution() {
	const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<
		number | null
	>(null);
	const [rawMaterialSearch, setRawMaterialSearch] = useState("");
	const [percentage, setPercentage] = useState("");
	const [batchWeightGrams, setBatchWeightGrams] = useState("");
	const [dilutionDate, setDilutionDate] = useState("");

	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedRawMaterialId) {
			setError("Raw material is required");
			return;
		}
		if (!percentage) {
			setError("Percentage is required");
			return;
		}
		const percentageNum = parseFloat(percentage);
		if (!percentageNum || percentageNum < 0 || percentageNum > 100) {
			setError("Percentage must be between 0 and 100");
			return;
		}

		let batchWeightGramsPayload: number | undefined;
		if (batchWeightGrams.trim() !== "") {
			const w = parseFloat(batchWeightGrams);
			if (!Number.isFinite(w) || w <= 0) {
				setError("Batch weight must be a number greater than 0");
				return;
			}
			batchWeightGramsPayload = w;
		}

		try {
			const response = await authedFetch("/api/dilutions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					raw_material_id: selectedRawMaterialId,
					percentage: percentageNum,
					dilution_date: dilutionDate || null,
					...(batchWeightGramsPayload !== undefined
						? { batch_weight_grams: batchWeightGramsPayload }
						: {}),
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				setError(data.error || "Failed to add dilution");
				return;
			}

			//Success Reset
			setSelectedRawMaterialId(null);
			setRawMaterialSearch("");
			setPercentage("");
			setBatchWeightGrams("");
			setDilutionDate("");
			alert("Dilution added successfully!");
		} catch (error) {
			setError("Network error: Failed to add dilution. Please try again.");
		}
	};

	return (
		<DashboardLayout
			title="Raw Materials Inventory / Add Dilution"
			backButton={{ to: "/inventory" }}
		>
			<form
				onSubmit={handleSubmit}
				className="bg-slate-800 rounded-lg p-6 max-w-170 mx-auto"
			>
				<div className="space-y-6">
					{/* Raw Material Selector */}
					<RawMaterialAutocomplete
						label="Raw Material *"
						value={rawMaterialSearch}
						onSelect={(id, name) => {
							setSelectedRawMaterialId(id);
							setRawMaterialSearch(name);
							setError("");
						}}
					/>
					{/* Percentage Field */}
					<NumberInput
						label="Percentage"
						value={percentage}
						onChange={(value) => {
							setPercentage(value);
							setError("");
						}}
						placeholder="e.g. 10"
						required
						min={0}
						max={100}
					/>
					<NumberInput
						label="Batch weight (g) (optional)"
						value={batchWeightGrams}
						onChange={(value) => {
							setBatchWeightGrams(value);
							setError("");
						}}
						placeholder="e.g. 5"
						min={0}
						step="any"
					/>
					{/* Dilution Date Field */}
					<DateTimeInput
						label="Dilution Date (optional)"
						value={dilutionDate}
						onChange={setDilutionDate}
					/>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
					>
						Add Dilution
					</button>
					{/* Error Message */}
					{error && (
						<div className="px-4 py-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
							{error}
						</div>
					)}
				</div>
			</form>
		</DashboardLayout>
	);
}
