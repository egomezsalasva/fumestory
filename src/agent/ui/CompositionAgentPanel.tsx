import { useEffect, useRef, useState } from "react";
import {
	ChatPanel,
	type ChatChoiceOption,
	type ChatMessage,
} from "@/components/ChatPanel";
import type { z } from "zod";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { authedFetch } from "@/utils/authed-fetch";

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;

type CompositionAgentPanelProps = {
	onStartOverClick: () => void;
	hidePanel: () => void;
};

type ChatResponse = {
	success?: boolean;
	reply?: string;
	error?: string;
	resetConversation?: boolean;
	proposal?: SuggestAnyFormulaProposal;
	inventoryOnlyTotalWeight?: string;
	interaction?: {
		kind: "choice";
		options: ChatChoiceOption[];
	};
};

function assistantMessage(
	reply: string,
	proposal?: SuggestAnyFormulaProposal,
	inventoryOnlyTotalWeight?: string,
): ChatMessage {
	return {
		role: "assistant",
		content: reply,
		...(proposal ? { formulaProposal: proposal } : {}),
		...(inventoryOnlyTotalWeight ? { inventoryOnlyTotalWeight } : {}),
	};
}

export function CompositionAgentPanel({
	onStartOverClick,
	hidePanel,
}: CompositionAgentPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [choiceOptions, setChoiceOptions] = useState<ChatChoiceOption[] | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	const hasUserResponded = messages.some((m) => m.role === "user");

	const sendToApi = async (body: Record<string, string>) => {
		const response = await authedFetch("/api/agent/composition-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		let data: ChatResponse = {};
		try {
			data = (await response.json()) as ChatResponse;
		} catch {
			data = { error: `Request failed (${response.status})` };
		}

		if (!response.ok) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: data.error ?? "Something went wrong. Please try again.",
				},
			]);
			setChoiceOptions(null);
			return;
		}

		const reply =
			data.reply ?? "Sorry, I encountered an error. Please try again.";
		if (data.resetConversation) {
			setMessages([
				assistantMessage(reply, data.proposal, data.inventoryOnlyTotalWeight),
			]);
		} else {
			setMessages((prev) => [
				...prev,
				assistantMessage(reply, data.proposal, data.inventoryOnlyTotalWeight),
			]);
		}

		if (
			data.interaction?.kind === "choice" &&
			data.interaction.options?.length
		) {
			setChoiceOptions(data.interaction.options);
		} else {
			setChoiceOptions(null);
		}
	};

	const didBootstrapRef = useRef(false);

	useEffect(() => {
		if (didBootstrapRef.current) {
			setIsLoading(false);
			return;
		}
		didBootstrapRef.current = true;
		let cancelled = false;

		const bootstrap = async () => {
			setIsLoading(true);
			try {
				// Force a fresh conversation on page refresh/remount
				if (!cancelled) await sendToApi({ resetConversation: "true" });
			} catch {
				if (!cancelled) {
					setMessages([
						{
							role: "assistant",
							content: "Sorry, I encountered an error. Please try again.",
						},
					]);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		void bootstrap();

		return () => {
			cancelled = true;
		};
	}, []);

	const handleSendMessage = async (message: string) => {
		if (isLoading) return;
		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setIsLoading(true);
		try {
			await sendToApi({ message });
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
				},
			]);
			setChoiceOptions(null);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChoice = async (choiceId: string) => {
		if (isLoading) return;
		if (choiceId === "start_over") {
			onStartOverClick();
		}
		const label =
			choiceOptions?.find((o) => o.id === choiceId)?.label ?? choiceId;
		setMessages((prev) => [...prev, { role: "user", content: label }]);
		setIsLoading(true);
		setChoiceOptions(null);

		try {
			await sendToApi({ choiceId });
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ChatPanel
			title={!hasUserResponded ? "Composition Agent" : undefined}
			subtitle={
				!hasUserResponded
					? "This agent helps you come up with a strating formula for eiter an accord or a perfume.\nYou can pick materials from you inventory or let it suggest materials for you."
					: undefined
			}
			messages={messages}
			onSendMessage={handleSendMessage}
			isLoading={isLoading}
			placeholder="Type your idea..."
			choiceOptions={choiceOptions}
			onChoice={handleChoice}
			className="h-full min-h-0"
			hidePanel={hidePanel}
		/>
	);
}
