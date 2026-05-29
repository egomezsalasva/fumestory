import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TextInput } from "@/components/TextInput";
import { Select } from "@/components/Select";
import { FormulaIngredientsFields } from "@/components/FormulaIngredientsFields";
import { type Ingredient } from "@/hooks/useFormulaIngredients";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { CompositionAgentPanel } from "@/agent/ui/CompositionAgentPanel";
import styles from "@/components/Form.module.css";
import SuccessMessage from "@/components/SuccessMessage";

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
	const [type, setType] = useState<"trial" | "accord" | "perfume">("trial");
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formResetKey, setFormResetKey] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		const compositionData = {
			name,
			type,
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
			setType("trial");
			setIngredients([]);
			setFormResetKey((k) => k + 1);
			setSuccess(true);
			setIsSubmitting(false);
		} catch {
			setError("An error occurred while creating the composition");
			setIsSubmitting(false);
		}
	};

	return (
		<DashboardLayout
			title="Compositions / Add Composition"
			backButton={{ to: "/compositions" }}
		>
			<div className="dashboardSplitLayout">
				<div className={styles.formContainerWrapper}>
					<form onSubmit={handleSubmit} className={styles.formContainer}>
						<TextInput
							label="Composition Name"
							value={name}
							onChange={setName}
							placeholder="e.g. Trial 1, Strawberry Accord, Creed Aventus Replica"
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
						/>

						<FormulaIngredientsFields
							key={formResetKey}
							onIngredientsChange={setIngredients}
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
						<CompositionAgentPanel />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
