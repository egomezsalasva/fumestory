import { useState } from "react";

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

	const addIngredient = () =>
		setIngredients((prev) => [...prev, emptyIngredient()]);

	const removeIngredient = (id: string) => {
		const remaining = ingredients.filter((ing) => ing.id !== id);
		const newTotal = remaining.reduce(
			(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
			0,
		);
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

	const totalWeight = ingredients.reduce(
		(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
		0,
	);

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
	};

	const updatePercentage = (ingredientId: string, percentage: string) => {
		const percentNum = percentage === "" ? 0 : parseFloat(percentage);
		if (isNaN(percentNum) || percentNum < 0 || percentNum > 100) return;

		const otherTotal = ingredients.reduce((sum, ing) => {
			if (ing.id !== ingredientId)
				return sum + (parseFloat(ing.weight_grams) || 0);
			return sum;
		}, 0);

		if (percentNum === 0 || percentNum === 100) {
			let newWeight = "0";
			if (percentNum === 100 && otherTotal === 0) {
				const currentWeight = parseFloat(
					ingredients.find((i) => i.id === ingredientId)?.weight_grams || "1",
				);
				newWeight =
					isNaN(currentWeight) || currentWeight === 0
						? "1"
						: currentWeight.toString();
			}
			const updated = ingredients.map((ing) => {
				if (ing.id === ingredientId)
					return {
						...ing,
						weight_grams: newWeight,
						formula_percentage: percentage,
					};
				const w = parseFloat(ing.weight_grams) || 0;
				const total = parseFloat(newWeight) + otherTotal;
				return {
					...ing,
					formula_percentage: total > 0 ? ((w / total) * 100).toString() : "0",
				};
			});
			setIngredients(updated);
			return;
		}

		const newWeight = (otherTotal * percentNum) / (100 - percentNum);
		const updated = ingredients.map((ing) => {
			if (ing.id === ingredientId)
				return {
					...ing,
					weight_grams: newWeight.toString(),
					formula_percentage: percentage,
				};
			const w = parseFloat(ing.weight_grams) || 0;
			const total = newWeight + otherTotal;
			return {
				...ing,
				formula_percentage: total > 0 ? ((w / total) * 100).toString() : "0",
			};
		});
		setIngredients(updated);
	};

	const updateTotalWeight = (newTotalStr: string) => {
		const newTotal = newTotalStr === "" ? 0 : parseFloat(newTotalStr);
		if (isNaN(newTotal) || newTotal < 0) return;

		setIngredients((prev) =>
			prev.map((ing) => {
				const p = parseFloat(ing.formula_percentage) || 0;
				return { ...ing, weight_grams: ((newTotal * p) / 100).toString() };
			}),
		);
	};

	return {
		ingredients,
		setIngredients,
		totalWeight,
		addIngredient,
		removeIngredient,
		updateIngredient,
		updateWeight,
		updatePercentage,
		updateTotalWeight,
	};
}
