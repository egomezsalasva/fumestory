import { DateTimeInput } from "@/components/DateTimeInput";
import { NumberInput } from "@/components/NumberInput";
import { RawMaterialAutocomplete } from "@/components/RawMaterialAutocomplete";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/add-dilution")({
	component: AddDilution,
});

function AddDilution() {
	const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<
		number | null
	>(null);
	const [rawMaterialSearch, setRawMaterialSearch] = useState("");
	const [percentage, setPercentage] = useState("");
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
		try {
			const response = await fetch("/api/dilutions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					raw_material_id: selectedRawMaterialId,
					percentage: percentageNum,
					dilution_date: dilutionDate || null,
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
			setDilutionDate("");
			alert("Dilution added successfully!");
		} catch (error) {
			setError("Network error: Failed to add dilution. Please try again.");
		}
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-7">Add Dilution</h1>
				<form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6">
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
							placeholder="e.g., 10"
							required
							min={0}
							max={100}
						/>
						{/* Dilution Date Field */}
						<DateTimeInput
							label="Dilution Date (Optional)"
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
			</div>
		</div>
	);
}
