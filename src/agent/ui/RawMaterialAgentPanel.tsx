import { useState } from "react";
import {
	ChatPanel,
	type ChatChoiceOption,
	type ChatMessage,
} from "@/components/ChatPanel";
import { authedFetch } from "@/utils/authed-fetch";

type RawMaterialAgentPanelProps = {
	onMaterialFound?: (materialName: string) => void;
};

type ChatResponse = {
	success?: boolean;
	reply?: string;
	error?: string;
	materialName?: string;
	resetConversation?: boolean;
	interaction?: {
		kind: "choice";
		options: ChatChoiceOption[];
	};
};

export function RawMaterialAgentPanel({
	onMaterialFound,
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
			return;
		}
		const reply = data.reply;
		if (data.success && reply !== undefined) {
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
			if (onMaterialFound && data.materialName) {
				onMaterialFound(data.materialName);
			}
		}
	};

	const handleSendMessage = async (message: string) => {
		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setIsLoading(true);
		setPendingMaterialQuery(message);

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
		} finally {
			setIsLoading(false);
		}
	};

	const handleChoice = async (choiceId: string) => {
		const query = pendingMaterialQuery;
		if (!query) return;
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
			choiceOptions?.find((o) => o.id === choiceId)?.label ?? choiceId;
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
