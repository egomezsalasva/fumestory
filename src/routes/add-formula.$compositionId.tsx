import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FormulaIngredientsFields } from "@/components/FormulaIngredientsFields";
import { type Ingredient } from "@/hooks/useFormulaIngredients";
import { authedFetch } from "@/utils/authed-fetch";

export const Route = createFileRoute("/add-formula/$compositionId")({
	component: AddFormula,
});

function AddFormula() {
	const { compositionId } = Route.useParams();

	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [prefillIngredients, setPrefillIngredients] = useState<
		Ingredient[] | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isAutofilling, setIsAutofilling] = useState(false);

	const handleAutofillFromPrevious = async () => {
		setError(null);
		setIsAutofilling(true);

		try {
			const res = await authedFetch(`/api/compositions/${compositionId}`);
			const json = await res.json();

			if (!res.ok) {
				setError(json.error || "Failed to load previous formula");
				return;
			}

			const formulas = json?.data?.formulas as
				| Array<{
						id: number;
						lines?: Array<{
							dilution_id: number;
							material_label: string;
							material_name: string;
							percentage: number;
							weight_grams: number;
						}>;
				  }>
				| undefined;

			if (!formulas || formulas.length === 0) {
				setError("No previous formula found for this composition");
				return;
			}

			const previous = formulas[formulas.length - 1];
			const lines = previous?.lines ?? [];

			if (lines.length === 0) {
				setError("Previous formula has no ingredient lines");
				return;
			}

			setPrefillIngredients(
				lines.map((line) => ({
					id: crypto.randomUUID(),
					raw_material_id: null,
					raw_material_name: line.material_name,
					dilution_id: line.dilution_id,
					dilution_percentage: null,
					weight_grams: String(line.weight_grams),
					formula_percentage: String(line.percentage),
					displayText: `${line.material_name}`,
				})),
			);
		} catch {
			setError("Failed to autofill from previous formula");
		} finally {
			setIsAutofilling(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		const formulaData = {
			ingredients: ingredients
				.filter((ing) => ing.dilution_id !== null)
				.map((ing) => ({
					dilution_id: ing.dilution_id!,
					weight_grams: parseFloat(ing.weight_grams) || 0,
					formula_percentage: parseFloat(ing.formula_percentage) || 0,
				})),
		};

		try {
			const response = await authedFetch(`/api/compositions/${compositionId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formulaData),
			});

			const result = await response.json();
			if (!response.ok) {
				setError(result.error || "Failed to create mod");
				setIsSubmitting(false);
				return;
			}

			setSuccess(true);
			setIsSubmitting(false);
		} catch {
			setError("An error occurred while creating the mod");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center gap-4 mb-7">
					<Link
						to="/composition/$compositionId"
						params={{ compositionId }}
						className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
					>
						← Back
					</Link>
					<h1 className="text-2xl font-bold text-white">Add Formula</h1>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700"
				>
					<FormulaIngredientsFields
						onIngredientsChange={setIngredients}
						prefillIngredients={prefillIngredients}
						headerRight={
							<button
								type="button"
								onClick={handleAutofillFromPrevious}
								disabled={isAutofilling || isSubmitting}
								className="px-2.5 py-1.5 rounded-md bg-slate-700 text-xs text-slate-200 hover:bg-slate-600 transition-colors border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isAutofilling
									? "Autofilling..."
									: "Autofill with previous formula"}
							</button>
						}
					/>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Submitting..." : "Create Formula"}
					</button>
				</form>

				{error && (
					<div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
						Formula created successfully!
					</div>
				)}
			</div>
		</div>
	);
}
