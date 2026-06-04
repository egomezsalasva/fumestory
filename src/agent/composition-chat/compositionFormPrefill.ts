import type { CompositionConversationState } from "@/agent/composition-chat/flow";
import { toTitleCaseWords } from "@/utils/display-names";

export type CompositionFormPrefill = {
	type: "accord" | "perfume";
	suggestedName: string;
};

function stripSuffix(text: string, suffix: RegExp): string {
	return text.replace(suffix, "").trim();
}

export function buildCompositionFormPrefill(
	state: CompositionConversationState,
): CompositionFormPrefill | null {
	if (state.target === "accord") {
		const core = stripSuffix(state.accordIdea ?? "", /\s+accord\s*$/i);
		return {
			type: "accord",
			suggestedName: core
				? `${toTitleCaseWords(core)} Accord`
				: "Untitled Accord",
		};
	}

	if (state.target === "perfume") {
		if (state.perfumeIntent === "replica") {
			const core = stripSuffix(state.perfumeReference ?? "", /\s+replica\s*$/i);
			return {
				type: "perfume",
				suggestedName: core
					? `${toTitleCaseWords(core)} Replica`
					: "Untitled Replica",
			};
		}

		// Idea / concept — title case only, no "Perfume" suffix
		const core = stripSuffix(state.perfumeIdea ?? "", /\s+perfume\s*$/i);
		return {
			type: "perfume",
			suggestedName: core ? toTitleCaseWords(core) : "Untitled",
		};
	}

	return null;
}
