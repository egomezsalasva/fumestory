import { useEffect } from "react";
import { DilutionAutocomplete } from "@/components/DilutionAutocomplete";
import { NumberInput } from "@/components/NumberInput";
import {
	type Ingredient,
	useFormulaIngredients,
} from "@/hooks/useFormulaIngredients";

type Props = {
	onIngredientsChange: (ingredients: Ingredient[]) => void;
	prefillIngredients?: Ingredient[] | null;
	headerRight?: React.ReactNode;
};

export function FormulaIngredientsFields({
	onIngredientsChange,
	prefillIngredients,
	headerRight,
}: Props) {
	const {
		ingredients,
		setIngredients,
		totalWeight,
		addIngredient,
		removeIngredient,
		updateIngredient,
		updateWeight,
		updatePercentage,
		updateTotalWeight,
	} = useFormulaIngredients();

	useEffect(() => {
		onIngredientsChange(ingredients);
	}, [ingredients, onIngredientsChange]);

	useEffect(() => {
		if (!prefillIngredients || prefillIngredients.length === 0) return;
		setIngredients(prefillIngredients);
	}, [prefillIngredients, setIngredients]);

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between gap-3">
				<label className="block text-sm font-medium text-slate-300">
					Ingredients
				</label>
				{headerRight}
			</div>

			{ingredients.map((ingredient, index) => (
				<div key={ingredient.id} className="flex gap-3 items-end">
					<div className="flex-1">
						<DilutionAutocomplete
							label={index === 0 ? "Material & Dilution" : ""}
							value={ingredient.displayText}
							onSelect={(dilutionId, materialId, materialName, percentage) => {
								const ok = updateIngredient(
									ingredient.id,
									dilutionId,
									materialId,
									materialName,
									percentage,
								);
								if (!ok) alert("This dilution is already added to the formula");
							}}
							excludeDilutionIds={ingredients
								.filter(
									(ing) => ing.dilution_id !== null && ing.id !== ingredient.id,
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
									onChange={(value) => updatePercentage(ingredient.id, value)}
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
	);
}
