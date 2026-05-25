import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import {
	COMPOSITION_CHOICE,
	createInitialCompositionConversationState,
	type CompositionConversationState,
} from "@/agent/composition-chat/flow";
import {
	type AvailableDilution,
	countUniqueRawMaterials,
	formatAllowedInventoryMaterialNames,
	formatAvailableDilutionsForPrompt,
	getAvailableDilutions,
} from "@/agent/tools/getAvailableDilutions";
import {
	createInventoryGuidedFormulaProposalSchema,
	inventoryGuidedFormulaProposalSchema,
	suggestAnyFormulaProposalSchema,
} from "@/agent/schemas/compositionFormulaProposal";
import type { z } from "zod";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;
type InventoryGuidedFormulaProposal = z.infer<
	typeof inventoryGuidedFormulaProposalSchema
>;

type ChatResponse = {
	success: boolean;
	reply: string;
	proposal?: SuggestAnyFormulaProposal | InventoryGuidedFormulaProposal;
	inventoryOnlyTotalWeight?: string;
	interaction?: {
		kind: "choice";
		options: Array<{ id: string; label: string }>;
	};
	resetConversation?: boolean;
};

type FormulaSuggestionResult = {
	reply: string;
	proposal?: SuggestAnyFormulaProposal | InventoryGuidedFormulaProposal;
};

const memoryState = new Map<string, CompositionConversationState>();

const getState = (userId: string) =>
	memoryState.get(userId) ?? createInitialCompositionConversationState();

const setState = (userId: string, state: CompositionConversationState) => {
	memoryState.set(userId, state);
};

const resetState = (userId: string) => {
	const next = createInitialCompositionConversationState();
	memoryState.set(userId, next);
	return next;
};

const choices = (
	options: Array<{ id: string; label: string }>,
): ChatResponse["interaction"] => ({ kind: "choice", options });

const questionFor = (state: CompositionConversationState): ChatResponse => {
	switch (state.step) {
		case "pick_target":
			return {
				success: true,
				reply: "Do you want to create an accord or a perfume?",
				interaction: choices([
					{ id: COMPOSITION_CHOICE.ACCORD, label: "Accord" },
					{ id: COMPOSITION_CHOICE.PERFUME, label: "Perfume" },
				]),
			};

		case "describe_accord_idea":
			return {
				success: true,
				reply: "What accord idea do you want? (e.g., strawberry accord)",
			};

		case "pick_perfume_intent":
			return {
				success: true,
				reply:
					"Do you want to make a perfume replica or start from an idea/concept?",
				interaction: choices([
					{ id: COMPOSITION_CHOICE.REPLICA, label: "Replica" },
					{ id: COMPOSITION_CHOICE.IDEA, label: "Idea / Concept" },
				]),
			};

		case "pick_perfume_replica_mode":
			return {
				success: true,
				reply: "Do you want an accurate replica or a modified replica?",
				interaction: choices([
					{
						id: COMPOSITION_CHOICE.ACCURATE_REPLICA,
						label: "Accurate replica",
					},
					{
						id: COMPOSITION_CHOICE.MODIFIED_REPLICA,
						label: "Modified replica",
					},
				]),
			};

		case "describe_perfume_reference":
			return {
				success: true,
				reply: "What perfume do you want to replicate? (e.g., Chanel N°5)",
			};

		case "describe_perfume_modification":
			return {
				success: true,
				reply: "What do you want to modify? (e.g., make it more masculine)",
			};

		case "describe_perfume_idea":
			return {
				success: true,
				reply: "Describe your perfume idea/concept.",
			};

		case "pick_inventory_mode":
			return {
				success: true,
				reply:
					"How should I handle materials: strictly from your inventory, inventory-first with guided additions, or best overall suggestions?",
				interaction: choices([
					{ id: COMPOSITION_CHOICE.INVENTORY_ONLY, label: "Inventory only" },
					{
						id: COMPOSITION_CHOICE.INVENTORY_GUIDED,
						label: "Inventory first (guided additions)",
					},
					{ id: COMPOSITION_CHOICE.SUGGEST_ANY, label: "Suggest best overall" },
				]),
			};

		case "ask_inventory_only_total_weight":
			return {
				success: true,
				reply:
					"Before I generate the inventory-only formula, what total weight do you want? (e.g., 30g)",
			};

		case "review_formula":
			return {
				success: true,
				reply: "Formula generated. Choose Start over to generate another one.",
				interaction: choices([
					{ id: COMPOSITION_CHOICE.START_OVER, label: "Start over" },
				]),
			};
	}

	return {
		success: true,
		reply: "Do you want to create an accord or a perfume?",
		interaction: choices([
			{ id: COMPOSITION_CHOICE.ACCORD, label: "Accord" },
			{ id: COMPOSITION_CHOICE.PERFUME, label: "Perfume" },
		]),
	};
};

