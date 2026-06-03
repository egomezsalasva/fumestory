import type { z } from "zod";
import { FormulaProposalTable } from "@/agent/ui/FormulaProposalTable";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./ChatPanel.module.css";
import CollapseMenuIcon from "./sidenav/svgs/CollapseMenuIcon";

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
	footerNumberInput?: {
		suffix?: string;
		min?: number;
		step?: string;
		placeholder?: string;
		onSubmit: (value: string) => void | Promise<void>;
	} | null;
	hidePanel?: () => void;
};

function eventTargetElement(target: EventTarget | null): Element | null {
	if (!target) return null;
	if (target instanceof Element) return target;
	if (target instanceof Node) return target.parentElement;
	return null;
}

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
	footerNumberInput = null,
	hidePanel,
}: ChatPanelProps) {
	const [input, setInput] = useState("");
	const [numberInput, setNumberInput] = useState("");
	const [choiceFocusIndex, setChoiceFocusIndex] = useState(0);
	const [choiceListFocused, setChoiceListFocused] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const choiceListRef = useRef<HTMLDivElement>(null);
	const textInputRef = useRef<HTMLInputElement>(null);
	const numberInputRef = useRef<HTMLInputElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const isLoadingRef = useRef(isLoading);
	const choiceOptionsRef = useRef(choiceOptions);
	const footerNumberInputRef = useRef(footerNumberInput);
	const footerActionRef = useRef(footerAction);
	isLoadingRef.current = isLoading;
	choiceOptionsRef.current = choiceOptions;
	footerNumberInputRef.current = footerNumberInput;
	footerActionRef.current = footerAction;

	const showChoices = Boolean(choiceOptions?.length && onChoice);
	const showTextInput = !showChoices && !footerNumberInput && !footerAction;

	useEffect(() => {
		if (!showChoices || !choiceOptions?.length) return;
		setChoiceFocusIndex(0);
	}, [showChoices, choiceOptions]);

	useEffect(() => {
		if (!showChoices) setChoiceListFocused(false);
	}, [showChoices]);

	useEffect(() => {
		if (!showChoices) return;

		const onDocumentPointerDown = (e: PointerEvent) => {
			const el = eventTargetElement(e.target);
			if (!el) return;
			if (panelRef.current?.contains(el)) return;
			setChoiceListFocused(false);
		};

		document.addEventListener("pointerdown", onDocumentPointerDown, true);
		return () =>
			document.removeEventListener("pointerdown", onDocumentPointerDown, true);
	}, [showChoices]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading, showChoices]);

	useEffect(() => {
		if (!footerNumberInput) setNumberInput("");
	}, [footerNumberInput]);

	const activateChoiceList = () => {
		if (isLoadingRef.current) return;
		const options = choiceOptionsRef.current;
		if (!options?.length || !onChoice) return;
		setChoiceListFocused(true);
		requestAnimationFrame(() => {
			choiceListRef.current?.focus({ preventScroll: true });
		});
	};

	const activateFooterFocus = () => {
		if (isLoadingRef.current) return;
		const options = choiceOptionsRef.current;
		const hasChoices = Boolean(options?.length && onChoice);
		if (hasChoices) {
			activateChoiceList();
		} else if (footerNumberInputRef.current) {
			numberInputRef.current?.focus({ preventScroll: true });
		} else if (!footerActionRef.current) {
			textInputRef.current?.focus({ preventScroll: true });
		}
	};

	useEffect(() => {
		if (isLoading) return;
		const id = requestAnimationFrame(() => activateFooterFocus());
		return () => cancelAnimationFrame(id);
	}, [
		isLoading,
		showChoices,
		choiceOptions,
		footerNumberInput,
		footerAction,
		showTextInput,
		onChoice,
	]);

	useEffect(() => {
		const panel = panelRef.current;
		if (!panel) return;

		const onPanelPointerDown = (e: PointerEvent) => {
			if (isLoadingRef.current) return;

			const el = eventTargetElement(e.target);
			if (el?.closest("[data-chat-collapse]")) return;

			const options = choiceOptionsRef.current;
			const hasChoices = Boolean(options?.length && onChoice);

			if (hasChoices) {
				const optionEl = el?.closest('[role="option"]');
				if (optionEl?.id && options) {
					const idx = options.findIndex(
						(o) => `chat-choice-${o.id}` === optionEl.id,
					);
					if (idx >= 0) setChoiceFocusIndex(idx);
				}
				e.preventDefault();
				setChoiceListFocused(true);
				requestAnimationFrame(() => {
					choiceListRef.current?.focus({ preventScroll: true });
				});
				return;
			}

			if (!el) return;
			if (el.closest("input, textarea")) return;

			const hasNumber = Boolean(footerNumberInputRef.current);
			const hasText = !footerActionRef.current && !hasNumber;
			if (!hasText && !hasNumber) return;

			e.preventDefault();
			if (hasNumber) {
				numberInputRef.current?.focus({ preventScroll: true });
			} else {
				textInputRef.current?.focus({ preventScroll: true });
			}
		};

		panel.addEventListener("pointerdown", onPanelPointerDown, true);
		return () =>
			panel.removeEventListener("pointerdown", onPanelPointerDown, true);
	}, [onChoice]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = input.trim();
		if (!value || isLoading) return;

		setInput("");
		await onSendMessage(value);
	};

	const handleNumberSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = numberInput.trim();
		if (!value || isLoading || !footerNumberInput) return;

		setNumberInput("");
		await footerNumberInput.onSubmit(value);
	};

	return (
		<div className={`w-full h-full min-h-[18rem] ${className}`}>
			<div ref={panelRef} className={styles.chatPanelContainer}>
				{(title || subtitle) && (
					<div className={styles.chatPanelHeader}>
						<div className={styles.chatPanelHeaderContent}>
							<div className="flex items-center justify-between gap-2">
								{title && <h2>{title}</h2>}
								{hidePanel && (
									<button
										type="button"
										data-chat-collapse
										onClick={hidePanel}
										className="flex items-center gap-1.25 px-1.5 py-0.75 text-[0.625rem] rounded border border-[#464859] bg-[#10151C] text-white hover:bg-[#171D26] cursor-pointer"
									>
										Collapse
										<CollapseMenuIcon
											style={{
												transform: "rotate(180deg)",
												width: "0.625rem",
												height: "0.625rem",
												marginRight: "0.125rem",
											}}
										/>
									</button>
								)}
							</div>
							{subtitle && <p>{subtitle}</p>}
						</div>
					</div>
				)}

				<div className={styles.chatPanelBody}>
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`${styles.messageBubble} ${
									msg.role === "user"
										? styles.messageBubbleUser
										: styles.messageBubbleAssistant
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
								choiceListFocused && choiceOptions![choiceFocusIndex]
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
								const focused = choiceListFocused && i === choiceFocusIndex;
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
								className={styles.chatPanelFooterActionButton}
							>
								{footerAction.label}
							</button>
						) : footerNumberInput ? (
							<form onSubmit={handleNumberSubmit}>
								<div className="flex items-center gap-2">
									<input
										ref={numberInputRef}
										type="number"
										value={numberInput}
										onChange={(e) => setNumberInput(e.target.value)}
										onKeyDown={(e) => {
											if (["e", "E", "+", "-"].includes(e.key)) {
												e.preventDefault();
											}
										}}
										placeholder={
											footerNumberInput.placeholder ?? "Total weight"
										}
										min={footerNumberInput.min ?? 0.01}
										step={footerNumberInput.step ?? "any"}
										inputMode="decimal"
										disabled={isLoading}
										className={styles.chatInput}
									/>
									{footerNumberInput.suffix ? (
										<span className="text-sm text-slate-400 shrink-0">
											{footerNumberInput.suffix}
										</span>
									) : null}
								</div>
							</form>
						) : (
							<form onSubmit={handleSubmit}>
								<input
									ref={textInputRef}
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder={placeholder}
									disabled={isLoading}
									className={styles.chatInput}
								/>
							</form>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
