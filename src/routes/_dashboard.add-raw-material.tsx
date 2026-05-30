import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import SuccessMessage from "@/components/SuccessMessage";
import { normalizeCasNumber, isValidCasNumber } from "@/utils/cas-numbers";

export const Route = createFileRoute("/_dashboard/add-raw-material")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Raw Material" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AddRawMaterial,
});

type UserSettingsResponse = {
	success?: boolean;
	data?: {
		raw_material_agent_collapsed?: boolean;
	};
	error?: string;
};

function AddRawMaterial() {
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [casNumber, setCasNumber] = useState("");
	const [categorySearch, setCategorySearch] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);
	const [noteType, setNoteType] = useState("");
	const [notes, setNotes] = useState<string[]>([]);
	const [materialNature, setMaterialNature] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	// null = loading settings, true/false = resolved preference
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean | null>(
		null,
	);

	useEffect(() => {
		let cancelled = false;

		const loadSidebarPreference = async () => {
			try {
				const res = await authedFetch("/api/user-settings");
				const json = (await res.json()) as UserSettingsResponse;

				const collapsed =
					res.ok && json?.data?.raw_material_agent_collapsed === true;

				if (!cancelled) {
					setIsSidebarCollapsed(collapsed);
				}
			} catch {
				// Fallback to expanded if settings fetch fails.
				if (!cancelled) {
					setIsSidebarCollapsed(false);
				}
			}
		};

		void loadSidebarPreference();

		return () => {
			cancelled = true;
		};
	}, []);

	const handleToggleSidebar = async () => {
		// Guard for edge case while still loading.
		if (isSidebarCollapsed === null) return;

		const next = !isSidebarCollapsed;
		setIsSidebarCollapsed(next);

		try {
			await authedFetch("/api/user-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ raw_material_agent_collapsed: next }),
			});
		} catch {
			// Keep optimistic UI state even if save fails.
		}
	};

	const handleCloseSidebar = async () => {
		if (isSidebarCollapsed === true) return;
		setIsSidebarCollapsed(true);
		await authedFetch("/api/user-settings", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ raw_material_agent_collapsed: true }), // or raw_material...
		});
	};

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
		setSuccessMessage("");

		if (!name.trim()) {
			setError("Name is required");
			return;
		}
		if (name.trim().length < 3) {
			setError("Name must be at least 3 characters long");
			return;
		}
		const normalizedCas = normalizeCasNumber(casNumber);
		if (!isValidCasNumber(normalizedCas)) {
			setError("CAS number must look like 6790-58-5");
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
		if (notes.length === 0) {
			setError("At least one note is required");
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
					cas_number: normalizedCas,
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
			setCasNumber("");
			setCategorySearch("");
			setSelectedCategoryId(null);
			setNoteType("");
			setMaterialNature("");
			setNotes([]);
			setSuccessMessage("Raw material added successfully!");
		} catch (error) {
			setError(
				"Network error: Failed to create raw material. Please try again.",
			);
			setSuccessMessage("");
		}
	};

	// Render shell while loading settings to avoid sidebar flicker.
	if (isSidebarCollapsed === null) {
		return (
			<DashboardLayout
				title="Raw Materials Inventory / Add Raw Material"
				backButton={{ to: "/inventory" }}
				agentToggle={true}
			>
				<div className="dashboardSplitLayout" />
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout
			title="Raw Materials Inventory / Add Raw Material"
			backButton={{ to: "/inventory" }}
			agentToggle={true}
			onAgentToggleClick={handleToggleSidebar}
		>
			<div
				className={`dashboardSplitLayout ${isSidebarCollapsed ? "isSidebarCollapsed" : ""}`}
			>
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
							<TextInput
								label="CAS Number"
								value={casNumber}
								onChange={(value) => {
									setCasNumber(value);
									setError("");
								}}
								placeholder="e.g. 6790-58-5"
							/>

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
								label="Notes *"
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
									{error}
								</div>
							)}
						</div>
					</form>
				</div>
				<div className="dashboardSplitSidebar">
					<div className="dashboardSplitSidebarSticky">
						<div className="dashboardSplitSidebarClip">
							<RawMaterialAgentPanel
								onApplyProposal={handleApplyProposal}
								onAddNewMaterialClick={() => setSuccessMessage("")}
								hidePanel={handleCloseSidebar}
							/>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}

export default AddRawMaterial;
