import type { IfraGroup } from "./types";

/**
 * Cross-material IFRA rules where combined concentrations must stay under one limit.
 * Individual material records in data.ts still carry their own per-material limits;
 * the validator should apply both checks where relevant.
 */
export const ifraGroups: IfraGroup[] = [
	{
		id: "methyl-octine-carbonates",
		label: "Methyl heptine + methyl octine carbonate",
		materialCanonicalNames: [
			"Methyl heptine carbonate",
			"Methyl octine carbonate",
		],
		memberCas: ["111-12-6", "111-80-8"],
		categoryLimits: { "4": 0.047 },
		rule: "sum",
		notes: [
			"Combined MHC + MOC must not exceed the MHC limit per category.",
			"MOC must also respect its own per-material limit (0.01% in Category 4).",
		],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_062.pdf",
	},
	{
		id: "dimethylcyclohex-3-ene-1-carbaldehyde-isomers",
		label: "Dimethylcyclohex-3-ene-1-carbaldehyde (mixed isomers)",
		materialCanonicalNames: [
			"Dimethylcyclohex-3-ene-1-carbaldehyde (mixed isomers)",
		],
		memberCas: [
			"68737-61-1",
			"68039-49-6",
			"68039-48-5",
			"27939-60-2",
			"67801-65-4",
			"36635-35-5",
			"68084-52-6",
			"35145-02-9",
		],
		categoryLimits: { "4": 2.5 },
		rule: "sum",
		notes: [
			"Sum of all dimethylcyclohex-3-ene-1-carbaldehyde isomers must not exceed this limit.",
		],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_030.pdf",
	},
	{
		id: "methyl-ionone-isomers",
		label: "Methyl ionone (mixed isomers)",
		materialCanonicalNames: ["Methyl ionone, mixed isomers"],
		memberCas: [
			"1335-46-2",
			"127-42-4",
			"127-43-5",
			"127-51-5",
			"7779-30-8",
			"79-89-0",
			"1335-94-0",
		],
		categoryLimits: { "4": 30 },
		rule: "sum",
		notes: [
			"Sum of all methyl ionone isomers must not exceed this limit.",
			"Pseudo methyl ionones must not be used as fragrance ingredients.",
		],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_063.pdf",
	},
	{
		id: "rose-ketones",
		label: "Rose ketones (all isomers)",
		materialCanonicalNames: ["Rose ketones"],
		memberCas: [
			"23696-85-7",
			"23726-93-4",
			"59739-63-8",
			"43052-87-5",
			"24720-09-0",
			"23726-94-5",
			"23726-92-3",
			"23726-91-2",
			"35044-68-9",
			"57378-68-4",
			"71048-82-3",
			"35087-49-1",
			"39872-57-6",
			"70266-48-7",
			"33673-71-1",
			"87064-19-5",
		],
		categoryLimits: { "4": 0.043 },
		rule: "sum",
		notes: ["Sum of all rose ketone isomers must not exceed this limit."],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_077.pdf",
	},
	{
		id: "oak-treemoss-extracts",
		label: "Oakmoss + Treemoss extracts",
		materialCanonicalNames: ["Oakmoss extracts", "Treemoss extracts"],
		memberCas: [
			// Oakmoss
			"90028-68-5",
			"68917-10-2",
			"9000-50-4",
			// Treemoss (IFRA 49/51)
			"90028-67-4",
			"68648-41-9",
			"68917-40-8",
		],
		categoryLimits: { "4": 0.1 },
		rule: "sum",
		notes: [
			"Combined oakmoss + treemoss must not exceed the oakmoss limit per category.",
			"Limits are linked to atranol/chloroatranol; raw materials must meet IFRA specs.",
		],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_067.pdf",
	},
	{
		id: "tolualdehyde-isomers",
		label: "o,m,p-Tolualdehydes and their mixtures",
		materialCanonicalNames: ["o,m,p-Tolualdehydes and their mixtures"],
		memberCas: ["529-20-4", "620-23-5", "104-87-0", "1334-78-7"],
		categoryLimits: { "4": 0.47 },
		rule: "sum",
		notes: [
			"Sum of ortho-, meta-, and para-tolualdehyde must not exceed this limit.",
		],
		pdfUrl:
			"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_081.pdf",
	},
];
