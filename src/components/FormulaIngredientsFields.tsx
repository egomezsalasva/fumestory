import { useEffect, useState } from "react";
import { DilutionAutocomplete } from "@/components/DilutionAutocomplete";
import { NumberInput } from "@/components/NumberInput";
import {
	type Ingredient,
	useFormulaIngredients,
} from "@/hooks/useFormulaIngredients";
import styles from "@/components/Form.module.css";

type Props = {
	onIngredientsChange: (ingredients: Ingredient[]) => void;
	prefillIngredients?: Ingredient[] | null;
	headerRight?: React.ReactNode;
	styleHeader?: React.CSSProperties;
};

export function FormulaIngredientsFields({
	onIngredientsChange,
	prefillIngredients,
	headerRight,
	styleHeader,
}: Props) {
	const [isPercentMode, setIsPercentMode] = useState(false);
	const [showRecalculateModal, setShowRecalculateModal] = useState(false);
	const [percentLimitWarning, setPercentLimitWarning] = useState<string | null>(
		null,
	);
	const [percentDraftById, setPercentDraftById] = useState<
		Record<string, string>
	>({});
	const {
		ingredients,
		totalWeight,
		totalPercentage,
		updatePercentageFromTotal,
		addIngredient,
		removeIngredient,
		updateIngredient,
		updateWeight,
		updateTotalWeight,
		recalculatePercentagesFromWeights,
		setAllIngredients,
	} = useFormulaIngredients();

	const liveTotalPercentage = isPercentMode
		? ingredients.reduce((sum, ing) => {
				const raw = percentDraftById[ing.id] ?? ing.formula_percentage;
				return sum + (parseFloat(raw) || 0);
			}, 0)
		: totalPercentage;

	const totalWeightNum = parseFloat(totalWeight) || 0;
	const addedGrams = (totalWeightNum * liveTotalPercentage) / 100;
	const needsTotalWeight = isPercentMode && totalWeightNum === 0;
	const remainingPercent = 100 - liveTotalPercentage;
	const isPercentComplete = Math.abs(liveTotalPercentage - 100) < 0.0001;
	const shouldConfirmExitPercentMode = isPercentMode && !isPercentComplete;

	useEffect(() => {
		onIngredientsChange(ingredients);
	}, [ingredients, onIngredientsChange]);

	useEffect(() => {
		if (!prefillIngredients || prefillIngredients.length === 0) return;
		setAllIngredients(prefillIngredients);
	}, [prefillIngredients, setAllIngredients]);

	const formatTrimmed = (n: number) =>
		Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.?0+$/, "");

	const handleConfirmRecalculate = () => {
		recalculatePercentagesFromWeights();
		setIsPercentMode(false);
		setShowRecalculateModal(false);
		setPercentDraftById({});
		setPercentLimitWarning(null);
	};

	const handleCancelRecalculate = () => {
		setShowRecalculateModal(false);
	};

	const handleModeChange = (mode: "weight" | "percent") => {
		if (mode === "percent") {
			setIsPercentMode(true);
			return;
		}
		if (shouldConfirmExitPercentMode) {
			setShowRecalculateModal(true);
			return;
		}
		setIsPercentMode(false);
		setPercentLimitWarning(null);
	};

	const handlePercentageOnBlur = (
		ingredientId: string,
		input: HTMLInputElement,
	) => {
		const raw =
			percentDraftById[ingredientId] ??
			ingredients.find((i) => i.id === ingredientId)?.formula_percentage ??
			"";
		const current = raw === "" ? 0 : parseFloat(raw);
		if (isNaN(current)) return;

		const otherTotal = ingredients.reduce((sum, ing) => {
			if (ing.id === ingredientId) return sum;
			return sum + (parseFloat(ing.formula_percentage) || 0);
		}, 0);

		if (otherTotal + current > 100) {
			const maxAllowed = Math.max(0, 100 - otherTotal);
			setPercentLimitWarning(
				`Over 100%. Use ${formatTrimmed(maxAllowed)}% or less for this row.`,
			);
			input.focus();
			return;
		}

		setPercentLimitWarning(null);
		updatePercentageFromTotal(ingredientId, raw);
		setPercentDraftById((prev) => {
			const next = { ...prev };
			delete next[ingredientId];
			return next;
		});
	};

	const handlePercentageOnChange = (ingredientId: string, value: string) => {
		setPercentDraftById((prev) => ({ ...prev, [ingredientId]: value }));

		if (!isPercentMode) return;

		const current = value === "" ? 0 : parseFloat(value);
		if (isNaN(current)) {
			setPercentLimitWarning(null);
			return;
		}

		const otherTotal = ingredients.reduce((sum, ing) => {
			if (ing.id === ingredientId) return sum;
			return sum + (parseFloat(ing.formula_percentage) || 0);
		}, 0);

		if (otherTotal + current > 100) {
			const maxAllowed = Math.max(0, 100 - otherTotal);
			setPercentLimitWarning(
				`Over 100%. Use ${formatTrimmed(maxAllowed)}% or less for this row.`,
			);
			return;
		}

		setPercentLimitWarning(null);
	};

	const recalcBaseWeight = ingredients.reduce(
		(sum, ing) => sum + (parseFloat(ing.weight_grams) || 0),
		0,
	);
	const recalcPreview = ingredients
		.filter((ing) => ing.dilution_id !== null)
		.map((ing) => {
			const w = parseFloat(ing.weight_grams) || 0;
			const nextPct = recalcBaseWeight > 0 ? (w / recalcBaseWeight) * 100 : 0;
			return {
				id: ing.id,
				name: ing.displayText || "Ingredient",
				from: parseFloat(ing.formula_percentage) || 0,
				to: nextPct,
			};
		});

	return (
		<div className="space-y-3">
			<div
				className="flex items-center justify-between gap-3"
				style={styleHeader}
			>
				<label className={styles.formLabel} style={{ marginBottom: "0" }}>
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
									labelRight={
										index === 0 ? (
											<input
												type="radio"
												name="formula-mode"
												checked={!isPercentMode}
												onChange={() => handleModeChange("weight")}
												className="h-3.5 w-3.5 accent-slate-300"
												style={{
													marginBottom: "0.375rem",
												}}
											/>
										) : undefined
									}
									value={ingredient.weight_grams}
									onChange={(value) => updateWeight(ingredient.id, value)}
									placeholder="0"
									disabled={isPercentMode}
								/>
							</div>
							<div className="w-24">
								<NumberInput
									label={index === 0 ? "%" : ""}
									labelRight={
										index === 0 ? (
											<input
												type="radio"
												name="formula-mode"
												checked={isPercentMode}
												onChange={() => handleModeChange("percent")}
												className="h-3.5 w-3.5 accent-slate-300"
												style={{
													marginBottom: "0.375rem",
												}}
											/>
										) : undefined
									}
									value={
										percentDraftById[ingredient.id] ??
										ingredient.formula_percentage
									}
									onChange={(value) =>
										handlePercentageOnChange(ingredient.id, value)
									}
									placeholder="0"
									disabled={!isPercentMode}
									onBlur={(e) =>
										handlePercentageOnBlur(ingredient.id, e.currentTarget)
									}
								/>
							</div>
						</>
					)}

					<button
						type="button"
						onClick={() => removeIngredient(ingredient.id)}
						disabled={ingredients.length === 1}
						className={`${styles.formAddCircleButton} 	${ingredients.length === 1 ? styles.formAddCircleButtonRemoveDisabled : ""} ${styles.formAddCircleButtonRemove}`}
					>
						✕
					</button>
				</div>
			))}

			<div
				className={styles.formSubmitButtonContainer}
				style={{ margin: "1.5rem 0" }}
			>
				<button
					type="button"
					onClick={addIngredient}
					className={styles.formSubmitButton}
					style={{
						padding: "0.375rem 2.5rem",
						fontWeight: "400",
						fontSize: "0.875rem",
					}}
				>
					+ Add Ingredient
				</button>
			</div>

			<div className="flex items-end gap-3 pt-3 border-t border-slate-700">
				<span className="text-md font-medium text-slate-300 pb-2">
					Total (g)
				</span>
				<div className="w-15">
					<NumberInput
						label=""
						value={totalWeight}
						onChange={updateTotalWeight}
						placeholder="0"
						min={0}
						step={0.01}
					/>
				</div>
				{needsTotalWeight && (
					<p className="text-xs text-amber-300">
						Set total weight to use % mode (e.g. 1g).
					</p>
				)}
				{isPercentMode &&
					!needsTotalWeight &&
					!isPercentComplete &&
					!percentLimitWarning && (
						<p className="text-xs text-slate-300">
							{formatTrimmed(remainingPercent)}% remaining —{" "}
							{formatTrimmed(liveTotalPercentage)}% added (
							{formatTrimmed(addedGrams)}g / {formatTrimmed(totalWeightNum)}g)
						</p>
					)}
				{isPercentMode && percentLimitWarning && (
					<p className="text-xs text-amber-300">{percentLimitWarning}</p>
				)}
			</div>
			{showRecalculateModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
					<div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-4 space-y-3">
						<p className="text-sm text-slate-200">
							You are leaving % mode with a total that is not 100%. Recalculate
							will keep current weights and normalize percentages to 100% using{" "}
							{formatTrimmed(recalcBaseWeight)}g as the new base.
						</p>
						<p className="text-xs text-slate-400">
							Total base: {formatTrimmed(totalWeightNum)}g {"->"}{" "}
							{formatTrimmed(recalcBaseWeight)}g
						</p>
						{recalcPreview.length > 0 && (
							<div className="max-h-36 overflow-auto rounded border border-slate-700 bg-slate-900/40 p-2 text-xs text-slate-300 space-y-1">
								{recalcPreview.map((row) => (
									<div key={row.id}>
										{row.name}: {formatTrimmed(row.from)}% {"->"}{" "}
										{formatTrimmed(row.to)}%
									</div>
								))}
							</div>
						)}
						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={handleCancelRecalculate}
								className="px-3 py-1.5 rounded border border-slate-600 text-slate-300 hover:bg-slate-700"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleConfirmRecalculate}
								className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500"
							>
								Recalculate
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
