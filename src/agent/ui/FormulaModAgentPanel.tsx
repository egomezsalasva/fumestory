import { useEffect, useState } from "react";
import type { z } from "zod";
import {
	ChatPanel,
	type ChatChoiceOption,
	type ChatMessage,
} from "@/components/ChatPanel";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import type { Ingredient } from "@/hooks/useFormulaIngredients";
import { authedFetch } from "@/utils/authed-fetch";

type FormulaModAgentPanelProps = {
	compositionId: string;
	hidePanel: () => void;
	onApplyToForm?: (ingredients: Ingredient[]) => void;
	onFirstModSelected?: () => void;
};

type CompositionFormulaLine = {
	dilution_id: number;
	material_name: string;
	percentage: number;
	weight_grams: number;
};

type CompositionFormula = {
	id: number;
	mods?: string | null;
	lines?: CompositionFormulaLine[];
};

type CompositionResponse = {
	success?: boolean;
	error?: string;
	data?: {
		formulas?: CompositionFormula[];
	};
};

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;

type FormulaModApiResponse = {
	success?: boolean;
	reply?: string;
	proposal?: SuggestAnyFormulaProposal;
	allowApplyToForm?: boolean;
	error?: string;
};

const FORMULA_MODE_CHOICE = {
	KEEP_DILUTIONS: "keep_dilutions",
	INVENTORY_ADJUST: "inventory_adjust",
	SUGGEST_NEW: "suggest_new",
} as const;

const FORMULA_ACTION_CHOICE = {
	APPLY_TO_FORM: "apply_to_form",
	START_OVER: "start_over",
} as const;

type FormulaModeChoiceId =
	(typeof FORMULA_MODE_CHOICE)[keyof typeof FORMULA_MODE_CHOICE];

function isFormulaModeChoiceId(value: string): value is FormulaModeChoiceId {
	return (
		value === FORMULA_MODE_CHOICE.KEEP_DILUTIONS ||
		value === FORMULA_MODE_CHOICE.INVENTORY_ADJUST ||
		value === FORMULA_MODE_CHOICE.SUGGEST_NEW
	);
}

function parseMaterialAndDilution(materialName: string): {
	materialDisplayName: string;
	dilutionPercent: number;
} {
	const match = materialName.match(/^(.*)\s\((\d+(?:\.\d+)?)%\)$/);
	if (!match) {
		return {
			materialDisplayName: materialName,
			dilutionPercent: 10,
		};
	}
	return {
		materialDisplayName: match[1].trim(),
		dilutionPercent: Number(match[2]),
	};
}

function buildPrefillIngredients(
	lines: CompositionFormulaLine[],
): Ingredient[] {
	return lines.map((line) => {
		const parsed = parseMaterialAndDilution(line.material_name);
		return {
			id: crypto.randomUUID(),
			raw_material_id: null,
			raw_material_name: parsed.materialDisplayName,
			dilution_id: line.dilution_id,
			dilution_percentage: parsed.dilutionPercent,
			weight_grams: String(line.weight_grams),
			formula_percentage: String(line.percentage),
			displayText: parsed.materialDisplayName,
		};
	});
}

function buildPrefillIngredientsFromProposal(
	sourceLines: CompositionFormulaLine[],
	proposal: SuggestAnyFormulaProposal,
): Ingredient[] {
	const totalWeight = sourceLines.reduce(
		(sum, line) => sum + (Number(line.weight_grams) || 0),
		0,
	);

	const byMaterialName = new Map(
		sourceLines.map((line) => [line.material_name.trim().toLowerCase(), line]),
	);
	const byParsedName = new Map(
		sourceLines.map((line) => [
			parseMaterialAndDilution(line.material_name)
				.materialDisplayName.trim()
				.toLowerCase(),
			line,
		]),
	);

	const mapped: Array<Ingredient | null> = proposal.lines.map((line) => {
		const key = line.materialDisplayName.trim().toLowerCase();
		const matched = byMaterialName.get(key) ?? byParsedName.get(key);

		if (!matched) return null;

		const computedWeight = (totalWeight * line.formulaPercent) / 100;
		const roundedWeight = Math.round(computedWeight * 100) / 100;

		const ingredient: Ingredient = {
			id: crypto.randomUUID(),
			raw_material_id: null,
			raw_material_name: line.materialDisplayName,
			dilution_id: matched.dilution_id,
			dilution_percentage: line.dilutionPercent,
			weight_grams: String(roundedWeight),
			formula_percentage: String(line.formulaPercent),
			displayText: line.materialDisplayName,
		};

		return ingredient;
	});

	return mapped.filter((value): value is Ingredient => value !== null);
}

