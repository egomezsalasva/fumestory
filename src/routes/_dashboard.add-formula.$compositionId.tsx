import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FormulaIngredientsFields } from "@/components/FormulaIngredientsFields";
import { type Ingredient } from "@/hooks/useFormulaIngredients";
import { getOfflineUsage } from "@/offline/db";
import { isOffline } from "@/runtime";
import { authedFetch } from "@/utils/authed-fetch";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { FormulaModAgentPanel } from "@/agent/ui/FormulaModAgentPanel";
import styles from "@/components/Form.module.css";
import SuccessMessage from "@/components/SuccessMessage";
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";

type UserSettingsResponse = {
	success?: boolean;
	data?: Pick<UserSettingsEffective, "formula_mod_agent_collapsed">;
	error?: string;
};

export const Route = createFileRoute("/_dashboard/add-formula/$compositionId")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Add Formula" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AddFormula,
});

function AddFormula() {
	const offline = isOffline();
	const { compositionId } = Route.useParams();

	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [prefillIngredients, setPrefillIngredients] = useState<
		Ingredient[] | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAutofilling, setIsAutofilling] = useState(false);
	const [formResetKey, setFormResetKey] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [hasSelectedAgentMod, setHasSelectedAgentMod] = useState(false);
	const [hasUsedPreviousAutofill, setHasUsedPreviousAutofill] = useState(false);
	const [modsLeft, setModsLeft] = useState<number | null>(null);

	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean | null>(
		null,
	);

	const shouldHideAutofillButton =
		hasSelectedAgentMod || hasUsedPreviousAutofill;

	const refreshUsage = useCallback(async () => {
		if (!offline) return;
		try {
			const usage = await getOfflineUsage();
			setModsLeft(usage.mods.left);
		} catch {
			// ignore — chip is optional
		}
	}, [offline]);

	useEffect(() => {
		void refreshUsage();
	}, [refreshUsage]);

	const loadUserSettings = useCallback(() => {
		let cancelled = false;

		const run = async () => {
			try {
				const res = await authedFetch("/api/user-settings");
				const json = (await res.json()) as UserSettingsResponse;

				if (!cancelled) {
					setIsSidebarCollapsed(
						offline ||
							(res.ok && json?.data?.formula_mod_agent_collapsed === true),
					);
				}
			} catch {
				if (!cancelled) {
					setIsSidebarCollapsed(offline);
				}
			}
		};

		void run();

		return () => {
			cancelled = true;
		};
	}, [offline]);

	useEffect(() => {
		const cleanup = loadUserSettings();
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		return () => {
			cleanup();
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, loadUserSettings);
		};
	}, [loadUserSettings]);

	const handleToggleSidebar = async () => {
		if (offline || isSidebarCollapsed === null) return;

		const next = !isSidebarCollapsed;
		setIsSidebarCollapsed(next);

		try {
			await authedFetch("/api/user-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ formula_mod_agent_collapsed: next }),
			});
		} catch {
			// Keep optimistic UI state even if save fails.
		}
	};

	const handleCloseSidebar = async () => {
		if (offline || isSidebarCollapsed === true) return;

		setIsSidebarCollapsed(true);
		await authedFetch("/api/user-settings", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ formula_mod_agent_collapsed: true }),
		});
	};

	const handleAutofillFromPrevious = async () => {
		setHasUsedPreviousAutofill(true);
		setError(null);
		setIsAutofilling(true);

		try {
			const res = await authedFetch(`/api/compositions/${compositionId}`);
			const json = await res.json();

			if (!res.ok) {
				setError(json.error || "Failed to load previous formula");
				return;
			}

			const formulas = json?.data?.formulas as
				| Array<{
						id: number;
						lines?: Array<{
							dilution_id: number;
							material_label: string;
							material_name: string;
							percentage: number;
							weight_grams: number;
						}>;
				  }>
				| undefined;

			if (!formulas || formulas.length === 0) {
				setError("No previous formula found for this composition");
				return;
			}

			const previous = formulas[formulas.length - 1];
			const lines = previous?.lines ?? [];

			if (lines.length === 0) {
				setError("Previous formula has no ingredient lines");
				return;
			}

			setPrefillIngredients(
				lines.map((line) => ({
					id: crypto.randomUUID(),
					raw_material_id: null,
					raw_material_name: line.material_name,
					dilution_id: line.dilution_id,
					dilution_percentage: null,
					weight_grams: String(line.weight_grams),
					formula_percentage: String(line.percentage),
					displayText: `${line.material_name}`,
				})),
			);
		} catch {
			setError("Failed to autofill from previous formula");
		} finally {
			setIsAutofilling(false);
		}
	};

	const handleApplyFromAgent = (nextIngredients: Ingredient[]) => {
		setError(null);
		setSuccess(false);
		setPrefillIngredients(nextIngredients);
		setFormResetKey((k) => k + 1);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		const activeIngredients = ingredients.filter(
			(ing) => ing.dilution_id !== null,
		);
		const totalPercent = activeIngredients.reduce(
			(sum, ing) => sum + (parseFloat(ing.formula_percentage) || 0),
			0,
		);
		if (Math.abs(totalPercent - 100) > 0.0001) {
			setError(
				`Formula must total 100%. Current total: ${totalPercent.toFixed(2)}%.`,
			);
			setIsSubmitting(false);
			return;
		}

		const formulaData = {
			ingredients: ingredients
				.filter((ing) => ing.dilution_id !== null)
				.map((ing) => ({
					dilution_id: ing.dilution_id!,
					weight_grams: parseFloat(ing.weight_grams) || 0,
					formula_percentage: parseFloat(ing.formula_percentage) || 0,
				})),
		};

		try {
			const response = await authedFetch(`/api/compositions/${compositionId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formulaData),
			});

			const result = await response.json();
			if (!response.ok) {
				setError(result.error || "Failed to create mod");
				setIsSubmitting(false);
				return;
			}

			setIngredients([]);
			setPrefillIngredients(null);
			setFormResetKey((k) => k + 1);
			setSuccess(true);
			setIsSubmitting(false);
			void refreshUsage();
		} catch {
			setError("An error occurred while creating the mod");
			setIsSubmitting(false);
		}
	};

	const pageTitle = (
		<span className="inline-flex items-center gap-3">
			Compositions / Composition Details / Add Formula
			{modsLeft != null ? (
				<span className="text-sm text-slate-400 tabular-nums font-normal">
					{modsLeft} left
				</span>
			) : null}
		</span>
	);

	if (isSidebarCollapsed === null) {
		return (
			<DashboardLayout
				title={pageTitle}
				backButton={{
					to: "/composition/$compositionId",
					params: { compositionId },
				}}
				agentToggle={!offline}
				showCogButton={true}
			>
				<></>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout
			title={pageTitle}
			backButton={{
				to: "/composition/$compositionId",
				params: { compositionId },
			}}
			agentToggle={!offline}
			onAgentToggleClick={offline ? undefined : handleToggleSidebar}
			showCogButton={true}
			cogButtonHash="project-settings"
		>
			<div
				className={`dashboardSplitLayout ${isSidebarCollapsed ? "isSidebarCollapsed" : ""}`}
			>
				<div className={styles.formContainerWrapper}>
					<form onSubmit={handleSubmit} className={styles.formContainer}>
						<FormulaIngredientsFields
							key={formResetKey}
							styleHeader={{ marginBottom: "1.5rem", minHeight: "2.5rem" }}
							onIngredientsChange={setIngredients}
							prefillIngredients={prefillIngredients}
							headerRight={
								<button
									type="button"
									onClick={handleAutofillFromPrevious}
									disabled={
										isAutofilling || isSubmitting || shouldHideAutofillButton
									}
									aria-hidden={shouldHideAutofillButton}
									className={styles.formSubmitButton}
									style={{
										padding: "0.375rem 1.5rem",
										fontWeight: "400",
										fontSize: "0.875rem",
										visibility: shouldHideAutofillButton ? "hidden" : "visible",
										pointerEvents: shouldHideAutofillButton ? "none" : "auto",
									}}
								>
									{isAutofilling
										? "Autofilling..."
										: "Autofill with previous formula"}
								</button>
							}
						/>

						<div
							className={styles.formSubmitButtonContainer}
							style={{ marginTop: "0" }}
						>
							<button
								type="submit"
								disabled={isSubmitting}
								className={styles.formSubmitButton}
							>
								{isSubmitting ? "Submitting..." : "+ Create Formula"}
							</button>
						</div>

						{success && (
							<SuccessMessage
								message="Formula created successfully!"
								link={{
									text: "Go to Composition",
									to: `/composition/${compositionId}`,
								}}
								onClose={() => setSuccess(false)}
							/>
						)}

						{error && (
							<div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
								{error}
							</div>
						)}
					</form>
				</div>

				<div className="dashboardSplitSidebar">
					<div className="dashboardSplitSidebarSticky">
						<div className="dashboardSplitSidebarClip">
							<FormulaModAgentPanel
								compositionId={compositionId}
								hidePanel={handleCloseSidebar}
								onApplyToForm={handleApplyFromAgent}
								onFirstModSelected={() => setHasSelectedAgentMod(true)}
							/>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
