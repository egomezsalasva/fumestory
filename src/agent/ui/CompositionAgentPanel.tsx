import { useEffect, useRef, useState } from "react";
import {
	ChatPanel,
	type ChatChoiceOption,
	type ChatMessage,
} from "@/components/ChatPanel";
import type { z } from "zod";
import type { CompositionFormPrefill } from "@/agent/composition-chat/compositionFormPrefill";
import { COMPOSITION_CHOICE } from "@/agent/composition-chat/flow";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";
import { authedFetch } from "@/utils/authed-fetch";

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;

type CompositionAgentPanelProps = {
	onStartOverClick: () => void;
	onApplyProposal?: (
		proposal: SuggestAnyFormulaProposal,
		inventoryOnlyTotalWeight?: string,
		formPrefill?: CompositionFormPrefill,
	) => void;
	hidePanel: () => void;
};

type ChatResponse = {
	success?: boolean;
	reply?: string;
	error?: string;
	resetConversation?: boolean;
	proposal?: SuggestAnyFormulaProposal;
	inventoryOnlyTotalWeight?: string;
	formPrefill?: CompositionFormPrefill;
	expectWeightGrams?: boolean;
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
	onApplyProposal,
	hidePanel,
}: CompositionAgentPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [choiceOptions, setChoiceOptions] = useState<ChatChoiceOption[] | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [expectWeightGrams, setExpectWeightGrams] = useState(false);
	const [pendingProposal, setPendingProposal] =
		useState<SuggestAnyFormulaProposal | null>(null);
	const [pendingInventoryOnlyTotalWeight, setPendingInventoryOnlyTotalWeight] =
		useState<string | null>(null);
	const [pendingFormPrefill, setPendingFormPrefill] =
		useState<CompositionFormPrefill | null>(null);
	const [showStartOverAction, setShowStartOverAction] = useState(false);

	const hasUserResponded = messages.some((m) => m.role === "user");

	const clearPendingProposal = () => {
		setPendingProposal(null);
		setPendingInventoryOnlyTotalWeight(null);
		setPendingFormPrefill(null);
	};

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
			clearPendingProposal();
			setExpectWeightGrams(false);
			setShowStartOverAction(false);
			return;
		}

		const reply =
			data.reply ?? "Sorry, I encountered an error. Please try again.";

		if (data.resetConversation) {
			clearPendingProposal();
			setShowStartOverAction(false);
			setMessages([
				assistantMessage(reply, data.proposal, data.inventoryOnlyTotalWeight),
			]);
		} else {
			setPendingProposal(data.proposal ?? null);
			setPendingInventoryOnlyTotalWeight(data.inventoryOnlyTotalWeight ?? null);
			setPendingFormPrefill(data.formPrefill ?? null);
			setMessages((prev) => [
				...prev,
				assistantMessage(reply, data.proposal, data.inventoryOnlyTotalWeight),
			]);
		}

		if (
			data.interaction?.kind === "choice" &&
			data.interaction.options?.length
		) {
			const options = data.interaction.options;
			const isOnlyStartOver =
				options.length === 1 && options[0].id === COMPOSITION_CHOICE.START_OVER;

			if (isOnlyStartOver) {
				setChoiceOptions(null);
				setShowStartOverAction(true);
			} else {
				setChoiceOptions(options);
				setShowStartOverAction(false);
			}
		} else {
			setChoiceOptions(null);
		}

		setExpectWeightGrams(data.expectWeightGrams === true);
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
				if (!cancelled) await sendToApi({ resetConversation: "true" });
			} catch {
				if (!cancelled) {
					setMessages([
						{
							role: "assistant",
							content: "Sorry, I encountered an error. Please try again.",
						},
					]);
					clearPendingProposal();
					setExpectWeightGrams(false);
					setShowStartOverAction(false);
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

	const handleStartOverClick = async () => {
		if (isLoading) return;
		onStartOverClick();
		setShowStartOverAction(false);
		setChoiceOptions(null);
		clearPendingProposal();
		setExpectWeightGrams(false);
		setIsLoading(true);
		try {
			await sendToApi({ resetConversation: "true" });
		} catch {
			setMessages([
				{
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = async (message: string) => {
		if (isLoading) return;
		setShowStartOverAction(false);
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
			clearPendingProposal();
			setExpectWeightGrams(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitWeightGrams = async (value: string) => {
		if (isLoading) return;

		const trimmed = value.trim();
		if (!/^\d+(\.\d+)?$/.test(trimmed)) return;

		setShowStartOverAction(false);
		setMessages((prev) => [...prev, { role: "user", content: `${trimmed} g` }]);
		setIsLoading(true);

		try {
			await sendToApi({ message: trimmed });
		} catch {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
				},
			]);
			setChoiceOptions(null);
			clearPendingProposal();
			setExpectWeightGrams(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChoice = async (choiceId: string) => {
		if (isLoading) return;

		if (choiceId === COMPOSITION_CHOICE.APPLY_TO_FORM) {
			if (!pendingProposal || !onApplyProposal) return;
			const label =
				choiceOptions?.find((o) => o.id === choiceId)?.label ?? "Apply to form";
			setChoiceOptions(null);
			setMessages((prev) => [...prev, { role: "user", content: label }]);
			onApplyProposal(
				pendingProposal,
				pendingInventoryOnlyTotalWeight ?? undefined,
				pendingFormPrefill ?? undefined,
			);
			clearPendingProposal();
			setShowStartOverAction(true);
			return;
		}

		if (choiceId === COMPOSITION_CHOICE.START_OVER) {
			onStartOverClick();
			clearPendingProposal();
			setShowStartOverAction(false);
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
			clearPendingProposal();
			setExpectWeightGrams(false);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ChatPanel
			title={!hasUserResponded ? "Composition Agent" : undefined}
			subtitle={
				!hasUserResponded
					? "This agent helps you come up with a strating formula for eiter an accord or a perfume.\nYou can pick materials from your inventory or let it suggest materials for you."
					: undefined
			}
			messages={messages}
			onSendMessage={handleSendMessage}
			isLoading={isLoading}
			placeholder="Type your idea..."
			choiceOptions={choiceOptions}
			onChoice={handleChoice}
			footerNumberInput={
				expectWeightGrams && !choiceOptions?.length
					? {
							suffix: "g",
							min: 0.01,
							step: "any",
							placeholder: "Total weight",
							onSubmit: handleSubmitWeightGrams,
						}
					: null
			}
			footerAction={
				showStartOverAction
					? {
							label: "Start Over",
							onClick: handleStartOverClick,
							disabled: isLoading,
						}
					: null
			}
			className="h-full min-h-0"
			hidePanel={hidePanel}
		/>
	);
}