const buildContextSummary = (state: CompositionConversationState): string => {
	const lines: string[] = [];

	lines.push(`Target: ${state.target ?? "unknown"}`);
	lines.push(`Inventory mode: ${state.inventoryMode ?? "unknown"}`);

	if (state.target === "accord") {
		lines.push(`Accord idea: ${state.accordIdea ?? "not provided"}`);
	}

	if (state.target === "perfume") {
		lines.push(`Perfume intent: ${state.perfumeIntent ?? "unknown"}`);

		if (state.perfumeIntent === "replica") {
			lines.push(`Replica mode: ${state.perfumeReplicaMode ?? "unknown"}`);
			lines.push(
				`Reference perfume: ${state.perfumeReference ?? "not provided"}`,
			);
			if (state.perfumeReplicaMode === "modified_replica") {
				lines.push(
					`Requested modification: ${state.perfumeModificationRequest ?? "not provided"}`,
				);
			}
		}

		if (state.perfumeIntent === "idea") {
			lines.push(`Perfume idea: ${state.perfumeIdea ?? "not provided"}`);
		}
	}

	if (state.inventoryMode === "inventory_only") {
		lines.push(
			`Requested total batch weight: ${state.inventoryOnlyTotalWeight ?? "not provided"}`,
		);
	}

	return lines.map((l) => `- ${l}`).join("\n");
};

const FORMULA_LINE_FORMAT =
	'Format each starter formula line exactly like: "Aldehyde C12 (Lemon) 10% dilution - 18%" (material name, space, dilution %, space, word dilution, space-hyphen-space, formula % only). No em dashes, no commas between parts, no "of formula".';

const buildInventorySystemRule = (
	inventoryMode: CompositionConversationState["inventoryMode"],
): string => {
	switch (inventoryMode) {
		case "inventory_only":
			return `- ACTIVE MODE inventory_only: use only allowed inventory materials; full formula must total 100 (±0.1). ${FORMULA_LINE_FORMAT}`;
		case "inventory_guided":
			return `- ACTIVE MODE inventory_guided: include inventory-first plus additions as needed; combined formula must total 100 (±0.1). ${FORMULA_LINE_FORMAT}`;
		default:
			return `- ACTIVE MODE suggest_any: best overall materials; formula must total 100 (±0.1). ${FORMULA_LINE_FORMAT}`;
	}
};

const MIN_UNIQUE_RAW_MATERIALS_WITHOUT_WARNING = 5;

const buildSparseInventoryWarning = (
	uniqueMaterialCount: number,
): string | null => {
	if (uniqueMaterialCount >= MIN_UNIQUE_RAW_MATERIALS_WITHOUT_WARNING) {
		return null;
	}

	const materialWord = uniqueMaterialCount === 1 ? "material" : "materials";
	return `> **Note:** You only have **${uniqueMaterialCount}** available raw ${materialWord} in inventory. A strict inventory-only formula may be very limited. Consider **Inventory first (guided additions)** next time if you want suggested materials beyond what you own.\n\n`;
};

const buildInventoryPromptSection = (
	inventoryMode: CompositionConversationState["inventoryMode"],
	availableDilutions: AvailableDilution[],
): string => {
	const allowedList = formatAllowedInventoryMaterialNames(availableDilutions);
	const dilutionsList = formatAvailableDilutionsForPrompt(availableDilutions, {
		includeInternalIds: false,
	});

	if (inventoryMode === "inventory_only") {
		return `\n\n=== inventory_only ===
Allowed inventory materials (the ENTIRE formula must use only these; 100% total in one section):
${allowedList}

Available inventory dilutions (pick one dilution % per material):
${dilutionsList}`;
	}

	if (inventoryMode === "inventory_guided") {
		return `\n\n=== inventory_guided ===
Allowed inventory materials (prioritize these first):
${allowedList}

Available inventory dilutions:
${dilutionsList}

You may suggest additions not on the allowed list if needed; final total must still be 100.`;
	}

	return "";
};

const SUGGEST_ANY_OBJECT_SYSTEM_PROMPT = `You are a senior perfumer drafting a starter formula.

Return JSON only (schema fields):
- rationale
- lines: materialDisplayName, dilutionPercent (stock), formulaPercent (blend share)
- adjustmentTips: 2–4 strings

Rules:
- formulaPercent must sum to 100 (±0.1).
- dilutionPercent is not formulaPercent.
- Whole numbers when exact (10 not 10.0).`;

