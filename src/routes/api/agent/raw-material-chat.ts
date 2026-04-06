import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { jsonResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { RAW_MATERIAL_ENTRY_OBJECT_SYSTEM_PROMPT } from "@/agent/system/perfumeryAgentSystemPrompt";
import { rawMaterialProposalSchema } from "@/agent/schemas/rawMaterialProposal";
import { proposalToMarkdown } from "@/agent/utils/proposalToMarkdown";
import { searchUserInventory } from "@/agent/tools/searchUserInventory";

const DUPLICATE_CHOICE_INTERACTION = {
	kind: "choice" as const,
	options: [
		{ id: "yes", label: "Yes" },
		{ id: "no", label: "No" },
	],
};

async function structuredProposalReply(userMessage: string) {
	const result = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: rawMaterialProposalSchema }),
		system: RAW_MATERIAL_ENTRY_OBJECT_SYSTEM_PROMPT,
		prompt: userMessage,
	});
	const proposal = result.output;
	if (!proposal) return null;
	return proposalToMarkdown(proposal);
}

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
						const reply = await structuredProposalReply(userMessage.trim());
						if (!reply) {
							return jsonResponse(
								{
									success: false,
									reply: "Sorry, I encountered an error. Please try again.",
								},
								500,
							);
						}
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

					const reply = await structuredProposalReply(userMessage);
					if (!reply) {
						return jsonResponse(
							{
								success: false,
								reply: "Sorry, I encountered an error. Please try again.",
							},
							500,
						);
					}
					console.log("[raw-material-chat] modelReply (structured):", reply);
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
			},
		},
	},
});
