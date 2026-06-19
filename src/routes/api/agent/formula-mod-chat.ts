import { createFileRoute } from "@tanstack/react-router";
import type { z } from "zod";
import { jsonResponse, noClientResponse } from "@/utils/api";
import { requireCurrentUserId } from "@/utils/current-user";
import { getClient } from "@/db";
import { suggestAnyFormulaProposalSchema } from "@/agent/schemas/compositionFormulaProposal";

type SuggestAnyFormulaProposal = z.infer<
	typeof suggestAnyFormulaProposalSchema
>;

const FORMULA_MODES = {
	KEEP_DILUTIONS: "keep_dilutions",
	INVENTORY_ADJUST: "inventory_adjust",
	SUGGEST_NEW: "suggest_new",
} as const;

type FormulaMode = (typeof FORMULA_MODES)[keyof typeof FORMULA_MODES];

type Body = {
	compositionId?: number | string;
	formulaId?: number | string;
	changeRequest?: string;
	mode?: string;
};

type FormulaLineRow = {
	dilution_id: number;
	formula_percent: number | string;
	weight_grams: number | string;
	material_name: string;
	dilution_percent: number | string;
};

type FormulaHeaderRow = {
	id: number;
	mods: string | null;
};

function toNumber(value: unknown): number | null {
	const n =
		typeof value === "number"
			? value
			: typeof value === "string"
				? Number(value)
				: NaN;
	return Number.isFinite(n) ? n : null;
}

function isFormulaMode(value: string | undefined): value is FormulaMode {
	return (
		value === FORMULA_MODES.KEEP_DILUTIONS ||
		value === FORMULA_MODES.INVENTORY_ADJUST ||
		value === FORMULA_MODES.SUGGEST_NEW
	);
}

function round2(n: number): number {
	return Math.round(n * 100) / 100;
}

function normalizeTo100(lines: SuggestAnyFormulaProposal["lines"]) {
	if (lines.length === 0) return lines;

	const rounded = lines.map((line) => ({
		...line,
		formulaPercent: round2(line.formulaPercent),
	}));

	const total = rounded.reduce((sum, line) => sum + line.formulaPercent, 0);
	const diff = round2(100 - total);

	rounded[rounded.length - 1] = {
		...rounded[rounded.length - 1],
		formulaPercent: round2(rounded[rounded.length - 1].formulaPercent + diff),
	};

	return rounded;
}

function buildReply(proposal: SuggestAnyFormulaProposal): string {
	const tips = proposal.adjustmentTips.map((tip) => `- ${tip}`).join("\n");
	return [proposal.rationale, "", "**Adjustment tips**", "", tips].join("\n");
}

function linesFromDb(
	rows: FormulaLineRow[],
): SuggestAnyFormulaProposal["lines"] {
	return rows.map((row) => ({
		materialDisplayName: row.material_name,
		dilutionPercent: Number(row.dilution_percent),
		formulaPercent: Number(row.formula_percent),
	}));
}

function pickTargetIndex(
	lines: SuggestAnyFormulaProposal["lines"],
	changeRequest: string,
): number {
	const tokens = changeRequest
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((t) => t.length >= 3);

	let bestIdx = 0;
	let bestScore = -1;

	lines.forEach((line, idx) => {
		const name = line.materialDisplayName.toLowerCase();
		const score = tokens.reduce(
			(sum, t) => (name.includes(t) ? sum + 1 : sum),
			0,
		);
		if (score > bestScore) {
			bestScore = score;
			bestIdx = idx;
		}
	});

	return bestIdx;
}

function rebalanceLines(
	lines: SuggestAnyFormulaProposal["lines"],
	targetIdx: number,
	delta: number,
): {
	lines: SuggestAnyFormulaProposal["lines"];
	targetIdx: number;
	donorIdx: number | null;
	applied: number;
} {
	if (lines.length < 2) {
		return { lines, targetIdx, donorIdx: null, applied: 0 };
	}

	const next = [...lines];
	const donorIdx = next
		.map((l, i) => ({ i, p: l.formulaPercent }))
		.filter((x) => x.i !== targetIdx)
		.sort((a, b) => b.p - a.p)[0]?.i;

	if (donorIdx === undefined) {
		return { lines: next, targetIdx, donorIdx: null, applied: 0 };
	}

	const maxTransfer = Math.max(0, next[donorIdx].formulaPercent - 0.5);
	const applied = Math.min(delta, maxTransfer);

	if (applied <= 0) {
		return { lines: next, targetIdx, donorIdx, applied: 0 };
	}

	next[targetIdx] = {
		...next[targetIdx],
		formulaPercent: next[targetIdx].formulaPercent + applied,
	};
	next[donorIdx] = {
		...next[donorIdx],
		formulaPercent: next[donorIdx].formulaPercent - applied,
	};

	return {
		lines: normalizeTo100(next),
		targetIdx,
		donorIdx,
		applied: round2(applied),
	};
}

