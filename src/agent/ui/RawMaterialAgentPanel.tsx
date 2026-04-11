import { useState } from "react";
import {
	ChatPanel,
	type ChatChoiceOption,
	type ChatMessage,
} from "@/components/ChatPanel";
import type { RawMaterialProposal } from "@/agent/schemas/rawMaterialProposal";
import { authedFetch } from "@/utils/authed-fetch";

type RawMaterialAgentPanelProps = {
	onApplyProposal?: (proposal: RawMaterialProposal) => void;
};

type ChatResponse = {
	success?: boolean;
	reply?: string;
	error?: string;
	materialName?: string;
	resetConversation?: boolean;
	proposal?: RawMaterialProposal;
	interaction?: {
		kind: "choice";
		options: ChatChoiceOption[];
	};
};

export function RawMaterialAgentPanel({
	onApplyProposal,
}: RawMaterialAgentPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content: "What raw material do you want to add?",
		},
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [choiceOptions, setChoiceOptions] = useState<ChatChoiceOption[] | null>(
		null,
	);
	const [pendingMaterialQuery, setPendingMaterialQuery] = useState<
		string | null
	>(null);
	const [pendingProposal, setPendingProposal] =
		useState<RawMaterialProposal | null>(null);

	const sendToApi = async (body: Record<string, string>) => {
		const response = await authedFetch("/api/agent/raw-material-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const data = (await response.json()) as ChatResponse;
		if (!response.ok) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						data.error ?? "Something went wrong. Please sign in and try again.",
				},
			]);
			setChoiceOptions(null);
			setPendingMaterialQuery(null);
			setPendingProposal(null);
			return;
		}
		const reply = data.reply;
		if (data.success && reply !== undefined) {
			setPendingProposal(data.proposal ?? null);
			if (data.resetConversation) {
				setMessages([{ role: "assistant", content: reply }]);
			} else {
				setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
			}
			if (
				data.interaction?.kind === "choice" &&
				data.interaction.options?.length
			) {
				setChoiceOptions(data.interaction.options);
			} else {
				setChoiceOptions(null);
				setPendingMaterialQuery(null);
			}
		}
	};

	const handleSendMessage = async (message: string) => {
		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setIsLoading(true);
		setPendingMaterialQuery(message);
		setPendingProposal(null);

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
			setPendingMaterialQuery(null);
			setPendingProposal(null);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChoice = async (choiceId: string) => {
		if (choiceId === "add_to_form") {
			if (!pendingProposal || !onApplyProposal) return;
			const label =
				choiceOptions?.find((o) => o.id === choiceId)?.label ?? "Add to form";
			setChoiceOptions(null);
			setMessages((prev) => [...prev, { role: "user", content: label }]);
			onApplyProposal(pendingProposal);
			setPendingProposal(null);
			setPendingMaterialQuery(null);
			return;
		}

		if (choiceId === "different_material") {
			setChoiceOptions(null);
			setPendingProposal(null);
			setPendingMaterialQuery(null);
			setMessages([
				{
					role: "assistant",
					content: "What raw material do you want to add?",
				},
			]);
			return;
		}

		const query = pendingMaterialQuery;
		if (!query) return;
		const optionsSnapshot = choiceOptions;
		setIsLoading(true);
		setChoiceOptions(null);

		if (choiceId === "no") {
			try {
				await sendToApi({ message: query, choiceId });
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
			return;
		}

		const label =
			optionsSnapshot?.find((o) => o.id === choiceId)?.label ?? choiceId;
		setMessages((prev) => [...prev, { role: "user", content: label }]);
		try {
			await sendToApi({ message: query, choiceId });
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
			messages={messages}
			onSendMessage={handleSendMessage}
			isLoading={isLoading}
			placeholder="Type material name..."
			choiceOptions={choiceOptions}
			onChoice={handleChoice}
		/>
	);
}
