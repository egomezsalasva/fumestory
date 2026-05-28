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
import styles from "@/components/Form.module.css";

export const Route = createFileRoute("/_dashboard/add-raw-material")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Raw Material" },
			{ name: "robots", content: "noindex" },
		],
	}),
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
			<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_24rem] gap-6 h-full min-h-0">
				<div className="w-full px-20">
					<form
						onSubmit={handleSubmit}
						className={`${styles.formContainer} space-y-6 bg-[#10151C] py-8 px-6 rounded-lg border border-[#464859]`}
					>
						<div className="space-y-4">
							{/* Name Field */}
							<TextInput
								label="Name"
								value={name}
								onChange={(value) => {
									setName(value);
									setError("");
								}}
								placeholder="e.g. Ambroxan"
								required
							/>

							{/* CAS Number Field */}
							{/* <LabelInput
								label="CAS Number"
								value={label}
								onChange={(value) => {
									setLabel(value);
									setError("");
								}}
								placeholder="e.g. 123-45-6"
								required
							/> */}

							{/* Label Field */}
							<LabelInput
								label="Bottle Label"
								value={label}
								onChange={(value) => {
									setLabel(value);
									setError("");
								}}
								placeholder="e.g. LB1"
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
								required
							/>

							{/* Primary Category Field with Autocomplete */}
							<CategoryAutocomplete
								label="Primary Category"
								value={categorySearch}
								onSelect={(id, name) => {
									setSelectedCategoryId(id);
									setCategorySearch(name);
									setError("");
								}}
								required
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
							<div className={styles.formSubmitButtonContainer}>
								<button type="submit" className={styles.formSubmitButton}>
									+ Add Raw Material
								</button>
							</div>

							{/* Error Message */}
							{error && (
								<div className="px-4 py-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
									{error}
								</div>
							)}
						</div>
					</form>
				</div>
				<div className="hidden xl:block min-h-0">
					<div className="sticky top-0 h-full min-h-0">
						<RawMaterialAgentPanel onApplyProposal={handleApplyProposal} />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}

export default AddRawMaterial;
