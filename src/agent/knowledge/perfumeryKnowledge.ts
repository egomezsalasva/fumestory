// type MaterialProperty = {
// 	name: string;
// 	category: string;
// 	noteType: "top" | "mid" | "base" | null;
// 	notes: Array<{ name: string; aggregate: number }>;
// };

export const PERFUMERY_KNOWLEDGE = {
	noteTypes: {
		top: {
			description: "First impression, evaporates quickly (5-15 minutes)",
			characteristics: ["Light", "Volatile", "Fresh", "Citrusy", "Green"],
			typicalPercentage: "15-25%",
			examples: ["Bergamot", "Lemon", "Lavender", "Mint", "Aldehydes"],
		},
		middle: {
			description:
				"Heart of the fragrance, develops after top notes (20-60 minutes)",
			characteristics: ["Balanced", "Harmonious", "Floral", "Spicy", "Fruity"],
			typicalPercentage: "30-50%",
			examples: ["Rose", "Jasmine", "Lily", "Cinnamon", "Nutmeg"],
		},
		base: {
			description: "Foundation, longest lasting (hours to days)",
			characteristics: ["Heavy", "Tenacious", "Woody", "Musk", "Resinous"],
			typicalPercentage: "20-40%",
			examples: ["Sandalwood", "Patchouli", "Vanilla", "Amber", "Musk"],
		},
	},

	// materialCategories: {
	//   citrus: { notes: "top", characteristics: ["Fresh", "Bright", "Energizing"] },
	//   floral: { notes: "middle", characteristics: ["Romantic", "Soft", "Elegant"] },
	//   woody: { notes: "base", characteristics: ["Warm", "Grounding", "Masculine"] },
	// },

	// materialProperties: [
	// 	{
	// 		name: "Ambroxan",
	// 		category: "amber",
	// 		noteType: "base",
	// 		notes: [
	// 			{ name: "Woody", aggregate: 2 },
	// 			{ name: "Amber", aggregate: 1 },
	// 			{ name: "Ambergris", aggregate: 1 },
	// 			{ name: "Animalic", aggregate: 1 },
	// 		],
	// 	},
	// ] as MaterialProperty[],

	formulaGuidelines: {
		balance:
			"A well-balanced formula typically has a pyramid structure with more base notes than top notes",
		commonIssues: [
			"Too many top notes = short-lived fragrance",
			"Too many base notes = heavy, overwhelming",
			"Missing middle notes = disconnected top and base",
			"Incorrect dilution = material too weak or too strong",
		],
	},
};
