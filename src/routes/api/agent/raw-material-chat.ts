import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { jsonResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { RAW_MATERIAL_ENTRY_OBJECT_SYSTEM_PROMPT } from "@/agent/system/perfumeryAgentSystemPrompt";
import {
	type RawMaterialAgentResult,
	rawMaterialAgentResultSchema,
} from "@/agent/schemas/rawMaterialProposal";
import { proposalToMarkdown } from "@/agent/utils/proposalToMarkdown";
import { searchUserInventory } from "@/agent/tools/searchUserInventory";

const DUPLICATE_CHOICE_INTERACTION = {
	kind: "choice" as const,
	options: [
		{ id: "yes", label: "Yes" },
		{ id: "no", label: "No" },
	],
};

const ADD_TO_FORM_CHOICE_INTERACTION = {
	kind: "choice" as const,
	options: [
		{ id: "add_to_form", label: "Add to form" },
		{ id: "different_material", label: "Add different material" },
	],
};

async function generateStructuredProposal(
	userMessage: string,
): Promise<RawMaterialAgentResult | null> {
	const result = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: rawMaterialAgentResultSchema }),
		system: RAW_MATERIAL_ENTRY_OBJECT_SYSTEM_PROMPT,
		prompt: userMessage,
	});
	return result.output ?? null;
}

const OUT_OF_TOPIC_FALLBACK =
	"That seems outside perfumery raw materials. Please enter a fragrance raw material name.";

export const Route = createFileRoute("/api/agent/raw-material-chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const auth = requireCurrentUserId(request);
				if (auth.errorResponse) return auth.errorResponse;
				const userId = auth.userId!;

				const body = await request.json().catch(() => ({}));
				const userMessage = body?.message ?? "";
				const choiceId =
					typeof body?.choiceId === "string" ? body.choiceId : undefined;

				if (choiceId === "no") {
					return jsonResponse(
						{
							success: true,
							reply: "What raw material do you want to add?",
							resetConversation: true,
						},
						200,
					);
				}

				if (choiceId === "yes" && userMessage.trim()) {
					try {
						const result = await generateStructuredProposal(userMessage.trim());
						if (!result) {
							return jsonResponse(
								{
									success: false,
									reply: "Sorry, I encountered an error. Please try again.",
								},
								500,
							);
						}

						if (result.kind === "out_of_topic") {
							return jsonResponse(
								{
									success: true,
									reply: result.reply ?? OUT_OF_TOPIC_FALLBACK,
								},
								200,
							);
						}

						if (!result.proposal) {
							return jsonResponse(
								{
									success: true,
									reply: OUT_OF_TOPIC_FALLBACK,
								},
								200,
							);
						}
						const reply = proposalToMarkdown(result.proposal);
						return jsonResponse({ success: true, reply }, 200);
					} catch {
						return jsonResponse(
							{
								success: false,
								reply: "Sorry, I encountered an error. Please try again.",
							},
							500,
						);
					}
				}

				if (!userMessage.trim()) {
					return jsonResponse(
						{ success: true, reply: "What raw material do you want to add?" },
						200,
					);
				}

				const materialName = userMessage.trim().toLowerCase();

				try {
					const inventoryCheck = await searchUserInventory(
						userId,
						materialName,
						userMessage,
					);

					if (inventoryCheck.found) {
						return jsonResponse(
							{
								success: true,
								reply: inventoryCheck.message ?? "",
								interaction: DUPLICATE_CHOICE_INTERACTION,
							},
							200,
						);
					}

					const result = await generateStructuredProposal(userMessage);
					if (!result) {
						return jsonResponse(
							{
								success: false,
								reply: "Sorry, I encountered an error. Please try again.",
							},
							500,
						);
					}
					if (result.kind === "out_of_topic") {
						return jsonResponse(
							{
								success: true,
								reply: result.reply ?? OUT_OF_TOPIC_FALLBACK,
							},
							200,
						);
					}
					if (!result.proposal) {
						return jsonResponse(
							{
								success: true,
								reply: OUT_OF_TOPIC_FALLBACK,
							},
							200,
						);
					}
					const reply = proposalToMarkdown(result.proposal);
					return jsonResponse(
						{
							success: true,
							reply,
							proposal: result.proposal,
							interaction: ADD_TO_FORM_CHOICE_INTERACTION,
						},
						200,
					);
				} catch (error) {
					console.error("[raw-material-chat] error:", error);
					return jsonResponse(
						{
							success: false,
							reply: "Sorry, I encountered an error. Please try again.",
						},
						500,
					);
				}
			},
		},
	},
});
