import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DateTimeInput } from "@/components/DateTimeInput";
import { NumberInput } from "@/components/NumberInput";
import { OfflineCapacityLeft } from "@/components/OfflineCapacityLeft";
import { PaygRedeemModal } from "@/components/PaygRedeemModal";
import { RawMaterialAutocomplete } from "@/components/RawMaterialAutocomplete";
import { authedFetch } from "@/utils/authed-fetch";
import { getPaygUsage } from "@/utils/get-payg-usage";
import {
	notifyNavEligibilityUpdated,
	requireNavRoute,
} from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import styles from "@/components/Form.module.css";
import SuccessMessage from "@/components/SuccessMessage";

export const Route = createFileRoute("/_dashboard/add-dilution")({
	...requireNavRoute("/add-dilution"),
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
	const [successMessage, setSuccessMessage] = useState("");
	const [dilutionsLeft, setDilutionsLeft] = useState<number | null>(null);
	const [capacityOpen, setCapacityOpen] = useState(false);

	const refreshUsage = async () => {
		try {
			const usage = await getPaygUsage();
			setDilutionsLeft(usage.dilutions.left);
		} catch {
			// ignore — chip is optional
		}
	};

	useEffect(() => {
		void refreshUsage();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
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
			notifyNavEligibilityUpdated({ hasDilutions: true });
			setSuccessMessage("Dilution added successfully!");
			void refreshUsage();
		} catch (error) {
			setError("Network error: Failed to add dilution. Please try again.");
			setSuccessMessage("");
		}
	};

	const isLimitError = error.toLowerCase().includes("capacity pack");

	return (
		<DashboardLayout
			title={
				<span className="inline-flex items-center gap-3">
					Raw Materials Inventory / Add Dilution
					<OfflineCapacityLeft
						kind="dilutions"
						left={dilutionsLeft}
						onRedeemed={() => {
							void refreshUsage();
						}}
					/>
				</span>
			}
			backButton={{ to: "/inventory" }}
		>
			<div className={styles.formContainerWrapper}>
				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<div className="space-y-6">
						{/* Raw Material Selector */}
						<RawMaterialAutocomplete
							label="Raw Material"
							value={rawMaterialSearch}
							onSelect={(id, name) => {
								setSelectedRawMaterialId(id);
								setRawMaterialSearch(name);
								setError("");
							}}
							required
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
							label="Batch Weight (g)"
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
							label="Dilution Date"
							value={dilutionDate}
							onChange={setDilutionDate}
						/>

						{/* Submit Button */}
						<div className={styles.formSubmitButtonContainer}>
							<button type="submit" className={styles.formSubmitButton}>
								+ Add Dilution
							</button>
						</div>
						{successMessage && (
							<SuccessMessage
								message={successMessage}
								link={{ text: "Go to Inventory", to: "/inventory" }}
								onClose={() => setSuccessMessage("")}
							/>
						)}
						{/* Error Message */}
						{error && (
							<div className="px-4 py-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
								{isLimitError ? (
									<span className="inline-flex flex-wrap items-center gap-2">
										<span>
											{error.replace(
												/\s*Buy a capacity pack to add more\.?/i,
												"",
											)}
										</span>
										<button
											type="button"
											onClick={() => setCapacityOpen(true)}
											className="rounded border border-slate-600 px-2.5 py-1 text-sm font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 hover:text-slate-100"
											aria-label="Buy credits"
										>
											Buy Credits
										</button>
									</span>
								) : (
									error
								)}
							</div>
						)}
					</div>
				</form>
			</div>
			{capacityOpen ? (
				<PaygRedeemModal
					kind="dilutions"
					onClose={() => setCapacityOpen(false)}
					onRedeemed={() => {
						setError("");
						void refreshUsage();
					}}
				/>
			) : null}
		</DashboardLayout>
	);
}
