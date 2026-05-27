import type { z } from "zod";
import { FormulaProposalTable } from "@/agent/ui/FormulaProposalTable";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type FormulaProposal = z.infer<typeof suggestAnyFormulaProposalSchema>;

export type ChatMessage = {
	role: "user" | "assistant";
	content: string;
	formulaProposal?: FormulaProposal;
	inventoryOnlyTotalWeight?: string;
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
	footerAction?: {
		label: string;
		onClick: () => void | Promise<void>;
		disabled?: boolean;
	} | null;
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
	footerAction = null,
}: ChatPanelProps) {
	const [input, setInput] = useState("");
	const [choiceFocusIndex, setChoiceFocusIndex] = useState(0);
	const choiceListRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const showChoices = Boolean(choiceOptions?.length && onChoice);

	useEffect(() => {
		if (!showChoices || !choiceOptions?.length) return;
		setChoiceFocusIndex(0);
	}, [showChoices, choiceOptions]);

	useEffect(() => {
		if (!showChoices || isLoading) return;
		choiceListRef.current?.focus();
	}, [showChoices, isLoading]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading, showChoices]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = input.trim();
		if (!value || isLoading) return;

		setInput("");
		await onSendMessage(value);
	};

	return (
		<div className={`w-full h-full min-h-0 ${className}`}>
			<div className="bg-slate-800 rounded-lg border border-slate-700 h-full flex flex-col shadow-xl">
				{(title || subtitle) && (
					<div className="p-3 border-b border-slate-700">
						<div className="rounded-md bg-slate-700/40 px-3 py-2">
							{title && (
								<h2 className="text-md font-semibold text-white">{title}</h2>
							)}
							{subtitle && (
								<p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">
									{subtitle}
								</p>
							)}
						</div>
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
									<>
										{msg.formulaProposal ? (
											<>
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
														{msg.formulaProposal.rationale}
													</ReactMarkdown>
												</div>

												<p className="mt-3 mb-2 text-sm font-semibold text-slate-50">
													Starter formula
												</p>
												<div className="overflow-x-auto">
													<FormulaProposalTable
														lines={msg.formulaProposal.lines}
														inventoryOnlyTotalWeight={
															msg.inventoryOnlyTotalWeight
														}
													/>
												</div>

												{(() => {
													const rationale =
														msg.formulaProposal.rationale.trim();
													const footer = msg.content.startsWith(rationale)
														? msg.content.slice(rationale.length).trimStart()
														: msg.content;

													return footer ? (
														<div className="prose prose-invert prose-sm max-w-none mt-3">
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
																		<li className="text-slate-200">
																			{children}
																		</li>
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
																{footer}
															</ReactMarkdown>
														</div>
													) : null;
												})()}
											</>
										) : (
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
										)}
									</>
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
					<div
						ref={messagesEndRef}
						aria-hidden
						className="h-px w-full shrink-0"
					/>
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
					<div className="p-4 border-t border-slate-700">
						{footerAction ? (
							<button
								type="button"
								onClick={() => void footerAction.onClick()}
								disabled={isLoading || footerAction.disabled}
								className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{footerAction.label}
							</button>
						) : (
							<form onSubmit={handleSubmit}>
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
				)}
			</div>
		</div>
	);
}
