import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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
import { nameFromAgentProposal, toTitleCaseWords } from "@/utils/display-names";
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";

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
	data?: Pick<
		UserSettingsEffective,
		| "raw_material_agent_collapsed"
		| "bottle_label_enabled"
		| "cas_number_enabled"
		| "material_nature_enabled"
	>;
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
	const [bottleLabelEnabled, setBottleLabelEnabled] = useState<boolean | null>(
		null,
	);
	const [casNumberEnabled, setCasNumberEnabled] = useState<boolean | null>(
		null,
	);
	const [materialNatureEnabled, setMaterialNatureEnabled] = useState<
		boolean | null
	>(null);

	const loadUserSettings = useCallback(() => {
		let cancelled = false;

		const run = async () => {
			try {
				const res = await authedFetch("/api/user-settings");
				const json = (await res.json()) as UserSettingsResponse;

				if (!cancelled) {
					setIsSidebarCollapsed(
						res.ok && json?.data?.raw_material_agent_collapsed === true,
					);
					setBottleLabelEnabled(
						res.ok ? (json.data?.bottle_label_enabled ?? false) : false,
					);
					setCasNumberEnabled(
						res.ok ? (json.data?.cas_number_enabled ?? false) : false,
					);
					setMaterialNatureEnabled(
						res.ok ? (json.data?.material_nature_enabled ?? false) : false,
					);
				}
			} catch {
				if (!cancelled) {
					setIsSidebarCollapsed(false);
					setBottleLabelEnabled(false);
					setCasNumberEnabled(false);
					setMaterialNatureEnabled(false);
				}
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const cleanup = loadUserSettings();
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		return () => {
			cleanup();
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		};
	}, [loadUserSettings]);

	const handleToggleSidebar = async () => {
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
			body: JSON.stringify({ raw_material_agent_collapsed: true }),
		});
	};

	const handleApplyProposal = async (proposal: RawMaterialProposal) => {
		if (bottleLabelEnabled) {
			setLabel(proposal.suggestedLabel);
		} else {
			setLabel("");
		}
		setName(nameFromAgentProposal(proposal.nameAsEntered));
		if (materialNatureEnabled) {
			setMaterialNature(proposal.materialNature);
		} else {
			setMaterialNature("");
		}
		setNoteType(proposal.noteType);
		setNotes(proposal.notes.map((n) => n.trim().toLowerCase()).filter(Boolean));

		let casError = "";
		if (casNumberEnabled) {
			const normalizedCas = normalizeCasNumber(proposal.casNumber);
			if (!isValidCasNumber(normalizedCas)) {
				casError = "CAS number must look like 6790-58-5";
				setCasNumber("");
			} else {
				setCasNumber(normalizedCas ?? "");
			}
		} else {
			setCasNumber("");
		}

		try {
			const response = await authedFetch("/api/categories");
			const data = await response.json();
			const suggested = proposal.suggestedCategory.trim().toLowerCase();
			if (!response.ok || !data.success || !Array.isArray(data.data)) {
				setCategorySearch(toTitleCaseWords(proposal.suggestedCategory));
				setSelectedCategoryId(null);
				setError(casError);
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
				setCategorySearch(toTitleCaseWords(match.name));
			} else {
				setCategorySearch(toTitleCaseWords(proposal.suggestedCategory));
				setSelectedCategoryId(null);
			}
		} catch {
			setCategorySearch(toTitleCaseWords(proposal.suggestedCategory));
			setSelectedCategoryId(null);
		}

		setError(casError);
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

		const normalizedCas = casNumberEnabled
			? normalizeCasNumber(casNumber)
			: null;
		if (casNumberEnabled && !isValidCasNumber(normalizedCas)) {
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
					label: bottleLabelEnabled ? label.trim() || null : null,
					name,
					cas_number: normalizedCas,
					category_id: selectedCategoryId,
					note_type: noteType,
					material_nature:
						materialNatureEnabled && materialNature ? materialNature : null,
					notes,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Failed to add raw material");
				return;
			}

			setName("");
			setLabel("");
			setCasNumber("");
			setCategorySearch("");
			setSelectedCategoryId(null);
			setNoteType("");
			setMaterialNature("");
			setNotes([]);
			setSuccessMessage("Raw material added successfully!");
		} catch {
			setError(
				"Network error: Failed to create raw material. Please try again.",
			);
			setSuccessMessage("");
		}
	};

	if (
		isSidebarCollapsed === null ||
		bottleLabelEnabled === null ||
		casNumberEnabled === null ||
		materialNatureEnabled === null
	) {
		return (
			<DashboardLayout
				title="Raw Materials Inventory / Add Raw Material"
				backButton={{ to: "/inventory" }}
				agentToggle={true}
				showCogButton={true}
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
			showCogButton={true}
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

							{casNumberEnabled && (
								<TextInput
									label="CAS Number"
									value={casNumber}
									onChange={(value) => {
										setCasNumber(value);
										setError("");
									}}
									placeholder="e.g. 6790-58-5"
								/>
							)}

							{bottleLabelEnabled && (
								<LabelInput
									label="Bottle Label"
									value={label}
									onChange={(value) => {
										setLabel(value);
										setError("");
									}}
									placeholder="e.g. LB1"
								/>
							)}

							{materialNatureEnabled && (
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
								/>
							)}

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

							<CategoryAutocomplete
								label="Primary Category"
								value={categorySearch}
								onSelect={(id, name) => {
									setSelectedCategoryId(id);
									setCategorySearch(toTitleCaseWords(name));
									setError("");
								}}
							/>

							<NotesAutocomplete
								label="Notes *"
								selectedNotes={notes}
								onNotesChange={(value) => {
									setNotes(value);
									setError("");
								}}
							/>

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