const INVENTORY_ONLY_OBJECT_SYSTEM_PROMPT = `You are a senior perfumer drafting a starter formula.

Return JSON only (schema fields):
- rationale
- lines: materialDisplayName, dilutionPercent, formulaPercent
- adjustmentTips: 2–4 strings

Rules:
- inventory_only mode.
- Use ONLY materials from the allowed inventory list.
- formulaPercent must sum to 100 (±0.1).
- dilutionPercent is stock strength, not formulaPercent.
- One unified formula (no additions section).`;

const INVENTORY_GUIDED_OBJECT_SYSTEM_PROMPT = `You are a senior perfumer drafting a starter formula.

Return JSON only (schema fields):
- rationale
- lines: materialDisplayName, dilutionPercent, formulaPercent, section
- adjustmentTips: 2–4 strings

Rules:
- inventory_guided mode.
- Include BOTH inventory and additions in one formula total.
- section is REQUIRED on every line — never encode inventory vs addition in materialDisplayName:
  - section "inventory": materialDisplayName MUST match the allowed inventory list exactly (including label in parentheses when listed).
  - section "addition": materialDisplayName MUST be the standard material name (e.g. "Hedione", "Aldehyde C12 (Lemon)"). Do NOT copy the user's inventory "Name (Label)" format and do NOT append "(addition)".
- Include at least one line with section "inventory".
- Include at least one line with section "addition".
- formulaPercent across ALL lines must sum to 100 (±0.1).
- dilutionPercent is stock strength, not formulaPercent.`;

function formulaProposalToReplyMarkdown(
	proposal: SuggestAnyFormulaProposal | InventoryGuidedFormulaProposal,
): string {
	const tips = proposal.adjustmentTips.map((t) => `- ${t}`).join("\n");
	return [proposal.rationale.trim(), "", "**Adjustment tips**", "", tips].join(
		"\n",
	);
}

async function generateValidatedSuggestAnyProposal(
	system: string,
	prompt: string,
): Promise<SuggestAnyFormulaProposal | null> {
	const attempt = (extraInstruction?: string) =>
		generateText({
			model: openai("gpt-4o-mini"),
			output: Output.object({ schema: suggestAnyFormulaProposalSchema }),
			system,
			prompt: extraInstruction ? `${prompt}\n\n${extraInstruction}` : prompt,
		});

	try {
		const first = await attempt();
		return first.output ?? null;
	} catch {
		try {
			const second = await attempt(
				[
					"IMPORTANT: Return valid JSON matching the schema.",
					"formulaPercent values across all lines MUST sum to exactly 100 (±0.1).",
					"Do not include formatting text like '10% dilution - 18%' inside materialDisplayName.",
					"materialDisplayName must be only the material name.",
				].join(" "),
			);
			return second.output ?? null;
		} catch {
			return null;
		}
	}
}

async function generateValidatedInventoryGuidedProposal(
	system: string,
	prompt: string,
	availableDilutions: AvailableDilution[],
): Promise<InventoryGuidedFormulaProposal | null> {
	const schema = createInventoryGuidedFormulaProposalSchema(availableDilutions);

	const attempt = (extraInstruction?: string) =>
		generateText({
			model: openai("gpt-4o-mini"),
			output: Output.object({ schema }),
			system,
			prompt: extraInstruction ? `${prompt}\n\n${extraInstruction}` : prompt,
		});

	try {
		const first = await attempt();
		return first.output ?? null;
	} catch {
		try {
			const second = await attempt(
				[
					"IMPORTANT: Return valid JSON matching schema.",
					"Each line MUST include section: inventory or addition.",
					"Include at least one inventory and one addition line.",
					"formulaPercent values across all lines MUST sum to exactly 100 (±0.1).",
					"Addition lines MUST be materials the user does NOT already have in inventory.",
					"Never put an allowed inventory material in section addition — use section inventory instead.",
					'For section addition, do not append "(addition)" and do not copy inventory "Name (Label)" format. Standard names with parentheses (e.g. "Aldehyde C12 (Lemon)") are fine.',
				].join(" "),
			);
			return second.output ?? null;
		} catch {
			try {
				const third = await attempt(
					[
						"Your previous response incorrectly listed inventory materials as additions.",
						"Replace every addition line with materials NOT on the allowed inventory list.",
						"Keep inventory lines for materials the user already owns.",
						'Do not append "(addition)" to materialDisplayName — use the section field only.',
					].join(" "),
				);
				return third.output ?? null;
			} catch {
				return null;
			}
		}
	}
}

