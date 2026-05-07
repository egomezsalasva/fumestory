export const COMPOSITION_CHOICE = {
	ACCORD: "accord",
	PERFUME: "perfume",

	REPLICA: "replica",
	IDEA: "idea",

	ACCURATE_REPLICA: "accurate_replica",
	MODIFIED_REPLICA: "modified_replica",

	INVENTORY_ONLY: "inventory_only",
	INVENTORY_GUIDED: "inventory_guided",
	SUGGEST_ANY: "suggest_any",

	APPLY_TO_FORM: "apply_to_form",
	START_OVER: "start_over",
} as const;

export type CompositionChoiceId =
	(typeof COMPOSITION_CHOICE)[keyof typeof COMPOSITION_CHOICE];

export type CompositionStep =
	| "pick_target"
	| "describe_accord_idea"
	| "pick_perfume_intent"
	| "pick_perfume_replica_mode"
	| "describe_perfume_reference"
	| "describe_perfume_modification"
	| "describe_perfume_idea"
	| "pick_inventory_mode"
	| "review_formula";

export type CompositionConversationState = {
	step: CompositionStep;

	target?: "accord" | "perfume";

	// Accord branch
	accordIdea?: string;

	// Perfume branch
	perfumeIntent?: "replica" | "idea";
	perfumeReplicaMode?: "accurate_replica" | "modified_replica";
	perfumeReference?: string;
	perfumeModificationRequest?: string;
	perfumeIdea?: string;

	// Shared branch
	inventoryMode?: "inventory_only" | "inventory_guided" | "suggest_any";
};

export function createInitialCompositionConversationState(): CompositionConversationState {
	return { step: "pick_target" };
}
