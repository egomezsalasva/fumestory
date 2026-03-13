import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { jsonResponse } from "@/utils/api";
import { PERFUMERY_AGENT_SYSTEM_PROMPT } from "@/agent/system/perfumeryAgentSystemPrompt";
import { searchUserInventory } from "@/agent/tools/searchUserInventory";

export const Route = createFileRoute("/api/agent/raw-material-chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = await request.json().catch(() => ({}));
				const userMessage = body?.message ?? "";

				console.log("[raw-material-chat] userMessage:", userMessage);

				if (!userMessage.trim()) {
					return jsonResponse(
						{ success: true, reply: "What raw material do you want to add?" },
						200,
					);
				}

				const materialName = userMessage.trim().toLowerCase();

				try {
					const inventoryCheck = await searchUserInventory(
						materialName,
						userMessage,
					);

					console.log("[raw-material-chat] inventoryCheck:", inventoryCheck);

					if (inventoryCheck.found) {
						return jsonResponse(
							{ success: true, reply: inventoryCheck.message },
							200,
						);
					}

					const { text } = await generateText({
						model: openai("gpt-4o-mini"),
						messages: [
							{
								role: "system",
								content: PERFUMERY_AGENT_SYSTEM_PROMPT,
							},
							{
								role: "user",
								content: userMessage,
							},
						],
					});

					console.log("[raw-material-chat] modelReply:", text);

					return jsonResponse({ success: true, reply: text }, 200);
				} catch (error) {
					console.error("Raw Material Chat Error:", error);
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
