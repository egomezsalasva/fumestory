import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const gradientResultSchema = z.object({
	gradient: z
		.string()
		.describe(
			"A valid CSS background value, e.g. linear-gradient(135deg, #f5a623, #e85d04). Use 2–4 hex stops. No quotes.",
		),
});

const SYSTEM = `You convert a perfume / olfactory note name into a CSS linear-gradient that visually suggests that smell or material.

Rules:
- Return only a CSS linear-gradient(...) using hex colors (#rrggbb).
- Prefer 135deg, 2–4 color stops.
- Colors must feel related to the word (mandarine → orange/citrus; rose → pink; woody → browns; marine → blues).
- Keep colors readable as a small UI dot (not near-white on white, not pure black).
- No explanations.`;

/**
 * AI: note name → CSS linear-gradient string.
 * Server-only (needs OPENAI_API_KEY).
 */
export async function textToCssGradient(name: string): Promise<string> {
	const key = name.trim().toLowerCase();
	if (!key) {
		return "linear-gradient(135deg, #94a3b8, #64748b)";
	}

	const result = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: gradientResultSchema }),
		system: SYSTEM,
		prompt: `Note name: ${key}`,
	});

	const gradient = result.output?.gradient?.trim();
	if (!gradient || !gradient.toLowerCase().includes("gradient")) {
		return "linear-gradient(135deg, #94a3b8, #64748b)";
	}
	return gradient;
}

/**
 * Batch version — one model call for several new note names.
 */
export async function textToCssGradients(
	names: string[],
): Promise<Record<string, string>> {
	const unique = [
		...new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean)),
	];
	if (unique.length === 0) return {};

	const batchSchema = z.object({
		items: z.array(
			z.object({
				name: z.string(),
				gradient: z.string(),
			}),
		),
	});

	const result = await generateText({
		model: openai("gpt-4o-mini"),
		output: Output.object({ schema: batchSchema }),
		system: SYSTEM,
		prompt: `Return a gradient for each note name:\n${unique.map((n) => `- ${n}`).join("\n")}`,
	});

	const out: Record<string, string> = {};
	for (const name of unique) {
		out[name] = "linear-gradient(135deg, #94a3b8, #64748b)";
	}
	for (const item of result.output?.items ?? []) {
		const name = item.name.trim().toLowerCase();
		const gradient = item.gradient?.trim();
		if (name && gradient?.toLowerCase().includes("gradient")) {
			out[name] = gradient;
		}
	}
	return out;
}
