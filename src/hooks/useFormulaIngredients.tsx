import { useCallback, useState } from "react";

export type Ingredient = {
	id: string;
	raw_material_id: number | null;
	raw_material_name: string;
	dilution_id: number | null;
	dilution_percentage: number | null;
	weight_grams: string;
	formula_percentage: string;
	displayText: string;
};

const emptyIngredient = (): Ingredient => ({
	id: crypto.randomUUID(),
	raw_material_id: null,
	raw_material_name: "",
	dilution_id: null,
	dilution_percentage: null,
	weight_grams: "",
	formula_percentage: "",
	displayText: "",
});

export function useFormulaIngredients(initial?: Ingredient[]) {
	const [ingredients, setIngredients] = useState<Ingredient[]>(
		initial?.length ? initial : [emptyIngredient()],
	);
	const [targetTotalWeight, setTargetTotalWeight] = useState(() =>
		(
			initial?.reduce(
				(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
				0,
			) ?? 0
		).toString(),
	);

	const addIngredient = () =>
		setIngredients((prev) => [...prev, emptyIngredient()]);

	const removeIngredient = (id: string) => {
		const remaining = ingredients.filter((ing) => ing.id !== id);
		const newTotal = remaining.reduce(
			(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
			0,
		);
		setTargetTotalWeight(newTotal.toString());
		setIngredients(
			remaining.map((ing) => {
				const w = parseFloat(ing.weight_grams) || 0;
				return {
					...ing,
					formula_percentage:
						newTotal > 0 ? ((w / newTotal) * 100).toString() : "0",
				};
			}),
		);
	};

	const updateIngredient = (
		id: string,
		dilutionId: number,
		materialId: number,
		materialName: string,
		percentage: number,
	) => {
		const duplicate = ingredients.some(
			(ing) => ing.id !== id && ing.dilution_id === dilutionId,
		);
		if (duplicate) return false;

		const displayText = `${materialName} - ${percentage}%`;
		setIngredients((prev) =>
			prev.map((ing) =>
				ing.id === id
					? {
							...ing,
							raw_material_id: materialId,
							raw_material_name: materialName,
							dilution_id: dilutionId,
							dilution_percentage: percentage,
							displayText,
						}
					: ing,
			),
		);
		return true;
	};

	const updateWeight = (ingredientId: string, weight: string) => {
		const weightNum = weight === "" ? 0 : parseFloat(weight);
		if (isNaN(weightNum)) return;

		const updated = ingredients.map((ing) => {
			if (ing.id === ingredientId) {
				const newTotal = ingredients.reduce((sum, i) => {
					if (i.id === ingredientId) return sum + weightNum;
					return sum + (parseFloat(i.weight_grams) || 0);
				}, 0);
				const p =
					newTotal > 0 ? ((weightNum / newTotal) * 100).toString() : "0";
				return { ...ing, weight_grams: weight, formula_percentage: p };
			}
			const w = parseFloat(ing.weight_grams) || 0;
			const newTotal = ingredients.reduce((sum, i) => {
				if (i.id === ingredientId) return sum + weightNum;
				return sum + (parseFloat(i.weight_grams) || 0);
			}, 0);
			const p = newTotal > 0 ? ((w / newTotal) * 100).toString() : "0";
			return { ...ing, formula_percentage: p };
		});
		setIngredients(updated);
		setTargetTotalWeight(
			updated
				.reduce((sum, ing) => sum + (parseFloat(ing.weight_grams) || 0), 0)
				.toString(),
		);
	};

	const updateTotalWeight = (newTotalStr: string) => {
		const newTotal = newTotalStr === "" ? 0 : parseFloat(newTotalStr);
		if (isNaN(newTotal) || newTotal < 0) return;
		setTargetTotalWeight(newTotalStr);
		setIngredients((prev) =>
			prev.map((ing) => {
				const p = parseFloat(ing.formula_percentage) || 0;
				return { ...ing, weight_grams: ((newTotal * p) / 100).toString() };
			}),
		);
	};

	const getTotalPercentage = (list: Ingredient[]) =>
		list.reduce(
			(sum, ing) => sum + (parseFloat(ing.formula_percentage) || 0),
			0,
		);

	const totalPercentage = getTotalPercentage(ingredients);

	const updatePercentageFromTotal = (
		ingredientId: string,
		percentage: string,
	) => {
		const percentNum = percentage === "" ? 0 : parseFloat(percentage);
		if (isNaN(percentNum) || percentNum < 0 || percentNum > 100) return;
		const newWeight = ((parseFloat(targetTotalWeight) || 0) * percentNum) / 100;
		setIngredients((prev) =>
			prev.map((ing) =>
				ing.id === ingredientId
					? {
							...ing,
							formula_percentage: percentage,
							weight_grams: newWeight.toString(),
						}
					: ing,
			),
		);
	};

	const recalculatePercentagesFromWeights = () =>
		setIngredients((prev) => {
			const total = prev.reduce(
				(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
				0,
			);
			if (total <= 0) return prev;
			setTargetTotalWeight(total.toString());
			return prev.map((ing) => {
				const w = parseFloat(ing.weight_grams) || 0;
				return { ...ing, formula_percentage: ((w / total) * 100).toString() };
			});
		});

	const setAllIngredients = useCallback((next: Ingredient[]) => {
		setIngredients(next);
		setTargetTotalWeight(
			next
				.reduce((sum, ing) => sum + (parseFloat(ing.weight_grams) || 0), 0)
				.toString(),
		);
	}, []);

	return {
		ingredients,
		setIngredients,
		totalWeight: targetTotalWeight,
		addIngredient,
		removeIngredient,
		updateIngredient,
		updateWeight,
		updateTotalWeight,
		totalPercentage,
		updatePercentageFromTotal,
		recalculatePercentagesFromWeights,
		setAllIngredients,
	};
}