export function FormulaModAgentPanel({
	compositionId,
	hidePanel,
	onApplyToForm,
	onFirstModSelected,
}: FormulaModAgentPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content: "Loading available formula mods...",
		},
	]);

	const [choiceOptions, setChoiceOptions] = useState<ChatChoiceOption[] | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [availableFormulas, setAvailableFormulas] = useState<
		CompositionFormula[]
	>([]);
	const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(
		null,
	);
	const [changeRequest, setChangeRequest] = useState<string | null>(null);
	const [pendingApplyIngredients, setPendingApplyIngredients] = useState<
		Ingredient[] | null
	>(null);
	const [showStartOverAction, setShowStartOverAction] = useState(false);

	const hasUserResponded = messages.some((m) => m.role === "user");

	const buildModOptions = (
		formulas: CompositionFormula[],
	): ChatChoiceOption[] => {
		const sortedFormulas = [...formulas].sort((a, b) => {
			const aMod = Number(a.mods);
			const bMod = Number(b.mods);
			const aRank = Number.isFinite(aMod) ? aMod : a.id;
			const bRank = Number.isFinite(bMod) ? bMod : b.id;
			return bRank - aRank;
		});

		return sortedFormulas.map((f, index) => ({
			id: String(f.id),
			label: `Mod ${f.mods ?? f.id}${index === 0 ? " (latest)" : ""}`,
		}));
	};

	const resetFlow = () => {
		setSelectedFormulaId(null);
		setChangeRequest(null);
		setPendingApplyIngredients(null);
		setShowStartOverAction(false);

		setChoiceOptions(buildModOptions(availableFormulas));
		setMessages([
			{
				role: "assistant",
				content: "Pick the formula mod you want to modify.",
			},
		]);
	};

	useEffect(() => {
		let cancelled = false;

		const bootstrap = async () => {
			setIsLoading(true);

			try {
				const res = await authedFetch(`/api/compositions/${compositionId}`);
				const json = (await res.json()) as CompositionResponse;

				if (cancelled) return;

				if (!res.ok) {
					setMessages([
						{
							role: "assistant",
							content: json.error ?? "Failed to load formula mods.",
						},
					]);
					setChoiceOptions(null);
					return;
				}

				const formulas = json?.data?.formulas ?? [];
				setAvailableFormulas(formulas);

				if (formulas.length === 0) {
					setMessages([
						{
							role: "assistant",
							content:
								"No formula mods found for this composition yet. Create one first.",
						},
					]);
					setChoiceOptions(null);
					return;
				}

				setMessages([
					{
						role: "assistant",
						content: "Pick the formula mod you want to modify.",
					},
				]);
				setChoiceOptions(buildModOptions(formulas));
			} catch {
				if (!cancelled) {
					setMessages([
						{
							role: "assistant",
							content: "Failed to load formula mods.",
						},
					]);
					setChoiceOptions(null);
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void bootstrap();

		return () => {
			cancelled = true;
		};
	}, [compositionId]);

	const sendFormulaModRequest = async (
		formulaId: string,
		mode: FormulaModeChoiceId,
		requestText: string,
	): Promise<FormulaModApiResponse> => {
		const response = await authedFetch("/api/agent/formula-mod-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				compositionId,
				formulaId,
				changeRequest: requestText,
				mode,
			}),
		});

		let data: FormulaModApiResponse = {};
		try {
			data = (await response.json()) as FormulaModApiResponse;
		} catch {
			data = { error: `Request failed (${response.status})` };
		}

		if (!response.ok) {
			return {
				success: false,
				error: data.error ?? "Failed to generate formula modification.",
			};
		}

		return data;
	};

	const handleSendMessage = (message: string) => {
		const trimmed = message.trim();
		if (!trimmed) return;

		setShowStartOverAction(false);
		setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

		if (!selectedFormulaId) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Please pick a formula mod first.",
				},
			]);
			return;
		}

		if (changeRequest) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Please pick one of the options below to continue.",
				},
			]);
			return;
		}

		setChangeRequest(trimmed);
		setPendingApplyIngredients(null);

		setMessages((prev) => [
			...prev,
			{
				role: "assistant",
				content: "How should I handle dilutions/materials for this update?",
			},
		]);

		setChoiceOptions([
			{
				id: FORMULA_MODE_CHOICE.KEEP_DILUTIONS,
				label: "Keep the same dilutions",
			},
			{
				id: FORMULA_MODE_CHOICE.INVENTORY_ADJUST,
				label: "Add or remove with dilutions from inventory",
			},
			{
				id: FORMULA_MODE_CHOICE.SUGGEST_NEW,
				label: "Suggest non-existent raw material dilutions that would help",
			},
		]);
	};

	const handleChoice = async (choiceId: string) => {
		if (choiceId === FORMULA_ACTION_CHOICE.START_OVER) {
			const label =
				choiceOptions?.find((option) => option.id === choiceId)?.label ??
				"Start Over";

			setMessages((prev) => [...prev, { role: "user", content: label }]);
			resetFlow();
			return;
		}

		if (choiceId === FORMULA_ACTION_CHOICE.APPLY_TO_FORM) {
			const label =
				choiceOptions?.find((option) => option.id === choiceId)?.label ??
				"Apply to form";

			if (pendingApplyIngredients && onApplyToForm) {
				onApplyToForm(pendingApplyIngredients);
			}

			setMessages((prev) => [
				...prev,
				{ role: "user", content: label },
				{
					role: "assistant",
					content: "Applied to form. You can now edit and submit.",
				},
			]);

			// After applying, switch to footer Start Over action.
			setChoiceOptions(null);
			setPendingApplyIngredients(null);
			setShowStartOverAction(true);
			return;
		}

		// Phase 1: selecting formula mod
		if (!selectedFormulaId) {
			const label =
				choiceOptions?.find((option) => option.id === choiceId)?.label ??
				choiceId;

			setSelectedFormulaId(choiceId);
			onFirstModSelected?.();
			setChangeRequest(null);
			setPendingApplyIngredients(null);
			setShowStartOverAction(false);

			const selectedFormula = availableFormulas.find(
				(formula) => String(formula.id) === choiceId,
			);
			const baseLines = selectedFormula?.lines ?? [];
			if (baseLines.length > 0 && onApplyToForm) {
				onApplyToForm(buildPrefillIngredients(baseLines));
			}

			setMessages((prev) => [
				...prev,
				{ role: "user", content: label },
				{
					role: "assistant",
					content: "Great. What do you want to modify/change in this formula?",
				},
			]);
			setChoiceOptions(null);
			return;
		}

		// Phase 2: selecting mode and getting proposal from API
		if (!isFormulaModeChoiceId(choiceId)) {
			return;
		}
		const selectedMode = choiceId;
		const label =
			choiceOptions?.find((option) => option.id === selectedMode)?.label ??
			selectedMode;

		const selectedFormula = availableFormulas.find(
			(formula) => String(formula.id) === selectedFormulaId,
		);
		const lines = selectedFormula?.lines ?? [];

		if (!changeRequest || lines.length === 0) {
			setMessages((prev) => [
				...prev,
				{ role: "user", content: label },
				{
					role: "assistant",
					content:
						"I couldn't load formula lines for this mod. Please try another mod.",
				},
			]);
			setChoiceOptions(null);
			return;
		}

		setMessages((prev) => [...prev, { role: "user", content: label }]);
		setIsLoading(true);
		setChoiceOptions(null);
		setShowStartOverAction(false);

		try {
			const result = await sendFormulaModRequest(
				selectedFormulaId,
				selectedMode,
				changeRequest,
			);

			if (!result.success || !result.proposal) {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: result.error ?? "Failed to generate formula modification.",
					},
				]);
				setPendingApplyIngredients(null);
				return;
			}

			const reply =
				result.reply ??
				[
					result.proposal.rationale,
					"",
					"**Adjustment tips**",
					"",
					result.proposal.adjustmentTips.map((tip) => `- ${tip}`).join("\n"),
				].join("\n");

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: reply,
					formulaProposal: result.proposal,
				},
			]);

			if (result.allowApplyToForm) {
				setPendingApplyIngredients(
					buildPrefillIngredientsFromProposal(lines, result.proposal),
				);
				setChoiceOptions([
					{
						id: FORMULA_ACTION_CHOICE.APPLY_TO_FORM,
						label: "Apply to form",
					},
					{
						id: FORMULA_ACTION_CHOICE.START_OVER,
						label: "Start over",
					},
				]);
				setShowStartOverAction(false);
			} else {
				setPendingApplyIngredients(null);
				// Single choice option as requested
				setChoiceOptions([
					{
						id: FORMULA_ACTION_CHOICE.START_OVER,
						label: "Start over",
					},
				]);
				// Also show footer action as requested
				setShowStartOverAction(true);
			}
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Failed to generate formula modification.",
				},
			]);
			setPendingApplyIngredients(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ChatPanel
			title={!hasUserResponded ? "Formula Mod Agent" : undefined}
			subtitle={
				!hasUserResponded
					? "This agent helps you update an existing formula mod."
					: undefined
			}
			messages={messages}
			onSendMessage={handleSendMessage}
			isLoading={isLoading}
			placeholder="Describe what you want to change..."
			choiceOptions={choiceOptions}
			onChoice={handleChoice}
			footerAction={
				showStartOverAction
					? {
							label: "Start Over",
							onClick: resetFlow,
							disabled: isLoading,
						}
					: null
			}
			className="h-full min-h-0"
			hidePanel={hidePanel}
		/>
	);
}
