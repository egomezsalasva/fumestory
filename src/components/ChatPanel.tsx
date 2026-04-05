import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export type ChatChoiceOption = {
	id: string;
	label: string;
};

type ChatPanelProps = {
	messages: ChatMessage[];
	onSendMessage: (message: string) => void | Promise<void>;
	isLoading?: boolean;
	placeholder?: string;
	title?: string;
	subtitle?: string;
	className?: string;
	choiceOptions?: ChatChoiceOption[] | null;
	onChoice?: (optionId: string) => void | Promise<void>;
};

export function ChatPanel({
	messages,
	onSendMessage,
	isLoading = false,
	placeholder = "Type a message...",
	title,
	subtitle,
	className = "",
	choiceOptions = null,
	onChoice,
}: ChatPanelProps) {
	const [input, setInput] = useState("");
	const [choiceFocusIndex, setChoiceFocusIndex] = useState(0);
	const choiceListRef = useRef<HTMLDivElement>(null);

	const showChoices = Boolean(choiceOptions?.length && onChoice);

	useEffect(() => {
		if (!showChoices || !choiceOptions?.length) return;
		setChoiceFocusIndex(0);
	}, [showChoices, choiceOptions]);

	useEffect(() => {
		if (!showChoices || isLoading) return;
		choiceListRef.current?.focus();
	}, [showChoices, isLoading]);

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
								{msg.role === "assistant" ? (
									<div className="prose prose-invert prose-sm max-w-none">
										<ReactMarkdown
											components={{
												h3: ({ children }) => (
													<h3 className="text-base font-semibold mt-3 mb-2 text-slate-100">
														{children}
													</h3>
												),
												strong: ({ children }) => (
													<strong className="font-semibold text-slate-50">
														{children}
													</strong>
												),
												ul: ({ children }) => (
													<ul className="list-disc list-inside space-y-1 my-2">
														{children}
													</ul>
												),
												li: ({ children }) => (
													<li className="text-slate-200">{children}</li>
												),
												p: ({ children }) => (
													<p className="mb-2 last:mb-0 leading-relaxed">
														{children}
													</p>
												),
												hr: () => (
													<hr className="mt-6 mb-2 w-full border-0 border-t border-slate-500/50 py-2" />
												),
											}}
										>
											{msg.content}
										</ReactMarkdown>
									</div>
								) : (
									<p className="whitespace-pre-wrap leading-relaxed">
										{msg.content}
									</p>
								)}
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

				{showChoices ? (
					<div className="p-4 border-t border-slate-700">
						<div
							ref={choiceListRef}
							role="listbox"
							tabIndex={0}
							aria-activedescendant={
								choiceOptions![choiceFocusIndex]
									? `chat-choice-${choiceOptions![choiceFocusIndex].id}`
									: undefined
							}
							onKeyDown={(e) => {
								if (isLoading || !choiceOptions?.length) return;
								const n = choiceOptions.length;
								if (e.key === "ArrowDown") {
									e.preventDefault();
									setChoiceFocusIndex((i) => (i + 1) % n);
								} else if (e.key === "ArrowUp") {
									e.preventDefault();
									setChoiceFocusIndex((i) => (i - 1 + n) % n);
								} else if (e.key === "Enter") {
									e.preventDefault();
									const opt = choiceOptions[choiceFocusIndex];
									if (opt) void onChoice!(opt.id);
								}
							}}
							className="font-mono text-sm text-slate-200 outline-none rounded-md ring-2 ring-transparent px-1 py-1 -mx-1"
						>
							{choiceOptions!.map((opt, i) => {
								const focused = i === choiceFocusIndex;
								return (
									<div
										key={opt.id}
										id={`chat-choice-${opt.id}`}
										role="option"
										aria-selected={focused}
										className={`py-0.5 pl-0 cursor-default ${
											focused
												? "text-slate-50 underline underline-offset-2 decoration-slate-400"
												: "text-slate-500"
										}`}
									>
										<span className="inline-block w-[1ch] text-slate-400">
											{focused ? ">" : " "}
										</span>
										<span className="inline-block w-[1ch]" aria-hidden>
											{" "}
										</span>
										<span
											className={
												focused
													? "underline underline-offset-2 decoration-slate-400"
													: undefined
											}
										>
											{opt.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="p-4 border-t border-slate-700"
					>
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder={placeholder}
							disabled={isLoading}
							className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none cursor-text disabled:opacity-50"
						/>
					</form>
				)}
			</div>
		</div>
	);
}