const generateFormulaSuggestion = async (
	state: CompositionConversationState,
	availableDilutions: AvailableDilution[] | null,
): Promise<FormulaSuggestionResult> => {
	const inventoryMode = state.inventoryMode ?? "suggest_any";

	const modeRule = buildInventorySystemRule(inventoryMode);
	const basePrompt = `Create a starter ${
		state.target === "accord" ? "accord" : "perfume"
	} formula from this context:

${buildContextSummary(state)}

Mode rules:
${modeRule}`;

	const inventorySection =
		availableDilutions !== null &&
		(inventoryMode === "inventory_only" || inventoryMode === "inventory_guided")
			? buildInventoryPromptSection(inventoryMode, availableDilutions)
			: "";

	const prompt = `${basePrompt}${inventorySection}`;

	if (inventoryMode === "inventory_guided") {
		const output = await generateValidatedInventoryGuidedProposal(
			INVENTORY_GUIDED_OBJECT_SYSTEM_PROMPT,
			prompt,
			availableDilutions ?? [],
		);

		if (!output) {
			return {
				reply:
					"I couldn't generate a valid formula right now. Please try again.",
			};
		}

		return {
			reply: formulaProposalToReplyMarkdown(output),
			proposal: output,
		};
	}

	const system =
		inventoryMode === "suggest_any"
			? SUGGEST_ANY_OBJECT_SYSTEM_PROMPT
			: INVENTORY_ONLY_OBJECT_SYSTEM_PROMPT;

	const output = await generateValidatedSuggestAnyProposal(system, prompt);

	if (!output) {
		return {
			reply: "I couldn't generate a valid formula right now. Please try again.",
		};
	}

	return {
		reply: formulaProposalToReplyMarkdown(output),
		proposal: output,
	};
};

const generateReviewFormulaResponse = async (
	userId: string,
	state: CompositionConversationState,
) => {
	const needsInventory =
		state.inventoryMode === "inventory_only" ||
		state.inventoryMode === "inventory_guided";

	let availableDilutions: AvailableDilution[] | null = null;
	if (needsInventory) {
		availableDilutions = await getAvailableDilutions(userId);
	}

	if (
		state.inventoryMode === "inventory_only" &&
		availableDilutions !== null &&
		availableDilutions.length === 0
	) {
		return jsonResponse(
			{
				success: true,
				reply:
					"You don't have any available dilutions yet. Add at least one dilution, then try again.",
				interaction: choices([
					{ id: COMPOSITION_CHOICE.START_OVER, label: "Start over" },
				]),
			},
			200,
		);
	}

	try {
		const generated = await generateFormulaSuggestion(
			state,
			availableDilutions,
		);
		let reply = generated.reply;

		if (
			state.inventoryMode === "inventory_only" &&
			availableDilutions !== null
		) {
			const warning = buildSparseInventoryWarning(
				countUniqueRawMaterials(availableDilutions),
			);
			if (warning) {
				reply = warning + reply;
			}
		}

		return jsonResponse(
			{
				success: true,
				reply,
				...(generated.proposal ? { proposal: generated.proposal } : {}),
				...(state.inventoryMode === "inventory_only" &&
				state.inventoryOnlyTotalWeight
					? { inventoryOnlyTotalWeight: state.inventoryOnlyTotalWeight }
					: {}),
				interaction: choices([
					{ id: COMPOSITION_CHOICE.START_OVER, label: "Start over" },
				]),
			},
			200,
		);
	} catch (error) {
		console.error("[composition-chat] formula generation failed:", error);
		return jsonResponse(
			{
				success: false,
				reply:
					"Sorry, I encountered an error generating the formula. Please try again.",
			},
			500,
		);
	}
};