function explainIntent(changeRequest: string): string {
	const q = changeRequest.toLowerCase();

	if (q.includes("too sweet") || q.includes("less sweet")) {
		return "to reduce perceived sweetness and rebalance the profile";
	}
	if (q.includes("sweeter") || q.includes("more sweet")) {
		return "to increase perceived sweetness and roundness";
	}
	if (q.includes("fresh") || q.includes("brighter")) {
		return "to increase freshness and brightness in the opening";
	}
	if (q.includes("woody") || q.includes("deeper")) {
		return "to increase depth and structure in the drydown";
	}
	if (q.includes("masculine")) {
		return "to shift the profile toward a drier, more structured character";
	}

	return `to better match your request ("${changeRequest}")`;
}

function buildRequestEchoTip(changeRequest: string): string {
	return `Validate against your request ("${changeRequest}") at 30 minutes and again after full drydown.`;
}

function buildMovementTip(
	targetName: string,
	donorName: string,
	applied: number,
): string {
	if (applied <= 0) {
		return "No safe rebalance margin was available; if needed, reduce one dominant line by 1-2% and retest.";
	}

	const half = round2(applied / 2);
	return `You moved ${applied}% from ${donorName} to ${targetName}; if the effect is too strong, try half the transfer (${half}%).`;
}

function keepDilutionsProposal(
	baseLines: SuggestAnyFormulaProposal["lines"],
	changeRequest: string,
): SuggestAnyFormulaProposal {
	const targetIdx = pickTargetIndex(baseLines, changeRequest);
	const result = rebalanceLines(baseLines, targetIdx, 3);

	const targetName =
		baseLines[result.targetIdx]?.materialDisplayName ?? "target line";
	const donorName =
		result.donorIdx !== null
			? (baseLines[result.donorIdx]?.materialDisplayName ?? "supporting line")
			: "supporting line";

	const rationale =
		result.applied > 0
			? `I kept dilution strengths unchanged and moved ${result.applied}% from ${donorName} to ${targetName} ${explainIntent(changeRequest)}. This preserves your original material set while shifting emphasis where it matters.`
			: `I kept dilution strengths unchanged and preserved percentages because there was not enough safe room to rebalance without destabilizing the formula.`;

	return suggestAnyFormulaProposalSchema.parse({
		rationale,
		lines: result.lines,
		adjustmentTips: [
			"Evaluate after 24h and retune in 1-2% steps.",
			"If the opening is too strong, reduce top-note materials first.",
			buildRequestEchoTip(changeRequest),
			buildMovementTip(targetName, donorName, result.applied),
		],
	});
}

function inventoryAdjustProposal(
	baseLines: SuggestAnyFormulaProposal["lines"],
	changeRequest: string,
): SuggestAnyFormulaProposal {
	const targetIdx = pickTargetIndex(baseLines, changeRequest);
	const result = rebalanceLines(baseLines, targetIdx, 5);

	const targetName =
		baseLines[result.targetIdx]?.materialDisplayName ?? "target line";
	const donorName =
		result.donorIdx !== null
			? (baseLines[result.donorIdx]?.materialDisplayName ?? "supporting line")
			: "supporting line";

	const rationale =
		result.applied > 0
			? `I applied an inventory-first rebalance by moving ${result.applied}% from ${donorName} to ${targetName} ${explainIntent(changeRequest)}. This keeps the update practical with your available stock while still making a meaningful shift.`
			: `I kept an inventory-first approach, but avoided percentage transfer because available lines had no safe margin to reduce further.`;

	return suggestAnyFormulaProposalSchema.parse({
		rationale,
		lines: result.lines,
		adjustmentTips: [
			"Swap one material at a time to isolate impact.",
			"Keep total formula at 100% after each substitution.",
			buildRequestEchoTip(changeRequest),
			buildMovementTip(targetName, donorName, result.applied),
		],
	});
}

