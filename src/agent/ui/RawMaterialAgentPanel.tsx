import { useState } from "react";
import { ChatPanel, type ChatMessage } from "@/components/ChatPanel";

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
		// Add user message immediately
		setMessages((prev) => [...prev, { role: "user", content: message }]);
		setIsLoading(true);

		try {
			const response = await fetch("/api/agent/raw-material-chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message }),
			});

			const data = await response.json();

			if (data.success && data.reply) {
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: data.reply },
				]);

				// If material found, notify parent
				if (onMaterialFound && data.materialName) {
					onMaterialFound(data.materialName);
				}
			}
		} catch (error) {
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
