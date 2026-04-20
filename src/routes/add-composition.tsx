import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TextInput } from "@/components/TextInput";
import { Select } from "@/components/Select";
import { FormulaIngredientsFields } from "@/components/FormulaIngredientsFields";
import { type Ingredient } from "@/hooks/useFormulaIngredients";
import { authedFetch } from "@/utils/authed-fetch";

export const Route = createFileRoute("/add-composition")({
	component: AddComposition,
});

function AddComposition() {
	const [name, setName] = useState("");
	const [type, setType] = useState<"trial" | "accord" | "perfume">("trial");
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
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

			setSuccess(true);
			setIsSubmitting(false);
		} catch {
			setError("An error occurred while creating the composition");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center gap-4 mb-7">
					<Link
						to="/compositions"
						className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
					>
						← Back
					</Link>
					<h1 className="text-2xl font-bold text-white">Create Composition</h1>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700"
				>
					<TextInput
						label="Composition Name"
						value={name}
						onChange={setName}
						placeholder="e.g., Trial 1, My Accord"
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

					<FormulaIngredientsFields onIngredientsChange={setIngredients} />

					<button
						type="submit"
						disabled={!name || isSubmitting}
						className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Submitting..." : "Create Composition"}
					</button>
				</form>

				{error && (
					<div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
						{error}
					</div>
				)}

				{success && (
					<div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
						Composition created successfully!
					</div>
				)}
			</div>
		</div>
	);
}
