import { useState } from "react";
import { ChatPanel, type ChatMessage } from "@/components/ChatPanel";
import { authedFetch } from "@/utils/authed-fetch";

type RawMaterialAgentPanelProps = {
	onMaterialFound?: (materialName: string) => void;
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

	const handleSendMessage = async (message: string) => {
		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setIsLoading(true);

		try {
			const response = await authedFetch("/api/agent/raw-material-chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message }),
			});

			const data = (await response.json()) as {
				success?: boolean;
				reply?: string;
				error?: string;
				materialName?: string;
			};

			if (!response.ok) {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content:
							data.error ??
							"Something went wrong. Please sign in and try again.",
					},
				]);
				return;
			}

			const reply = data.reply;
			if (data.success && reply) {
				setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
				if (onMaterialFound && data.materialName) {
					onMaterialFound(data.materialName);
				}
			}
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
		/>
	);
}
