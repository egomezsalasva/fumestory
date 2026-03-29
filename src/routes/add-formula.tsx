import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TextInput } from "@/components/TextInput";
import { Select } from "@/components/Select";
import { DilutionAutocomplete } from "@/components/DilutionAutocomplete";
import { NumberInput } from "@/components/NumberInput";
import { authedFetch } from "@/utils/authed-fetch";

export const Route = createFileRoute("/add-formula")({
	component: AddFormula,
});

type Ingredient = {
	id: string;
	raw_material_id: number | null;
	raw_material_name: string;
	dilution_id: number | null;
	dilution_percentage: number | null;
	weight_grams: string;
	formula_percentage: string;
	displayText: string;
};

function AddFormula() {
	const [name, setName] = useState("");
	const [type, setType] = useState<"trial" | "accord" | "perfume">("trial");
	const [ingredients, setIngredients] = useState<Ingredient[]>([
		{
			id: crypto.randomUUID(),
			raw_material_id: null,
			raw_material_name: "",
			dilution_id: null,
			dilution_percentage: null,
			weight_grams: "",
			formula_percentage: "",
			displayText: "",
		},
	]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const addIngredient = () => {
		setIngredients([
			...ingredients,
			{
				id: crypto.randomUUID(),
				raw_material_id: null,
				raw_material_name: "",
				dilution_id: null,
				dilution_percentage: null,
				weight_grams: "",
				formula_percentage: "",
				displayText: "",
			},
		]);
	};

	const removeIngredient = (id: string) => {
		const remainingIngredients = ingredients.filter((ing) => ing.id !== id);

		// Recalculate total weight after removal
		const newTotal = remainingIngredients.reduce((sum, ing) => {
			const w = parseFloat(ing.weight_grams);
			return sum + (isNaN(w) ? 0 : w);
		}, 0);

		// Recalculate percentages for all remaining ingredients
		const updatedIngredients = remainingIngredients.map((ing) => {
			const weightNum = parseFloat(ing.weight_grams);
			const weight = isNaN(weightNum) ? 0 : weightNum;
			const percentage =
				newTotal > 0 ? ((weight / newTotal) * 100).toString() : "0";
			return { ...ing, formula_percentage: percentage };
		});

		setIngredients(updatedIngredients);
	};

	const updateIngredient = (
		id: string,
		dilutionId: number,
		materialId: number,
		materialName: string,
		percentage: number,
	) => {
		const isDuplicate = ingredients.some(
			(ing) => ing.id !== id && ing.dilution_id === dilutionId,
		);

		if (isDuplicate) {
			alert("This dilution is already added to the formula");
			return;
		}

		const displayText = `${materialName} - ${percentage}%`;

		setIngredients(
			ingredients.map((ing) =>
				ing.id === id
					? {
							...ing,
							raw_material_id: materialId,
							raw_material_name: materialName,
							dilution_id: dilutionId,
							dilution_percentage: percentage,
							displayText: displayText,
						}
					: ing,
			),
		);
	};

	const totalWeight = ingredients.reduce(
		(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
		0,
	);

	const updateWeight = (ingredientId: string, weight: string) => {
		const weightNum = weight === "" ? 0 : parseFloat(weight);
		if (isNaN(weightNum)) return;

		const updatedIngredients = ingredients.map((ing) => {
			if (ing.id === ingredientId) {
				// Calculate new total weight
				const newTotal = ingredients.reduce((sum, i) => {
					if (i.id === ingredientId) return sum + weightNum;
					const w = parseFloat(i.weight_grams);
					return sum + (isNaN(w) ? 0 : w);
				}, 0);
				// Calculate percentage based on new total
				const percentage =
					newTotal > 0 ? ((weightNum / newTotal) * 100).toString() : "0";
				return { ...ing, weight_grams: weight, formula_percentage: percentage };
			}

			// Recalculate percentages for all other ingredients
			const ingWeightNum = parseFloat(ing.weight_grams);
			const ingWeight = isNaN(ingWeightNum) ? 0 : ingWeightNum;

			const newTotal = ingredients.reduce((sum, i) => {
				if (i.id === ingredientId) return sum + weightNum;
				const w = parseFloat(i.weight_grams);
				return sum + (isNaN(w) ? 0 : w);
			}, 0);
			const percentage =
				newTotal > 0 ? ((ingWeight / newTotal) * 100).toString() : "0";
			return { ...ing, formula_percentage: percentage };
		});
		setIngredients(updatedIngredients);
	};

	const updatePercentage = (ingredientId: string, percentage: string) => {
		const percentNum = percentage === "" ? 0 : parseFloat(percentage);
		if (isNaN(percentNum) || percentNum < 0 || percentNum > 100) return;

		// Calculate what the new weight should be based on percentage
		const otherIngredientsTotal = ingredients.reduce((sum, ing) => {
			if (ing.id !== ingredientId) {
				const w = parseFloat(ing.weight_grams);
				return sum + (isNaN(w) ? 0 : w);
			}
			return sum;
		}, 0);

		if (percentNum === 0 || percentNum === 100) {
			// Handle edge cases
			let newWeight = "0";
			if (percentNum === 100 && otherIngredientsTotal === 0) {
				// If this is the only ingredient and we want 100%, keep existing weight or set to 1
				const currentWeight = parseFloat(
					ingredients.find((i) => i.id === ingredientId)?.weight_grams || "1",
				);
				newWeight =
					isNaN(currentWeight) || currentWeight === 0
						? "1"
						: currentWeight.toString();
			} else if (percentNum === 0) {
				newWeight = "0";
			}

			const updatedIngredients = ingredients.map((ing) => {
				if (ing.id === ingredientId) {
					return {
						...ing,
						weight_grams: newWeight,
						formula_percentage: percentage,
					};
				}
				// Recalculate percentages for other ingredients
				const weightNum = parseFloat(ing.weight_grams);
				const weight = isNaN(weightNum) ? 0 : weightNum;
				const newTotal = parseFloat(newWeight) + otherIngredientsTotal;
				const newPercentage =
					newTotal > 0 ? ((weight / newTotal) * 100).toString() : "0";
				return { ...ing, formula_percentage: newPercentage };
			});
			setIngredients(updatedIngredients);
			return;
		}

		// If this should be X%, and others total Y grams, then:
		// new_weight / (new_weight + Y) = X/100
		// new_weight = Y * X / (100 - X)
		const newWeight = (otherIngredientsTotal * percentNum) / (100 - percentNum);

		const updatedIngredients = ingredients.map((ing) => {
			if (ing.id === ingredientId) {
				return {
					...ing,
					weight_grams: newWeight.toString(),
					formula_percentage: percentage,
				};
			}
			// Recalculate percentages for other ingredients
			const weightNum = parseFloat(ing.weight_grams);
			const weight = isNaN(weightNum) ? 0 : weightNum;
			const newTotal = newWeight + otherIngredientsTotal;
			const newPercentage =
				newTotal > 0 ? ((weight / newTotal) * 100).toString() : "0";
			return { ...ing, formula_percentage: newPercentage };
		});
		setIngredients(updatedIngredients);
	};

	const updateTotalWeight = (newTotalStr: string) => {
		const newTotal = newTotalStr === "" ? 0 : parseFloat(newTotalStr);
		if (isNaN(newTotal) || newTotal < 0) return;

		// Recalculate each ingredient's weight based on its percentage
		const updatedIngredients = ingredients.map((ing) => {
			const percentNum = parseFloat(ing.formula_percentage);
			const percent = isNaN(percentNum) ? 0 : percentNum;

			// Calculate new weight based on percentage of new total
			const newWeight = (newTotal * percent) / 100;

			return { ...ing, weight_grams: newWeight.toString() };
		});

		setIngredients(updatedIngredients);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		const formulaData = {
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
			const response = await authedFetch("/api/formulas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formulaData),
			});

			const result = await response.json();

			if (!response.ok) {
				setError(result.error || "Failed to create formula");
				setIsSubmitting(false);
				return;
			}

			setSuccess(true);
			setIsSubmitting(false);
		} catch (err) {
			setError("An error occurred while creating the formula");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center gap-4 mb-7">
					<Link
						to="/formulas"
						className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
					>
						← Back
					</Link>
					<h1 className="text-2xl font-bold text-white">Create Formula</h1>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700"
				>
					<TextInput
						label="Formula Name"
						value={name}
						onChange={setName}
						placeholder="e.g., Trial 1, My Accord"
					/>

					<Select
						label="Formula Type"
						value={type}
						onChange={(value) => setType(value as typeof type)}
						options={[
							{ value: "trial", label: "Trial" },
							{ value: "accord", label: "Accord" },
							{ value: "perfume", label: "Perfume" },
						]}
					/>

					<div className="space-y-3">
						<label className="block text-sm font-medium text-slate-300">
							Ingredients
						</label>

						{ingredients.map((ingredient, index) => (
							<div key={ingredient.id} className="flex gap-3 items-end">
								<div className="flex-1">
									<DilutionAutocomplete
										label={index === 0 ? "Material & Dilution" : ""}
										value={ingredient.displayText}
										onSelect={(
											dilutionId,
											materialId,
											materialName,
											percentage,
										) =>
											updateIngredient(
												ingredient.id,
												dilutionId,
												materialId,
												materialName,
												percentage,
											)
										}
										excludeDilutionIds={ingredients
											.filter(
												(ing) =>
													ing.dilution_id !== null && ing.id !== ingredient.id,
											)
											.map((ing) => ing.dilution_id!)}
									/>
								</div>

								{ingredient.dilution_id && (
									<>
										<div className="w-28">
											<NumberInput
												label={index === 0 ? "Weight (g)" : ""}
												value={ingredient.weight_grams}
												onChange={(value) => updateWeight(ingredient.id, value)}
												placeholder="0"
												min={0}
												step={0.01}
											/>
										</div>
										<div className="w-24">
											<NumberInput
												label={index === 0 ? "%" : ""}
												value={ingredient.formula_percentage}
												onChange={(value) =>
													updatePercentage(ingredient.id, value)
												}
												placeholder="0"
												min={0}
												max={100}
												step={0.01}
											/>
										</div>
									</>
								)}

								<button
									type="button"
									onClick={() => removeIngredient(ingredient.id)}
									disabled={ingredients.length === 1}
									className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
								>
									✕
								</button>
							</div>
						))}

						<button
							type="button"
							onClick={addIngredient}
							className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
						>
							+ Add Ingredient
						</button>

						<div className="flex items-end gap-3 pt-3 border-t border-slate-700">
							<span className="text-md font-medium text-slate-300 pb-2">
								Total (g)
							</span>
							<div className="w-28">
								<NumberInput
									label=""
									value={Number(totalWeight.toFixed(5)).toString()}
									onChange={updateTotalWeight}
									placeholder="0"
									min={0}
									step={0.01}
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						disabled={!name || isSubmitting}
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
