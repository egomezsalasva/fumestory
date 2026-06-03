import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { z } from "zod";
import type { CompositionFormPrefill } from "@/agent/composition-chat/compositionFormPrefill";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { fetchAndConvertProposalToIngredients } from "@/agent/utils/proposalToIngredients";
import { TextInput } from "@/components/TextInput";
import { Select } from "@/components/Select";
import { LabelInput } from "@/components/LabelInput";
import { FormulaIngredientsFields } from "@/components/FormulaIngredientsFields";
import { type Ingredient } from "@/hooks/useFormulaIngredients";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { CompositionAgentPanel } from "@/agent/ui/CompositionAgentPanel";
import styles from "@/components/Form.module.css";
import SuccessMessage from "@/components/SuccessMessage";

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;

type UserSettingsResponse = {
	success?: boolean;
	data?: {
		composition_agent_collapsed?: boolean;
	};
	error?: string;
};

export const Route = createFileRoute("/_dashboard/add-composition")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Composition" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AddComposition,
});

function AddComposition() {
	const [name, setName] = useState("");
	const [label, setLabel] = useState("");
	const [type, setType] = useState<"trial" | "accord" | "perfume">("trial");
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [prefillIngredients, setPrefillIngredients] = useState<
		Ingredient[] | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formResetKey, setFormResetKey] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

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
					res.ok && json?.data?.composition_agent_collapsed === true;
				if (!cancelled) {
					setIsSidebarCollapsed(collapsed);
				}
			} catch {
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
		if (isSidebarCollapsed === null) return;

		const next = !isSidebarCollapsed;
		setIsSidebarCollapsed(next);

		try {
			await authedFetch("/api/user-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ composition_agent_collapsed: next }),
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
			body: JSON.stringify({ composition_agent_collapsed: true }),
		});
	};

	const handleApplyProposal = async (
		proposal: SuggestAnyFormulaProposal,
		inventoryOnlyTotalWeight?: string,
		formPrefill?: CompositionFormPrefill,
	) => {
		if (!inventoryOnlyTotalWeight) {
			setError("Missing total weight for this formula.");
			return;
		}

		setError(null);
		setSuccess(false);

		const { ingredients: nextIngredients, errors } =
			await fetchAndConvertProposalToIngredients(
				proposal,
				inventoryOnlyTotalWeight,
			);

		if (errors.length > 0) {
			setError(errors.join(" "));
			return;
		}

		if (formPrefill) {
			setType(formPrefill.type);
			setName(formPrefill.suggestedName);
		}

		setPrefillIngredients(nextIngredients);
		setFormResetKey((k) => k + 1);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		const compositionData = {
			name,
			type,
			label: label.trim() || null,
			ingredients: ingredients
				.filter((ing) => ing.dilution_id !== null)
				.map((ing) => ({
					dilution_id: ing.dilution_id,
					weight_grams: parseFloat(ing.weight_grams) || 0,
					formula_percentage: parseFloat(ing.formula_percentage) || 0,
				})),
		};

		try {
			const response = await authedFetch("/api/compositions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(compositionData),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.error || "Failed to create composition");
				setIsSubmitting(false);
				return;
			}

			setName("");
			setLabel("");
			setType("trial");
			setIngredients([]);
			setPrefillIngredients(null);
			setFormResetKey((k) => k + 1);
			setSuccess(true);
			setIsSubmitting(false);
		} catch {
			setError("An error occurred while creating the composition");
			setIsSubmitting(false);
		}
	};

	if (isSidebarCollapsed === null) {
		return (
			<DashboardLayout
				title="Compositions / Add Composition"
				backButton={{ to: "/compositions" }}
				agentToggle={true}
			>
				<></>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout
			title="Compositions / Add Composition"
			backButton={{ to: "/compositions" }}
			agentToggle={true}
			onAgentToggleClick={handleToggleSidebar}
		>
			<div
				className={`dashboardSplitLayout ${isSidebarCollapsed ? "isSidebarCollapsed" : ""}`}
			>
				<div className={styles.formContainerWrapper}>
					<form onSubmit={handleSubmit} className={styles.formContainer}>
						<TextInput
							label="Composition Name"
							value={name}
							onChange={setName}
							placeholder="e.g. Trial 1, Strawberry Accord, Creed Aventus Replica"
							required
						/>

						<LabelInput
							label="Bottle Label"
							value={label}
							onChange={(value) => {
								setLabel(value);
								setError(null);
							}}
							placeholder="e.g. CP1"
						/>

						<Select
							label="Composition Type"
							value={type}
							onChange={(value) => setType(value as typeof type)}
							options={[
								{ value: "trial", label: "Trial" },
								{ value: "accord", label: "Accord" },
								{ value: "perfume", label: "Perfume" },
							]}
							required
						/>

						<FormulaIngredientsFields
							key={formResetKey}
							onIngredientsChange={setIngredients}
							prefillIngredients={prefillIngredients}
						/>

						<div
							className={styles.formSubmitButtonContainer}
							style={{ marginTop: "0rem" }}
						>
							<button
								type="submit"
								disabled={!name || isSubmitting}
								className={styles.formSubmitButton}
							>
								{isSubmitting ? "Submitting..." : "+ Create Composition"}
							</button>
						</div>
						{success && (
							<SuccessMessage
								message="Composition created successfully!"
								link={{ text: "Go to Compositions", to: "/compositions" }}
								onClose={() => setSuccess(false)}
							/>
						)}
						{error && (
							<div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
								{error}
							</div>
						)}
					</form>
				</div>

				<div className="dashboardSplitSidebar">
					<div className="dashboardSplitSidebarSticky">
						<div className="dashboardSplitSidebarClip">
							<CompositionAgentPanel
								onStartOverClick={() => setSuccess(false)}
								onApplyProposal={handleApplyProposal}
								hidePanel={handleCloseSidebar}
							/>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
