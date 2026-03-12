import { useState } from "react";

export type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

type ChatPanelProps = {
	messages: ChatMessage[];
	onSendMessage: (message: string) => void | Promise<void>;
	isLoading?: boolean;
	placeholder?: string;
	title?: string;
	subtitle?: string;
	className?: string;
};

export function ChatPanel({
	messages,
	onSendMessage,
	isLoading = false,
	placeholder = "Type a message...",
	title,
	subtitle,
	className = "",
}: ChatPanelProps) {
	const [input, setInput] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = input.trim();
		if (!value || isLoading) return;

		setInput("");
		await onSendMessage(value);
	};

	return (
		<div className={`w-96 fixed right-9 top-20 bottom-8 ${className}`}>
			<div className="bg-slate-800 rounded-lg border border-slate-700 h-full flex flex-col shadow-xl">
				{/* Header */}
				{(title || subtitle) && (
					<div className="p-4 border-b border-slate-700">
						{title && (
							<h2 className="text-lg font-semibold text-white">{title}</h2>
						)}
						{subtitle && (
							<p className="text-xs text-slate-400 mt-1">{subtitle}</p>
						)}
					</div>
				)}

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
									msg.role === "user"
										? "bg-blue-600 text-white"
										: "bg-slate-700 text-slate-200"
								}`}
							>
								{msg.content}
							</div>
						</div>
					))}
					{isLoading && (
						<div className="flex justify-start">
							<div className="bg-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400">
								Thinking...
							</div>
						</div>
					)}
				</div>

				{/* Input */}
				<form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={placeholder}
						disabled={isLoading}
						className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text disabled:opacity-50"
					/>
				</form>
			</div>
		</div>
	);
}