function suggestNewProposal(
	baseLines: SuggestAnyFormulaProposal["lines"],
	changeRequest: string,
): SuggestAnyFormulaProposal {
	const scaled = baseLines.map((line) => ({
		...line,
		formulaPercent: line.formulaPercent * 0.9,
	}));

	const withAddition = [
		...scaled,
		{
			materialDisplayName: "Hedione (suggested)",
			dilutionPercent: 10,
			formulaPercent: 10,
		},
	];

	return suggestAnyFormulaProposalSchema.parse({
		rationale: `I introduced a suggested non-inventory support material because "${changeRequest}" likely needs an effect your current base alone may not deliver strongly enough. I reduced each existing line proportionally and allocated 10% to Hedione to improve lift and diffusion while keeping the core profile recognizable.`,
		lines: normalizeTo100(withAddition),
		adjustmentTips: [
			"Trial suggested additions at low percentages before scaling.",
			"Check projection and drydown separately when adding new materials.",
			buildRequestEchoTip(changeRequest),
			"Test Hedione at 5%, 10%, and 15% to calibrate lift before committing.",
		],
	});
}

export const Route = createFileRoute("/api/agent/formula-mod-chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const auth = requireCurrentUserId(request);
				if (auth.errorResponse) return auth.errorResponse;
				const userId = auth.userId!;

				const client = await getClient();
				if (!client) return noClientResponse;

				const body = (await request.json().catch(() => ({}))) as Body;

				const compositionId = toNumber(body.compositionId);
				const formulaId = toNumber(body.formulaId);
				const changeRequest = (body.changeRequest ?? "").trim();
				const mode = body.mode;

				if (!compositionId || compositionId <= 0) {
					return jsonResponse(
						{ success: false, error: "Invalid compositionId" },
						400,
					);
				}
				if (!formulaId || formulaId <= 0) {
					return jsonResponse(
						{ success: false, error: "Invalid formulaId" },
						400,
					);
				}
				if (!changeRequest) {
					return jsonResponse(
						{ success: false, error: "changeRequest is required" },
						400,
					);
				}
				if (!isFormulaMode(mode)) {
					return jsonResponse({ success: false, error: "Invalid mode" }, 400);
				}

				try {
					const tx = await client.transaction((txn) => [
						txn.query(`SELECT set_config('app.current_user_id', $1, true)`, [
							userId,
						]),
						txn.query(
							`SELECT f.id, f.mods
							 FROM formulas f
							 JOIN compositions c ON c.id = f.composition_id
							 WHERE c.id = $1
							   AND f.id = $2
							   AND c.owner_id = $3
							 LIMIT 1`,
							[compositionId, formulaId, userId],
						),
						txn.query(
							`SELECT
								fd.dilution_id,
								fd.percentage AS formula_percent,
								fd.weight_grams,
								rm.name AS material_name,
								d.percentage AS dilution_percent
							 FROM formula_dilutions fd
							 JOIN dilutions d ON d.id = fd.dilution_id
							 JOIN raw_materials rm ON rm.id = d.raw_material_id
							 WHERE fd.formula_id = $1
							 ORDER BY fd.id`,
							[formulaId],
						),
					]);

					const formulaRows = tx[1] as FormulaHeaderRow[];
					const lineRows = tx[2] as FormulaLineRow[];

					if (!formulaRows[0]) {
						return jsonResponse(
							{
								success: false,
								error: "Formula not found for this composition",
							},
							404,
						);
					}

					if (lineRows.length === 0) {
						return jsonResponse(
							{ success: false, error: "Selected formula has no lines" },
							404,
						);
					}

					const baseLines = linesFromDb(lineRows);

					const proposal =
						mode === FORMULA_MODES.KEEP_DILUTIONS
							? keepDilutionsProposal(baseLines, changeRequest)
							: mode === FORMULA_MODES.INVENTORY_ADJUST
								? inventoryAdjustProposal(baseLines, changeRequest)
								: suggestNewProposal(baseLines, changeRequest);

					const allowApplyToForm =
						mode === FORMULA_MODES.KEEP_DILUTIONS ||
						mode === FORMULA_MODES.INVENTORY_ADJUST;

					return jsonResponse(
						{
							success: true,
							reply: buildReply(proposal),
							proposal,
							allowApplyToForm,
						},
						200,
					);
				} catch (error) {
					console.error("[formula-mod-chat] error:", error);
					return jsonResponse(
						{
							success: false,
							error: "Failed to generate formula modification proposal",
						},
						500,
					);
				}
			},
		},
	},
});
