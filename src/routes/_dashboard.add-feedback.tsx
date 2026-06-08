import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RawMaterialAutocomplete } from "@/components/RawMaterialAutocomplete";
import { NotesAutocomplete } from "@/components/NotesAutocomplete";
import { TextInput } from "@/components/TextInput";
import { Dilution } from "./api.dilutions";
import { authedFetch } from "@/utils/authed-fetch";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { Feedback } from "./api.feedback";
import styles from "@/components/Form.module.css";
import SelectArrow from "@/components/svgs/SelectArrow";
import SuccessMessage from "@/components/SuccessMessage";

export const Route = createFileRoute("/_dashboard/add-feedback")({
	...requireNavRoute("/add-feedback"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Feedback" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AddFeedback,
});

function AddFeedback() {
	const [rawMaterialId, setRawMaterialId] = useState<number | null>(null);
	const [rawMaterialName, setRawMaterialName] = useState("");
	const [dilutionId, setDilutionId] = useState<Feedback["dilution_id"] | null>(
		null,
	);
	const [personName, setPersonName] = useState<Feedback["person_name"]>("");
	const [rating, setRating] = useState<Feedback["rating"]>(null);
	const [notes, setNotes] = useState<string[]>([]);
	const [availableDilutions, setAvailableDilutions] = useState<Dilution[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [submittedMaterialId, setSubmittedMaterialId] = useState<number | null>(
		null,
	);

	// Fetch dilutions when material is selected
	useEffect(() => {
		if (!rawMaterialId) {
			setAvailableDilutions([]);
			return;
		}

		authedFetch("/api/dilutions")
			.then((res) => res.json())
			.then((data) => {
				const allDilutions = Array.isArray(data?.data)
					? (data.data as Dilution[])
					: [];
				const filtered = allDilutions.filter(
					(d) => d.raw_material_id === rawMaterialId && d.available,
				);
				setAvailableDilutions(filtered);

				if (dilutionId && !filtered.find((d) => d.id === dilutionId)) {
					setDilutionId(null);
				}
			})
			.catch((err) => {
				console.error("Error fetching dilutions:", err);
				setError("Failed to load dilutions");
			});
	}, [rawMaterialId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");
		setSubmittedMaterialId(null);
		if (!dilutionId || !personName.trim() || notes.length === 0) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);

		try {
			const response = await authedFetch("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dilution_id: dilutionId,
					person_name: personName.trim(),
					notes,
					rating,
				}),
			});

			if (response.ok) {
				setSubmittedMaterialId(rawMaterialId);
				setRawMaterialId(null);
				setRawMaterialName("");
				setDilutionId(null);
				setPersonName("");
				setRating(null);
				setNotes([]);
				setAvailableDilutions([]);
				setSuccessMessage("Guest feedback added successfully!");
				return;
			} else {
				const data = await response.json();
				setError(data.error || "Failed to submit feedback");
			}
		} catch (err) {
			console.error("Error submitting feedback:", err);
			setError("Failed to submit feedback");
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout
			title="Raw Materials Inventory / Add Feedback"
			backButton={{ to: "/inventory" }}
		>
			<div className="max-w-170 mx-auto">
				<p className="text-sm text-slate-400 mb-6">
					This form can be used to get some direct feedback from when you have a
					guest over. Use a scent strip with any of your dilutions and give it
					to your guest without giving them any guidance. See what notes they
					pick up on and what they think of the scent.
				</p>

				<form onSubmit={handleSubmit} className={styles.formContainer}>
					{/* Person Name */}
					<TextInput
						label="Guest Name *"
						value={personName}
						onChange={setPersonName}
						placeholder="Enter your guest/friend's name"
					/>

					{/* Raw Material Selection */}
					<div>
						<RawMaterialAutocomplete
							label="Raw Material *"
							value={rawMaterialName}
							onSelect={(id, name) => {
								setRawMaterialId(id);
								setRawMaterialName(name);
								setDilutionId(null);
							}}
						/>
					</div>

					{/* Dilution Selection - show only when material is selected */}
					{rawMaterialId && availableDilutions.length > 0 && (
						<div>
							<label className={styles.formLabel}>Dilution *</label>
							<div className={styles.selectWrapper}>
								<select
									value={dilutionId || ""}
									onChange={(e) => setDilutionId(Number(e.target.value))}
									className={`${styles.formInput} ${styles.formSelect} ${!dilutionId ? styles.formInputPlaceholder : ""}`}
								>
									<option value="">Select a dilution...</option>
									{availableDilutions.map((dilution) => (
										<option key={dilution.id} value={dilution.id}>
											{dilution.percentage}%
											{dilution.dilution_date &&
												` - ${new Date(dilution.dilution_date).toLocaleDateString()}`}
										</option>
									))}
								</select>
								<span className={styles.selectChevron} aria-hidden>
									<SelectArrow />
								</span>
							</div>
						</div>
					)}

					{rawMaterialId && availableDilutions.length === 0 && (
						<div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300">
							No dilutions found for this material. Please add a dilution first.
						</div>
					)}

					{/* Notes Selection */}
					<div>
						<label className="block text-sm font-medium text-slate-300 mb-2">
							Notes Detected *
						</label>
						<NotesAutocomplete
							label=""
							selectedNotes={notes}
							onNotesChange={setNotes}
						/>
					</div>

					<div>
						<label className={styles.formLabel}>Rating (optional)</label>
						<p className="text-xs text-slate-400 mb-2">
							0 = lowest, 5 = highest. Leave unset if the guest prefers not to
							rate.
						</p>
						<div className="flex flex-wrap gap-2">
							{([0, 1, 2, 3, 4, 5] as const).map((value) => (
								<button
									key={value}
									type="button"
									onClick={() => setRating(value)}
									className={`${styles.feedbackRatingButton} ${
										rating === value
											? styles.feedbackRatingButtonActive
											: styles.feedbackRatingButtonInactive
									}`}
								>
									{value}
								</button>
							))}
							<button
								type="button"
								onClick={() => setRating(null)}
								className={`${styles.feedbackNoRatingButton} ${
									rating === null
										? styles.feedbackNoRatingButtonActive
										: styles.feedbackNoRatingButtonInactive
								}`}
							>
								No rating
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<div
						className={styles.formSubmitButtonContainer}
						style={{ marginTop: "0.75rem" }}
					>
						<button
							type="submit"
							disabled={
								loading ||
								!rawMaterialId ||
								!dilutionId ||
								!personName ||
								notes.length === 0
							}
							className={styles.formSubmitButton}
						>
							{loading ? "Submitting..." : "Add Feedback"}
						</button>
					</div>
					{successMessage && (
						<SuccessMessage
							message={successMessage}
							link={{
								text: "Go to Raw Material",
								to: `/manage-dilutions/${submittedMaterialId}`,
							}}
							onClose={() => {
								setSuccessMessage("");
								setSubmittedMaterialId(null);
							}}
						/>
					)}
					{error && (
						<div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
							{error}
						</div>
					)}
				</form>
			</div>
		</DashboardLayout>
	);
}
