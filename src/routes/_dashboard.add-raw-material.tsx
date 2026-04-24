import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { CategoryAutocomplete } from "@/components/CategoryAutocomplete";
import { Select } from "@/components/Select";
import { NotesAutocomplete } from "@/components/NotesAutocomplete";
import { LabelInput } from "@/components/LabelInput";
import { RawMaterialAgentPanel } from "@/agent/ui/RawMaterialAgentPanel";
import { authedFetch } from "@/utils/authed-fetch";
import type { RawMaterialProposal } from "@/agent/schemas/rawMaterialProposal";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";

export const Route = createFileRoute("/_dashboard/add-raw-material")({
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
	const [materialNature, setMaterialNature] = useState("");
	const [error, setError] = useState("");

	const handleApplyProposal = async (proposal: RawMaterialProposal) => {
		setLabel(proposal.suggestedLabel);
		setName(proposal.nameAsEntered);
		setMaterialNature(proposal.materialNature);
		setNoteType(proposal.noteType);
		setNotes(proposal.notes);
		setError("");

		try {
			const response = await authedFetch("/api/categories");
			const data = await response.json();
			const suggested = proposal.suggestedCategory.trim().toLowerCase();
			if (!response.ok || !data.success || !Array.isArray(data.data)) {
				setCategorySearch(proposal.suggestedCategory);
				setSelectedCategoryId(null);
				return;
			}
			const categories = data.data as { id: number; name: string }[];
			const match =
				categories.find((c) => c.name.toLowerCase() === suggested) ??
				categories.find(
					(c) =>
						c.name.toLowerCase().includes(suggested) ||
						suggested.includes(c.name.toLowerCase()),
				);
			if (match) {
				setSelectedCategoryId(match.id);
				setCategorySearch(match.name);
			} else {
				setCategorySearch(proposal.suggestedCategory);
				setSelectedCategoryId(null);
			}
		} catch {
			setCategorySearch(proposal.suggestedCategory);
			setSelectedCategoryId(null);
		}
	};

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
		if (!materialNature) {
			setError("Material nature is required");
			return;
		}
		if (error) {
			setError(error);
			return;
		}

		try {
			const response = await authedFetch("/api/raw-materials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label,
					name,
					category_id: selectedCategoryId,
					note_type: noteType,
					material_nature: materialNature,
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
			setMaterialNature("");
			setNotes([]);
			alert("Raw material added successfully!");
		} catch (error) {
			setError(
				"Network error: Failed to create raw material. Please try again.",
			);
		}
	};

	return (
		<DashboardLayout
			title="Raw Materials Inventory / Add Raw Material"
			backButton={{ to: "/inventory" }}
		>
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

					{/* Material Nature Field */}
					<Select
						label="Material Nature"
						value={materialNature}
						onChange={(value) => {
							setMaterialNature(value);
							setError("");
						}}
						options={[
							{ value: "Natural", label: "Natural" },
							{ value: "Synthetic", label: "Synthetic" },
						]}
						placeholder="Select material nature..."
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
			<RawMaterialAgentPanel onApplyProposal={handleApplyProposal} />
		</DashboardLayout>
	);
}

export default AddRawMaterial;