export const Route = createFileRoute("/api/agent/composition-chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const auth = requireCurrentUserId(request);
				if (auth.errorResponse) return auth.errorResponse;
				const userId = auth.userId!;

				const body = await request.json().catch(() => ({}));

				const shouldResetConversation =
					body?.resetConversation === true ||
					body?.resetConversation === "true";

				if (shouldResetConversation) {
					const state = resetState(userId);
					return jsonResponse(
						{ ...questionFor(state), resetConversation: true },
						200,
					);
				}

				const choiceId =
					typeof body?.choiceId === "string" ? body.choiceId : undefined;
				const message =
					typeof body?.message === "string" ? body.message.trim() : "";

				if (choiceId === COMPOSITION_CHOICE.START_OVER) {
					const state = resetState(userId);
					return jsonResponse(
						{ ...questionFor(state), resetConversation: true },
						200,
					);
				}

				let state = getState(userId);

				if (!choiceId && !message) {
					setState(userId, state);
					return jsonResponse(questionFor(state), 200);
				}

				switch (state.step) {
					case "pick_target": {
						if (
							choiceId !== COMPOSITION_CHOICE.ACCORD &&
							choiceId !== COMPOSITION_CHOICE.PERFUME
						) {
							return jsonResponse(questionFor(state), 200);
						}

						if (choiceId === COMPOSITION_CHOICE.ACCORD) {
							state = {
								...state,
								target: "accord",
								step: "describe_accord_idea",
							};
						} else {
							state = {
								...state,
								target: "perfume",
								step: "pick_perfume_intent",
							};
						}
						break;
					}

					case "describe_accord_idea": {
						if (!message) return jsonResponse(questionFor(state), 200);
						state = {
							...state,
							accordIdea: message,
							step: "pick_inventory_mode",
						};
						break;
					}

					case "pick_perfume_intent": {
						if (choiceId === COMPOSITION_CHOICE.REPLICA) {
							state = {
								...state,
								perfumeIntent: "replica",
								step: "pick_perfume_replica_mode",
							};
						} else if (choiceId === COMPOSITION_CHOICE.IDEA) {
							state = {
								...state,
								perfumeIntent: "idea",
								step: "describe_perfume_idea",
							};
						} else {
							return jsonResponse(questionFor(state), 200);
						}
						break;
					}

					case "pick_perfume_replica_mode": {
						if (
							choiceId !== COMPOSITION_CHOICE.ACCURATE_REPLICA &&
							choiceId !== COMPOSITION_CHOICE.MODIFIED_REPLICA
						) {
							return jsonResponse(questionFor(state), 200);
						}
						state = {
							...state,
							perfumeReplicaMode:
								choiceId === COMPOSITION_CHOICE.ACCURATE_REPLICA
									? "accurate_replica"
									: "modified_replica",
							step: "describe_perfume_reference",
						};
						break;
					}

					case "describe_perfume_reference": {
						if (!message) return jsonResponse(questionFor(state), 200);

						if (state.perfumeReplicaMode === "modified_replica") {
							state = {
								...state,
								perfumeReference: message,
								step: "describe_perfume_modification",
							};
						} else {
							state = {
								...state,
								perfumeReference: message,
								step: "pick_inventory_mode",
							};
						}
						break;
					}

					case "describe_perfume_modification": {
						if (!message) return jsonResponse(questionFor(state), 200);
						state = {
							...state,
							perfumeModificationRequest: message,
							step: "pick_inventory_mode",
						};
						break;
					}

					case "describe_perfume_idea": {
						if (!message) return jsonResponse(questionFor(state), 200);
						state = {
							...state,
							perfumeIdea: message,
							step: "pick_inventory_mode",
						};
						break;
					}

					case "pick_inventory_mode": {
						if (
							choiceId !== COMPOSITION_CHOICE.INVENTORY_ONLY &&
							choiceId !== COMPOSITION_CHOICE.INVENTORY_GUIDED &&
							choiceId !== COMPOSITION_CHOICE.SUGGEST_ANY
						) {
							return jsonResponse(questionFor(state), 200);
						}

						if (choiceId === COMPOSITION_CHOICE.INVENTORY_ONLY) {
							state = {
								...state,
								inventoryMode: "inventory_only",
								step: "ask_inventory_only_total_weight",
							};
							setState(userId, state);
							return jsonResponse(questionFor(state), 200);
						}

						state = {
							...state,
							inventoryMode:
								choiceId === COMPOSITION_CHOICE.INVENTORY_GUIDED
									? "inventory_guided"
									: "suggest_any",
							step: "review_formula",
						};
						setState(userId, state);
						return await generateReviewFormulaResponse(userId, state);
					}

					case "ask_inventory_only_total_weight": {
						if (!message) {
							return jsonResponse(questionFor(state), 200);
						}

						const isValidWeight = /^\d+(\.\d+)?\s*(g|gram|grams|ml)?$/i.test(
							message,
						);

						if (!isValidWeight) {
							return jsonResponse(
								{
									success: true,
									reply:
										"Please enter total weight as a number with optional unit, e.g. 30g or 50 ml.",
								},
								200,
							);
						}

						state = {
							...state,
							inventoryOnlyTotalWeight: message,
							step: "review_formula",
						};
						setState(userId, state);
						return await generateReviewFormulaResponse(userId, state);
					}

					case "review_formula": {
						return jsonResponse(questionFor(state), 200);
					}
				}

				setState(userId, state);
				return jsonResponse(questionFor(state), 200);
			},
		},
	},
});
