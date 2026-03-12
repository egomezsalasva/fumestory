import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { CategoryAutocomplete } from "@/components/CategoryAutocomplete";
import { Select } from "@/components/Select";
import { NotesAutocomplete } from "@/components/NotesAutocomplete";
import { LabelInput } from "@/components/LabelInput";
import { RawMaterialAgentPanel } from "@/agent/ui/RawMaterialAgentPanel";

export const Route = createFileRoute("/add-raw-material")({
	component: AddRawMaterial,
});

function AddRawMaterial() {
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [categorySearch, setCategorySearch] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);
	const [noteType, setNoteType] = useState("");
	const [notes, setNotes] = useState<string[]>([]);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name.trim()) {
			setError("Name is required");
			return;
		}
		if (name.trim().length < 3) {
			setError("Name must be at least 3 characters long");
			return;
		}
		if (!selectedCategoryId) {
			setError("Category is required");
			return;
		}
		if (!noteType) {
			setError("Note type is required");
			return;
		}
		if (error) {
			setError(error);
			return;
		}

		try {
			const response = await fetch("/api/raw-materials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label,
					name,
					category_id: selectedCategoryId,
					note_type: noteType,
					notes,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to add raw material");
				return;
			}

			// Success reset
			setName("");
			setLabel("");
			setCategorySearch("");
			setSelectedCategoryId(null);
			setNoteType("");
			setNotes([]);
			alert("Raw material added successfully!");
		} catch (error) {
			setError(
				"Network error: Failed to create raw material. Please try again.",
			);
		}
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="flex gap-6 max-w-7xl mx-auto relative">
				{/* Left: Form */}
				<div className="flex-1 max-w-2xl">
					<h1 className="text-2xl font-bold text-white mb-7">
						Add Raw Material
					</h1>
					<form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6">
						<div className="space-y-6">
							{/* Label Field */}
							<LabelInput
								label="Label *"
								value={label}
								onChange={(value) => {
									setLabel(value);
									setError("");
								}}
								placeholder="e.g., LB1"
								required
							/>

							{/* Name Field */}
							<TextInput
								label="Name"
								value={name}
								onChange={(value) => {
									setName(value);
									setError("");
								}}
								placeholder="Enter raw material name"
								required
							/>

							{/* Category Field with Autocomplete */}
							<CategoryAutocomplete
								label="Category"
								value={categorySearch}
								onSelect={(id, name) => {
									setSelectedCategoryId(id);
									setCategorySearch(name);
									setError("");
								}}
							/>

							{/* Note Type Field */}
							<Select
								label="Note Type"
								value={noteType}
								onChange={(value) => {
									setNoteType(value);
									setError("");
								}}
								options={[
									{ value: "High", label: "High" },
									{ value: "Mid(Heart)", label: "Mid(Heart)" },
									{ value: "Base", label: "Base" },
								]}
								placeholder="Select note type..."
							/>

							{/* Notes Field */}
							<NotesAutocomplete
								label="Notes"
								selectedNotes={notes}
								onNotesChange={(value) => {
									setNotes(value);
									setError("");
								}}
							/>

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
							>
								Add Raw Material
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

				{/* Right: Chatbox */}
				<RawMaterialAgentPanel />
			</div>
		</div>
	);
}

export default AddRawMaterial;
