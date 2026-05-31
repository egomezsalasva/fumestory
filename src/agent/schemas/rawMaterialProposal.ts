import { z } from "zod";

export const rawMaterialNoteTypeSchema = z.enum(["High", "Mid(Heart)", "Base"]);
export const rawMaterialNatureSchema = z.enum(["Natural", "Synthetic"]);

export const rawMaterialProposalSchema = z.object({
	suggestedLabel: z
		.string()
		.describe("Short inventory-style label for the form, e.g. LB1"),
	nameAsEntered: z
		.string()
		.describe("User material name exactly as they typed it (form field: name)"),
	casNumber: z
		.string()
		.nullable()
		.describe(
			"Form field CAS Registry Number (e.g. 6790-58-5 for Ambroxan). Use null if unknown, not applicable (common for natural blends/extracts), or uncertain — do not guess or invent a CAS.",
		),
	suggestedCategory: z
		.string()
		.describe(
			"Main perfumery category for the form autocomplete, e.g. citrus, floral",
		),
	noteType: rawMaterialNoteTypeSchema.describe(
		"Form field note type: High, Mid(Heart), or Base",
	),
	materialNature: rawMaterialNatureSchema.describe(
		"Form field material nature: Natural or Synthetic",
	),
	notes: z
		.array(z.string())
		.describe(
			"Short tags for the form. When the material is well known, be generous: aim for roughly 6–12 distinct items when justified—cover odor family, facets (e.g. green, spicy, animalic), typical modifiers (e.g. fresh, powdery, creamy), and common pairings or effects. For obscure or uncertain materials, fewer items; stay conservative; do not pad with guesses.",
		),
	additionalInformation: z
		.string()
		.describe(
			"READ-ONLY chat context only (odor, use, dilution tips, IFRA notes). " +
				"Not mapped to any inventory form field and not saved on submit. " +
				"Put CAS in casNumber, not here. Do not duplicate suggestedLabel, name, category, noteType, materialNature, notes, or casNumber.",
		),
});

export const rawMaterialAgentResultSchema = z.object({
	kind: z.enum(["proposal", "out_of_topic"]),
	proposal: rawMaterialProposalSchema.nullable(),
	reply: z.string().nullable(),
});

export type RawMaterialProposal = z.infer<typeof rawMaterialProposalSchema>;
export type RawMaterialAgentResult = z.infer<
	typeof rawMaterialAgentResultSchema
>;
