import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Dilution } from "./api.dilutions";
import { authedFetch } from "@/utils/authed-fetch";
import {
	notifyNavEligibilityUpdated,
	requireNavRoute,
} from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import SuccessMessage from "@/components/SuccessMessage";
import styles from "@/components/Form.module.css";

export const Route = createFileRoute("/_dashboard/scent-blind-test")({
	...requireNavRoute("/scent-blind-test"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Scent Blind Test" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: ScentBlindTest,
});

type Step = "select" | "test" | "done";

type DilutionOption = {
	dilutionId: number;
	materialName: string;
	percentage: number;
	displayText: string;
};

function buildDilutionOptions(
	dilutions: Dilution[],
	materials: { id: number; name: string }[],
): DilutionOption[] {
	return dilutions
		.filter((d) => d.available)
		.map((d) => {
			const material = materials.find((m) => m.id === d.raw_material_id);
			const materialName = material?.name ?? "Unknown";
			const displayText = `${materialName} - ${d.percentage}%`;
			return {
				dilutionId: d.id,
				materialName,
				percentage: d.percentage,
				displayText,
			};
		})
		.sort((a, b) => {
			const nameCmp = a.materialName.localeCompare(b.materialName);
			if (nameCmp !== 0) return nameCmp;
			return a.percentage - b.percentage;
		});
}

function ScentBlindTest() {
	const [step, setStep] = useState<Step>("select");
	const [options, setOptions] = useState<DilutionOption[]>([]);
	const [loadOptionsError, setLoadOptionsError] = useState("");
	const [loadingOptions, setLoadingOptions] = useState(true);

	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [matchedByDilutionId, setMatchedByDilutionId] = useState<
		Record<number, boolean | null>
	>({});

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [lastRunScore, setLastRunScore] = useState<{
		correct: number;
		total: number;
	} | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const [materialsRes, dilutionsRes] = await Promise.all([
					authedFetch("/api/raw-materials"),
					authedFetch("/api/dilutions"),
				]);
				const materialsJson = await materialsRes.json();
				const dilutionsJson = await dilutionsRes.json();
				if (cancelled) return;

				if (!materialsRes.ok || !dilutionsRes.ok) {
					setLoadOptionsError("Failed to load dilutions");
					return;
				}

				const materials = Array.isArray(materialsJson?.data)
					? materialsJson.data
					: [];
				const dilutions = Array.isArray(dilutionsJson?.data)
					? (dilutionsJson.data as Dilution[])
					: [];
				setOptions(buildDilutionOptions(dilutions, materials));
			} catch {
				if (!cancelled) setLoadOptionsError("Failed to load dilutions");
			} finally {
				if (!cancelled) setLoadingOptions(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const uniquePercentages = useMemo(() => {
		const set = new Set<number>();
		for (const opt of options) set.add(opt.percentage);
		return [...set].sort((a, b) => a - b);
	}, [options]);

	const selectedOptions = useMemo(
		() => options.filter((o) => selectedIds.has(o.dilutionId)),
		[options, selectedIds],
	);

	const testRows = useMemo(() => selectedOptions, [selectedOptions]);

	const allMarked =
		testRows.length > 0 &&
		testRows.every((row) => matchedByDilutionId[row.dilutionId] !== null);

	const toggleSelected = (dilutionId: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(dilutionId)) next.delete(dilutionId);
			else next.add(dilutionId);
			return next;
		});
	};

	const selectAll = () => {
		setSelectedIds(new Set(options.map((o) => o.dilutionId)));
	};

	const clearSelection = () => {
		setSelectedIds(new Set());
	};

	const selectByPercentage = (percentage: number) => {
		const ids = options
			.filter((o) => o.percentage === percentage)
			.map((o) => o.dilutionId);
		setSelectedIds(new Set(ids));
	};

	const startTest = () => {
		if (selectedIds.size === 0) return;
		const initial: Record<number, boolean | null> = {};
		for (const id of selectedIds) initial[id] = null;
		setMatchedByDilutionId(initial);
		setError("");
		setStep("test");
	};

	const setMatched = (dilutionId: number, matched: boolean) => {
		setMatchedByDilutionId((prev) => ({ ...prev, [dilutionId]: matched }));
	};

	const resetWizard = useCallback(() => {
		setStep("select");
		setSelectedIds(new Set());
		setMatchedByDilutionId({});
		setError("");
		setSuccessMessage("");
		setLastRunScore(null);
	}, []);

	const handleSubmit = async () => {
		if (!allMarked) return;
		setSubmitting(true);
		setError("");

		const items = testRows.map((row) => ({
			dilution_id: row.dilutionId,
			matched: matchedByDilutionId[row.dilutionId] as boolean,
		}));

		try {
			const res = await authedFetch("/api/scent-blind-tests", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ items }),
			});
			const json = await res.json();

			if (!res.ok) {
				setError(json.error ?? "Failed to save test");
				return;
			}

			notifyNavEligibilityUpdated({ hasScentTests: true });
			const correct = items.filter((i) => i.matched).length;
			setLastRunScore({ correct, total: items.length });
			setSuccessMessage("Scent blind test saved.");
			setStep("done");
		} catch {
			setError("Failed to save test");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<DashboardLayout
			title="Scent Blind Test"
			backButton={{ to: "/scent-knowledge" }}
		>
			<div className="max-w-170 mx-auto">
				<p className="text-sm text-slate-400 mb-6">
					Choose the dilutions you want to test from the list below. Give them
					to a partner so they can hide the labels from you. Your partner will
					then present you with a scent strip without revealing which dilution
					it is.
				</p>

				<div className={styles.formContainer}>
					{loadingOptions && (
						<p className="text-sm text-slate-400">Loading dilutions…</p>
					)}

					{loadOptionsError && (
						<div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
							{loadOptionsError}
						</div>
					)}

					{!loadingOptions && !loadOptionsError && step === "select" && (
						<>
							<p className="text-sm text-slate-300">
								Step 1 — Select dilutions to include in this test.
							</p>

							{options.length > 0 && (
								<div className="flex flex-wrap items-center justify-between gap-2 mb-4">
									<div className="flex flex-wrap gap-2">
										<button
											type="button"
											className={`${styles.feedbackNoRatingButton} ${styles.feedbackNoRatingButtonInactive} inline-flex items-center justify-center h-7 py-0 px-2`}
											onClick={selectAll}
										>
											Select all
										</button>
										{uniquePercentages.map((percentage) => (
											<button
												key={percentage}
												type="button"
												className={`${styles.feedbackNoRatingButton} ${styles.feedbackNoRatingButtonInactive} inline-flex items-center justify-center h-7 py-0 px-2`}
												onClick={() => selectByPercentage(percentage)}
											>
												{percentage}%
											</button>
										))}
									</div>
									<button
										type="button"
										className={`${styles.feedbackNoRatingButton} ${styles.feedbackNoRatingButtonInactive} inline-flex items-center justify-center h-7 py-0 px-2 shrink-0`}
										onClick={clearSelection}
									>
										Clear
									</button>
								</div>
							)}

							{options.length === 0 ? (
								<p className="text-sm text-yellow-300">
									No available dilutions. Add dilutions in inventory first.
								</p>
							) : (
								<ul className="space-y-2 max-h-96 overflow-y-auto">
									{options.map((opt) => (
										<li key={opt.dilutionId}>
											<label className="flex items-center gap-3 text-slate-200 cursor-pointer">
												<input
													type="checkbox"
													checked={selectedIds.has(opt.dilutionId)}
													onChange={() => toggleSelected(opt.dilutionId)}
													className="shrink-0"
												/>
												<span>{opt.displayText}</span>
											</label>
										</li>
									))}
								</ul>
							)}
							<div className={styles.formSubmitButtonContainer}>
								<button
									type="button"
									disabled={selectedIds.size === 0}
									className={styles.formSubmitButton}
									onClick={startTest}
								>
									Continue to test
								</button>
							</div>
						</>
					)}

					{step === "test" && (
						<>
							<p className="text-sm text-slate-300">
								Step 2 — Mark it as correct if you identified the raw material
								correctly.
							</p>
							<ul className="space-y-4">
								{testRows.map((row) => {
									const matched = matchedByDilutionId[row.dilutionId];
									return (
										<li
											key={row.dilutionId}
											className="flex flex-wrap items-center justify-between gap-3 p-3 rounded border border-slate-700 bg-slate-900/40"
										>
											<span className="text-slate-200">{row.displayText}</span>
											<div className="flex gap-2">
												<button
													type="button"
													aria-label="Matched correctly"
													onClick={() => setMatched(row.dilutionId, true)}
													className={`min-w-10 h-10 rounded border text-lg ${
														matched === true
															? "bg-green-600/30 border-green-500 text-green-200"
															: "bg-slate-800 border-slate-600 text-slate-400"
													}`}
												>
													✓
												</button>
												<button
													type="button"
													aria-label="Did not match"
													onClick={() => setMatched(row.dilutionId, false)}
													className={`min-w-10 h-10 rounded border text-lg ${
														matched === false
															? "bg-red-600/30 border-red-500 text-red-200"
															: "bg-slate-800 border-slate-600 text-slate-400"
													}`}
												>
													✗
												</button>
											</div>
										</li>
									);
								})}
							</ul>
							<div className="flex flex-wrap gap-3 justify-center">
								<button
									type="button"
									className={styles.formSubmitButton}
									onClick={() => setStep("select")}
								>
									Back
								</button>
								<button
									type="button"
									disabled={!allMarked || submitting}
									className={styles.formSubmitButton}
									onClick={() => void handleSubmit()}
								>
									{submitting ? "Saving…" : "Save test"}
								</button>
							</div>
						</>
					)}

					{step === "done" && lastRunScore && (
						<>
							<p className="text-slate-200">
								You got {lastRunScore.correct} of {lastRunScore.total} correct (
								{Math.round((100 * lastRunScore.correct) / lastRunScore.total)}%
								this run).
							</p>
							<div className={styles.formSubmitButtonContainer}>
								<button
									type="button"
									className={styles.formSubmitButton}
									onClick={resetWizard}
								>
									Start another test
								</button>
							</div>
						</>
					)}

					{successMessage && step === "done" && (
						<SuccessMessage
							message={successMessage}
							link={{
								text: "View Scent Knowledge",
								to: "/scent-knowledge",
							}}
							onClose={() => setSuccessMessage("")}
						/>
					)}

					{error && (
						<div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
							{error}
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
