import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { CategoryAutocomplete } from "@/components/CategoryAutocomplete";
import { Select } from "@/components/Select";
import {
	NotesAutocomplete,
	type SelectedNote,
} from "@/components/NotesAutocomplete";
import { LabelInput } from "@/components/LabelInput";
import { IfraStatusLabel } from "@/components/ifra/IfraStatusLabel";
import { IfraRuleModal } from "@/components/ifra/IfraRuleModal";
import { RawMaterialAgentPanel } from "@/agent/ui/RawMaterialAgentPanel";
import { authedFetch } from "@/utils/authed-fetch";
import type { RawMaterialProposal } from "@/agent/schemas/rawMaterialProposal";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import styles from "@/components/Form.module.css";
import SuccessMessage from "@/components/SuccessMessage";
import { normalizeCasNumber, isValidCasNumber } from "@/utils/cas-numbers";
import { nameFromAgentProposal, toTitleCaseWords } from "@/utils/display-names";
import { NEUTRAL_CATEGORY_COLOR } from "@/utils/curated-category-colors";
import {
	findMaterialByName,
	findMaterialByCas,
	getIfraStatuses,
	collectMatchedMaterials,
	getIfraRulesForStatus,
	IFRA_STATUS_ORDER,
} from "@/utils/ifra";
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import { notifyNavEligibilityUpdated } from "@/utils/nav-eligibility";
import { HEADER_HINT_IDS } from "@/utils/toast-settings";
import type { IfraStatus, MaterialRecord } from "@/curation/materials/types";

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
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);
	const [categoryIsOther, setCategoryIsOther] = useState(false);
	const [otherCategoryName, setOtherCategoryName] = useState("");
	const [otherCategoryColor, setOtherCategoryColor] = useState(
		NEUTRAL_CATEGORY_COLOR,
	);
	const [noteType, setNoteType] = useState("");
	const [notes, setNotes] = useState<SelectedNote[]>([]);
	const [materialNature, setMaterialNature] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [selectedIfraStatus, setSelectedIfraStatus] =
		useState<IfraStatus | null>(null);
	const [isApplyingProposal, setIsApplyingProposal] = useState(false);

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

	const curatedMaterialMatch = useMemo(() => {
		const fromName = findMaterialByName(name);
		let fromCas: MaterialRecord | null = null;

		if (casNumberEnabled) {
			const normalized = normalizeCasNumber(casNumber);
			if (normalized && isValidCasNumber(normalized)) {
				fromCas = findMaterialByCas(normalized);
			}
		}

		return { fromName, fromCas };
	}, [name, casNumber, casNumberEnabled]);

	const matchedMaterials = useMemo(
		() =>
			collectMatchedMaterials(
				curatedMaterialMatch.fromName,
				curatedMaterialMatch.fromCas,
			),
		[curatedMaterialMatch],
	);

	const ifraStatuses = useMemo(() => {
		const found = new Set<IfraStatus>();
		for (const material of matchedMaterials) {
			for (const status of getIfraStatuses(material)) {
				found.add(status);
			}
		}
		return IFRA_STATUS_ORDER.filter((status) => found.has(status));
	}, [matchedMaterials]);

	const selectedIfraEntries = useMemo(() => {
		if (!selectedIfraStatus) return [];
		return getIfraRulesForStatus(matchedMaterials, selectedIfraStatus);
	}, [matchedMaterials, selectedIfraStatus]);

	const showIdentityMismatch = useMemo(() => {
		const { fromName, fromCas } = curatedMaterialMatch;
		if (!fromName || !fromCas) return false;
		return fromName.canonicalName !== fromCas.canonicalName;
	}, [curatedMaterialMatch]);

	const showCasMismatch = useMemo(() => {
		const { fromName, fromCas } = curatedMaterialMatch;

		if (!fromName || !casNumberEnabled) return false;

		const normalized = normalizeCasNumber(casNumber);
		if (!normalized || !isValidCasNumber(normalized)) return false;

		if (fromCas && fromCas.canonicalName !== fromName.canonicalName) {
			return false;
		}

		if (fromCas?.canonicalName === fromName.canonicalName) return false;
		if (fromName.cas?.includes(normalized)) return false;

		return true;
	}, [curatedMaterialMatch, casNumber, casNumberEnabled]);

	useEffect(() => {
		if (selectedIfraStatus && !ifraStatuses.includes(selectedIfraStatus)) {
			setSelectedIfraStatus(null);
		}
	}, [ifraStatuses, selectedIfraStatus]);

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
		setIsApplyingProposal(true);
		setError("");

		try {
			const [notesRes, categoriesRes] = await Promise.all([
				authedFetch("/api/agent/resolve-notes", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ names: proposal.notes }),
				}),
				authedFetch("/api/categories"),
			]);

			const notesData = await notesRes.json();
			const categoriesData = await categoriesRes.json();

			if (
				!notesRes.ok ||
				!notesData.success ||
				!Array.isArray(notesData.data)
			) {
				throw new Error(notesData.error || "Failed to resolve notes");
			}

			let casError = "";
			let nextCas = "";
			if (casNumberEnabled) {
				const normalizedCas = normalizeCasNumber(proposal.casNumber);
				if (!isValidCasNumber(normalizedCas)) {
					casError = "CAS number must look like 6790-58-5";
				} else {
					nextCas = normalizedCas ?? "";
				}
			}

			const suggested = proposal.suggestedCategory.trim().toLowerCase();
			let nextCategoryIsOther = true;
			let nextCategoryId: number | null = null;
			let nextOtherCategoryName = toTitleCaseWords(proposal.suggestedCategory);

			if (
				categoriesRes.ok &&
				categoriesData.success &&
				Array.isArray(categoriesData.data)
			) {
				const categories = categoriesData.data as {
					id: number;
					name: string;
				}[];
				const match = categories.find(
					(c) => c.name.toLowerCase() === suggested,
				);
				if (match) {
					nextCategoryIsOther = false;
					nextCategoryId = match.id;
					nextOtherCategoryName = "";
				}
			}

			if (bottleLabelEnabled) {
				setLabel(proposal.suggestedLabel);
			} else {
				setLabel("");
			}
			setName(nameFromAgentProposal(proposal.nameAsEntered));
			setMaterialNature(materialNatureEnabled ? proposal.materialNature : "");
			setNoteType(proposal.noteType);
			setNotes(notesData.data as SelectedNote[]);
			setCasNumber(nextCas);
			setCategoryIsOther(nextCategoryIsOther);
			setSelectedCategoryId(nextCategoryId);
			setOtherCategoryName(nextOtherCategoryName);
			setError(casError);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to apply agent proposal",
			);
			throw err;
		} finally {
			setIsApplyingProposal(false);
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

		const normalizedCas = casNumberEnabled
			? normalizeCasNumber(casNumber)
			: null;
		if (casNumberEnabled && !isValidCasNumber(normalizedCas)) {
			setError("CAS number must look like 6790-58-5");
			return;
		}

		if (!selectedCategoryId && !(categoryIsOther && otherCategoryName.trim())) {
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
		const missingColor = notes.find((n) => n.isNew && !n.color);
		if (missingColor) {
			setError(`Pick a color for note "${missingColor.name}"`);
			return;
		}
		if (error) {
			setError(error);
			return;
		}

		try {
			let categoryId = selectedCategoryId;

			if (categoryIsOther) {
				const catResponse = await authedFetch("/api/categories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: otherCategoryName.trim() }),
				});
				const catData = await catResponse.json();
				if (!catResponse.ok || !catData.success) {
					setError(catData.error || "Failed to create category");
					return;
				}
				categoryId = catData.data.id as number;
				setSelectedCategoryId(categoryId);

				await authedFetch("/api/user-settings", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						category_colors: {
							[otherCategoryName.trim().toLowerCase()]: otherCategoryColor,
						},
					}),
				});
			}

			const response = await authedFetch("/api/raw-materials", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label: bottleLabelEnabled ? label.trim() || null : null,
					name,
					cas_number: normalizedCas,
					category_id: categoryId,
					note_type: noteType,
					material_nature:
						materialNatureEnabled && materialNature ? materialNature : null,
					notes: notes.map((n) => ({
						name: n.name,
						color: n.color,
						isNew: n.isNew === true,
					})),
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
			setSelectedCategoryId(null);
			setCategoryIsOther(false);
			setOtherCategoryName("");
			setOtherCategoryColor(NEUTRAL_CATEGORY_COLOR);
			setNoteType("");
			setMaterialNature("");
			setNotes([]);
			setSelectedIfraStatus(null);
			notifyNavEligibilityUpdated({ hasRawMaterials: true });
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
			cogButtonHash="raw-materials-settings"
			headerHints={[
				HEADER_HINT_IDS.CAS_NUMBER,
				HEADER_HINT_IDS.RAW_MATERIALS_BOTTLE_LABEL,
				HEADER_HINT_IDS.MATERIAL_NATURE,
			]}
		>
			<div
				className={`dashboardSplitLayout ${isSidebarCollapsed ? "isSidebarCollapsed" : ""}`}
			>
				<div className="w-full px-20 relative">
					{isApplyingProposal && (
						<div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-slate-950/60 backdrop-blur-[1px]">
							<p className="text-sm text-slate-200">
								Resolving notes and filling the form…
							</p>
						</div>
					)}
					<form
						onSubmit={handleSubmit}
						className={`${styles.formContainer} space-y-6 bg-[#10151C] py-8 px-6 rounded-lg border border-[#464859] ${
							isApplyingProposal ? "pointer-events-none opacity-60" : ""
						}`}
					>
						<div className="space-y-4">
							<div>
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
							</div>

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

							{ifraStatuses.length > 0 && (
								<div
									className={`flex items-center gap-2 mt-2 ${styles.noteChipContainer}`}
								>
									<span className="text-sm text-gray-500">IFRA:</span>
									{ifraStatuses.map((status) => (
										<IfraStatusLabel
											key={status}
											status={status}
											onClick={() => setSelectedIfraStatus(status)}
										/>
									))}
								</div>
							)}

							{showIdentityMismatch && (
								<p className="text-xs text-amber-300 mt-1">
									Name and CAS match different IFRA materials (
									{curatedMaterialMatch.fromName!.canonicalName} vs{" "}
									{curatedMaterialMatch.fromCas!.canonicalName}). One of them
									may be wrong.
								</p>
							)}

							{showCasMismatch && (
								<p className="text-xs text-amber-300 mt-1">
									The CAS number doesn&apos;t match the known CAS numbers for{" "}
									{curatedMaterialMatch.fromName!.canonicalName}. Please verify
									manually.
								</p>
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
								categoryId={selectedCategoryId}
								isOther={categoryIsOther}
								otherName={otherCategoryName}
								otherColor={otherCategoryColor}
								onCuratedChange={(id) => {
									setCategoryIsOther(false);
									setSelectedCategoryId(id);
									setOtherCategoryName("");
									setError("");
								}}
								onOtherSelected={() => {
									setCategoryIsOther(true);
									setSelectedCategoryId(null);
									setError("");
								}}
								onOtherNameChange={setOtherCategoryName}
								onOtherColorChange={setOtherCategoryColor}
								onClear={() => {
									setCategoryIsOther(false);
									setSelectedCategoryId(null);
									setOtherCategoryName("");
								}}
								required
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
								<button
									type="submit"
									className={styles.formSubmitButton}
									disabled={isApplyingProposal}
								>
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

					{selectedIfraStatus && (
						<IfraRuleModal
							status={selectedIfraStatus}
							entries={selectedIfraEntries}
							onClose={() => setSelectedIfraStatus(null)}
						/>
					)}
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
