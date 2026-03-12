import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RawMaterialAutocomplete } from "@/components/RawMaterialAutocomplete";
import { NotesAutocomplete } from "@/components/NotesAutocomplete";
import { TextInput } from "@/components/TextInput";
import { Dilution } from "./api.dilutions";

export const Route = createFileRoute("/add-feedback")({
	component: AddFeedback,
});

function AddFeedback() {
	const navigate = useNavigate();
	const [rawMaterialId, setRawMaterialId] = useState<number | null>(null);
	const [rawMaterialName, setRawMaterialName] = useState("");
	const [dilutionId, setDilutionId] = useState<number | null>(null);
	const [personName, setPersonName] = useState("");
	const [notes, setNotes] = useState<string[]>([]);
	const [availableDilutions, setAvailableDilutions] = useState<Dilution[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Fetch dilutions when material is selected
	useEffect(() => {
		if (!rawMaterialId) {
			setAvailableDilutions([]);
			return;
		}

		fetch("/api/dilutions")
			.then((res) => res.json())
			.then((data) => {
				const filtered = (data.data as Dilution[]).filter(
					(d) => d.raw_material_id === rawMaterialId,
				);
				setAvailableDilutions(filtered);

				// Reset dilution selection if previous selection is not in new list
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

		if (!dilutionId || !personName.trim() || notes.length === 0) {
			setError("Please fill in all fields");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					dilution_id: dilutionId,
					person_name: personName.trim(),
					notes: notes,
				}),
			});

			if (response.ok) {
				// Success! Navigate back to home
				navigate({ to: "/" });
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
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-2xl mx-auto">
				<div className="mb-7">
					<div className="flex items-center gap-4 mb-4">
						<Link
							to="/"
							className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
						>
							← Back
						</Link>
						<h1 className="text-2xl font-bold text-white">
							Add Guest Feedback
						</h1>
					</div>
					<p className="text-sm text-slate-400">
						This form can be used to get some direct feedback from when you have
						a guest over. Use a scent strip with any of your dilutions and give
						it to your guest without giving them any guidance. See what notes
						they pick up on and what they think of the scent.
					</p>
				</div>

				{error && (
					<div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
						{error}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700"
				>
					{/* Person Name */}
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
							<label className="block text-sm font-medium text-slate-300 mb-2">
								Dilution *
							</label>
							<select
								value={dilutionId || ""}
								onChange={(e) => setDilutionId(Number(e.target.value))}
								className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

					{/* Submit Button */}
					<button
						type="submit"
						disabled={
							loading ||
							!rawMaterialId ||
							!dilutionId ||
							!personName ||
							notes.length === 0
						}
						className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
					>
						{loading ? "Submitting..." : "Add Feedback"}
					</button>
				</form>
			</div>
		</div>
	);
}
