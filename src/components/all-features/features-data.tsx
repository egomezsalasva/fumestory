export type FeatureId =
	| "add-raw-material"
	| "raw-materials-agent"
	| "raw-materials-table"
	| "cas-number"
	| "material-nature"
	| "add-dilution"
	| "raw-material-details"
	| "toggle-available-dilutions"
	| "add-composition"
	| "weight-percentage-mode"
	| "compositions-agent"
	| "auto-remove-formula-weights"
	| "compositions-table"
	| "composition-details"
	| "add-formula"
	| "autofill-with-previous-formula"
	| "formulas-agent"
	| "bottle-labels"
	| "toggle-agents"
	| "toggle-columns"
	| "add-guest-feedback"
	| "guest-feedback-details"
	| "guest-feedback-note-aggregation"
	| "scent-blind-test"
	| "scent-knowledge";

export type FeatureDefinition = {
	id: FeatureId;
	title: string;
	descriptions: Array<string | React.ReactNode>;
	image: string;
	relatedFeatureIds?: FeatureId[];
};

export type FeatureSectionDefinition = {
	title: string;
	id: string;
	features: FeatureDefinition[];
};

export const FEATURE_SECTIONS: FeatureSectionDefinition[] = [
	{
		title: "Inventory",
		id: "inventory",
		features: [
			{
				id: "add-raw-material",
				title: "Add Raw Material",
				descriptions: [
					"Keep your inventory organized by adding raw materials. After adding a raw material, you can create and manage its dilutions.",
				],
				image: "/features/add-raw-material.webp",
				relatedFeatureIds: [
					"raw-materials-agent",
					"add-dilution",
					"bottle-labels",
					"cas-number",
					"material-nature",
				],
			},
			{
				id: "raw-materials-agent",
				title: "Raw Materials Agent",
				descriptions: [
					"The Raw Materials Agent helps with data entry. It can identify which raw materials you already have to prevent duplicates. It fetches the data needed to autofill the raw material form.",
				],
				image: "/features/raw-materials-agent.webp",
				relatedFeatureIds: ["toggle-agents"],
			},
			{
				id: "raw-materials-table",
				title: "Raw Materials Table",
				descriptions: [
					"The Raw Materials Table provides an overview of all your raw material data, including the raw material name, bottle label, CAS number, material nature, category, note type, notes, and available dilutions.",
				],
				image: "/features/raw-materials-table.webp",
				relatedFeatureIds: ["toggle-columns", "toggle-available-dilutions"],
			},
			{
				id: "cas-number",
				title: "CAS Number",
				descriptions: [
					"Enable CAS Numbers in Settings to store and display CAS numbers for your raw materials. CAS numbers can be added when creating a raw material and viewed in the Raw Materials Table. You can also search by CAS number using the Raw Materials Agent.",
				],
				image: "/features/cas-number.webp",
				relatedFeatureIds: [
					"add-raw-material",
					"raw-materials-table",
					"raw-materials-agent",
				],
			},
			{
				id: "material-nature",
				title: "Material Nature",
				descriptions: [
					"Enable Material Nature in Settings to label raw materials as natural or synthetic and filter them in the Raw Materials Table.",
				],
				image: "/features/material-nature.webp",
				relatedFeatureIds: ["raw-materials-table"],
			},
			{
				id: "add-dilution",
				title: "Add Dilution",
				descriptions: [
					"You can add a dilution by picking one of your available raw materials. This will add the date it was created, the percentage, and the weight of the batch so it can later be subtracted when adding a formula. You can also choose to hide raw materials with unavailable dilutions in the Raw Materials Table and mark dilutions as unavailable in the Raw Materials Details.",
				],
				image: "/features/add-dilution.webp",
				relatedFeatureIds: [
					"raw-material-details",
					"raw-materials-table",
					"toggle-available-dilutions",
					"auto-remove-formula-weights",
				],
			},
			{
				id: "raw-material-details",
				title: "Raw Material Details",
				descriptions: [
					"On the Raw Material Details page, you can view available dilutions and toggle their availability. If Guest Feedback is enabled, it will also be displayed here.",
				],
				image: "/features/raw-material-details.webp",
				relatedFeatureIds: [
					"add-dilution",
					"raw-materials-table",
					"add-guest-feedback",
				],
			},
			{
				id: "toggle-available-dilutions",
				title: "Toggle Available Dilutions",
				descriptions: [
					"Hide raw materials without available dilutions to reduce clutter in the Raw Materials Table.",
				],
				image: "/features/toggle-available-dilutions.webp",
				relatedFeatureIds: ["raw-materials-table"],
			},
		],
	},
	{
		title: "Compositions",
		id: "compositions",
		features: [
			{
				id: "add-composition",
				title: "Add Composition",
				descriptions: [
					"Once you have available dilutions, you can create a composition. A composition represents the idea you are developing and includes its first formula (mod). You can choose between Trial for quick tests, Accord, or Perfume. There is also the Compositions Agent to help you start off.",
				],
				image: "/features/add-composition.webp",
				relatedFeatureIds: [
					"compositions-table",
					"compositions-agent",
					"bottle-labels",
					"auto-remove-formula-weights",
				],
			},
			{
				id: "weight-percentage-mode",
				title: "Weight / Percentage Mode",
				descriptions: [
					<>
						To make formula creation and modification easier, you can work in
						either Weight Mode or Percentage Mode.
					</>,
					<>
						<b>Weight Mode:</b> Enter the weight and percentage of a material,
						and the total weight is calculated automatically.
					</>,
					<>
						<b>Percentage Mode:</b> Ideal for modifying formulas. Edit
						percentages directly and receive warnings when the total is below or
						above 100%. When switching back to Weight Mode, you can choose to
						recalculate the formula while keeping the selected total weight.
					</>,
				],
				image: "/features/weight-percentage-mode.webp",
				relatedFeatureIds: ["add-composition", "add-formula"],
			},
			{
				id: "compositions-agent",
				title: "Compositions Agent",
				descriptions: [
					"The Compositions Agent helps you create a starter formula. You can generate either an accord or a perfume. For perfumes, you can choose between creating a replica or an original concept.",
					"The agent can work exclusively with materials in your inventory, prioritize your inventory while suggesting additional materials when beneficial, or ignore inventory constraints to generate the best possible formula.",
					// "It also provides an estimated accuracy percentage for the result.",
				],
				image: "/features/compositions-agent.webp",
				relatedFeatureIds: ["add-composition"],
			},
			// {
			// 	id: "auto-remove-formula-weights",
			// 	title: "Auto-Remove Formula Weights",
			// 	descriptions: [
			// 		"This feature will automatically subtract the weight used from dilutions when adding a formula. This feature helps you track stock and will warn you if you do not have enough of a dilution when making a formula.",
			// 	],
			// 	image: "/inventory.webp",
			// },
			{
				id: "compositions-table",
				title: "Compositions Table",
				descriptions: [
					"The Compositions Table provides an overview of all your trials, accords, and perfumes in one place.",
				],
				image: "/features/compositions-table.webp",
				relatedFeatureIds: ["composition-details"],
			},
			{
				id: "composition-details",
				title: "Composition Details",
				descriptions: [
					"View all formula mod iterations for a composition and create new formula mods as you refine the composition.",
				],
				image: "/features/composition-details.webp",
				relatedFeatureIds: ["add-formula"],
			},
			{
				id: "add-formula",
				title: "Add Formula",
				descriptions: [
					"You can add a new formula mod to the composition you are creating. This helps keep a track record of modifications and improvements made to the composition.",
				],
				image: "/features/add-formula.webp",
				relatedFeatureIds: ["autofill-with-previous-formula"],
			},
			{
				id: "autofill-with-previous-formula",
				title: "Autofill With Previous Formula",
				descriptions: [
					"A common scenario is updating the last formula mod you created. This button quickly fills in the previous formula data so you can easily modify it.",
				],
				image: "/features/autofill-with-previous-formula.webp",
				relatedFeatureIds: ["add-formula"],
			},
			// {
			// 	id: "formulas-agent",
			// 	title: "Formulas Agent",
			// 	descriptions: [
			// 		"This agent helps you modify and improve the composition you are working on by suggesting updates. You can pick to update with the same ingredients or you can let it suggest adding/deleting new ones, or ask it for a completly new approch.",
			// 	],
			// 	image: "/inventory.webp",
			// 	relatedFeatureIds: ["add-composition"],
			// },
		],
	},
	{
		title: "Settings",
		id: "settings",
		features: [
			{
				id: "bottle-labels",
				title: "Bottle Labels",
				descriptions: [
					"Adding full names to small bottles can be inconvenient. Enable Bottle Labels in Settings to create custom labels for your bottles. You can also see in the table which raw material or composition each label is linked to.",
				],
				image: "/features/bottle-labels.webp",
				relatedFeatureIds: ["raw-materials-table", "compositions-table"],
			},
			{
				id: "toggle-agents",
				title: "Toggle Agents",
				descriptions: [
					"Some perfumers are not into the whole AI thing. That is perfectly understandable. For this reason, you can disable agents entirely. Your preference is saved, so they won’t appear again unless you reactivate them.",
				],
				image: "/features/toggle-agents.webp",
				relatedFeatureIds: [
					"raw-materials-agent",
					"compositions-agent",
					"formulas-agent",
				],
			},
			{
				id: "toggle-columns",
				title: "Toggle Columns",
				descriptions: [
					"In Settings, you can choose which columns are visible in the Raw Materials Table and the Compositions Table.",
				],
				image: "/features/toggle-columns.webp",
				relatedFeatureIds: ["raw-materials-table", "compositions-table"],
			},
		],
	},
	{
		title: "Add-On Features",
		id: "addons",
		features: [
			{
				id: "add-guest-feedback",
				title: "Add Guest Feedback",
				descriptions: [
					"This add-on allows you to collect feedback from people close to you. Give visitors a scent strip without telling them what raw material it is, then ask which notes they perceive and how much they like it.",
				],
				image: "/features/add-guest-feedback.webp",
			},
			{
				id: "guest-feedback-details",
				title: "Guest Feedback Details",
				descriptions: [
					"You can view Guest Feedback results on the Dilution Details page, including ratings and notes.",
				],
				image: "/features/guest-feedback-details.webp",
			},
			{
				id: "guest-feedback-note-aggregation",
				title: "Guest Feedback Note Aggregation",
				descriptions: [
					"This feature allows you to stack the notes your guests picked up so you can have a better understanding of which notes are more promintent. You can activate this and view it on the raw materials table.",
				],
				image: "/features/guest-feedback-note-aggregation.webp",
			},
			{
				id: "scent-blind-test",
				title: "Scent Blind Test",
				descriptions: [
					"This add-on is built to train your nose. With a partner, choose which materials you want to include in the test. Your partner should hide the labels and hand you scent strips. You then record which ones you correctly identify and which ones you don’t.",
				],
				image: "/features/scent-blind-test.webp",
			},
			{
				id: "scent-knowledge",
				title: "Scent Knowledge",
				descriptions: [
					"This table provides an overview of your scent test results and the number of tests performed for each raw material, helping you identify which materials you need to train more.",
				],
				image: "/features/scent-knowledge.webp",
			},
		],
	},
];

export const featuresById = Object.fromEntries(
	FEATURE_SECTIONS.flatMap((section) =>
		section.features.map((feature) => [feature.id, feature]),
	),
) as Record<FeatureId, FeatureDefinition>;
