import type { CuratedMaterialsDataset } from "../types";

export const curatedMaterialsData: CuratedMaterialsDataset = {
	meta: {
		version: "2026-06-20",
		createdAt: "2026-06-20T16:00:00+00:00",
		updatedAt: "2026-07-04T08:46:54.880Z",
	},
	materials: [
		{
			canonicalName:
				"Acetic acid, anhydride, reaction products with 1,5,10-Trimethyl-1,5,9-cyclododecatriene",
			cas: ["144020-22-4", "28371-99-5"],
			otherNames: [
				"Methyl trimethylcyclododecatrienyl ketone (mixture of isomers)",
				"Trimofix O",
				"Fixamber",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["ambergris", "wood", "musk"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_001.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Acetylated Vetiver oil",
			cas: ["84082-84-8", "68917-34-0", "73246-97-6", "62563-80-8"],
			otherNames: [
				"Vetiveria zizanioides, extract, acetylated",
				"Oils, vetiver, acetylated",
				"Acetic acid, esters with vetiver oil alcohols",
				"Vetiverol, acetate",
				"Vetivert acetate",
				"Vetivert acetate (Haiti)",
				"Vetyveryl acetate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"wood",
							"grapefruit",
							"dry",
							"sweet",
							"velvet",
							"earth",
							"fresh",
							"balsam",
							"leather",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_002.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Allyl phenoxyacetate",
			cas: ["7493-74-5", "863306-60-9"],
			otherNames: [
				"Acetic acid, phenoxy-, 2-propenyl ester",
				"2-Propenyl phenoxyacetate",
				"Prop-2-enyl 2-phenoxyacetate",
				"Acetate PA",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Allyl_Phenoxyacetate.pdf",
						nameUsed: "Allyl Phenoxyacetate",
						notes: [
							"green",
							"tropical",
							"juicy",
							"papaya",
							"mango",
							"physalis",
							"fruity",
							"pineapple",
							"honey",
							"chamomile",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_003.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.3,
							},
						},
						{
							status: "specification",
							notes: [
								"Allyl esters: free allyl alcohol must be less than 0.1% (IFRA Allyl esters Specification Standard).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Amyl cinnamic alcohol",
			cas: ["101-85-9"],
			otherNames: [
				"Amylcinnamyl alcohol",
				"α-Amylcinnamyl alcohol",
				"2-Amyl-3-phenyl-2-propen-1-ol",
				"2-Benzylideneheptanol",
				"1-Heptanol, 2-(phenylmethylene)-",
				"α-Pentylcinnamyl alcohol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "balsam", "spice", "wood", "cinnamon", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_004.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Amyl cinnamic aldehyde",
			cas: ["122-40-7"],
			otherNames: [
				"Amyl cinnamal",
				"Amyl cinnamic aldehyde",
				"α-Amylcinnamaldehyde",
				"α-Amyl ß-phenylacrolein",
				"Heptanal, 2-(phenylmethylene)",
				"α-Pentylcinnamaldehyde",
				"α-Pentyl-ß-phenylacrolein",
				"2-(Phenylmethylene)heptanal",
				"Flomine",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "jasmine", "wax", "fat", "fruit", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_005.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 7,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Anisyl alcohol",
			cas: ["105-13-5", "1331-81-3"],
			otherNames: [
				"Anisalcohol",
				"Anise alcohol",
				"Anisic alcohol",
				"Benzyl alcohol, p-methoxy",
				"p-Methoxybenzyl alcohol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/anisyl-alcohol",
						nameUsed: "Anisyl Alcohol",
						notes: ["herbal", "anise", "floral", "powdery"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Anisyl Alcohol adds volume and gives a natural aspect to floral compositions such as mimosa, lilac, cassia, apple-blossom, jasmine and heliotrope as well as to clove and fougere perfumes. It has an excellent blending effect and can give a heliotropic character without the problem of coloration.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_006.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.21,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzaldehyde",
			cas: ["100-52-7"],
			otherNames: [
				"Benzenecarbonal",
				"Benzene carboxaldehyde",
				"Benzenecarboxaldehyde",
				"Benzenemethylal",
				"Benzoic aldehyde",
				"Bitter almond oil, synthetic",
				"Phenylformaldehyde",
				"Phenylmethanol aldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"almond",
							"cherry",
							"nut",
							"sweet",
							"marzipan",
							"fruit",
							"spice",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_007.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzyl alcohol",
			cas: ["100-51-6"],
			otherNames: [
				"Benzenemethanol",
				"Benzylic alcohol",
				"α-Hydroxytoluene",
				"Phenylcarbinol",
				"Phenyl carbinol",
				"Phenylmethanol",
				"Phenylmethyl alcohol",
				"α-Toluenol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "sweet", "balsam", "almond", "fruit", "bread"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_008.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzyl benzoate",
			cas: ["120-51-4"],
			otherNames: [
				"Benylate",
				"Benzoic acid, benzyl ester",
				"Benzoic acid, phenylmethyl ester",
				"Benzyl phenylformate",
				"Phenylmethyl benzoate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["balsam", "sweet", "floral", "almond"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_009.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4.8,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzyl cinnamate",
			cas: ["103-41-3"],
			otherNames: [
				"Benzyl γ-phenylacrylate",
				"Benzyl 3-phenylpropenoate",
				"Cinnamein",
				"Cinnamic acid, benzyl ester",
				"Phenylmethyl 3-phenyl-2-propenoate",
				"2-Propenoic acid, 3-phenyl-phenylmethyl ester",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Benzyl_Cinnamate.pdf",
						nameUsed: "Benzyl Cinnamate",
						notes: [
							"balsamic",
							"benzoin",
							"cinnamon",
							"heliotrope",
							"peru balm",
							"rich",
							"opulent flowers",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_010.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzyl salicylate",
			cas: ["118-58-1"],
			otherNames: [
				"Benzoic acid, 2-hydroxy-, phenylmethyl ester",
				"Benzyl 2-hydroxybenzoate",
				"Benzyl o-hydroxybenzoate",
				"2-Hydroxybenzoic acid, benzyl ester",
				"Phenylmethyl 2-hydroxybenzoate",
				"Salicylic acid, benzyl ester",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "sweet", "balsam", "orchid", "musk"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_011.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 7.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Butylcinnamaldehyde",
			cas: ["7492-44-6"],
			otherNames: [
				"2-Benzylidenehexanal",
				"Butyl cinnamic aldehyde",
				"α-Butyl-β-phenylacrolein",
				"Hexanal, 2-(phenylmethylene)-",
				"alpha-butylcinnamaldehyde",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"green",
							"fruit",
							"herbal",
							"jasmine",
							"sweet",
							"cinnamon",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_012.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-(m-tert-Butylphenyl)-2-methylpropionaldehyde (m-BMHCA)",
			cas: ["62518-65-4"],
			otherNames: [
				"Benzenepropanal, 3-(1,1-dimethylethyl)-α-methyl",
				"3-(3-tert-Butylphenyl)-2-methylpropanal",
				"m-BMHCA",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "wood", "fresh", "warm"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_013.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.8,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-tert-Butyldihydrocinnamaldehyde",
			cas: ["18127-01-0"],
			otherNames: [
				"Benzenepropanal, 4-(1,1-dimethylethyl)-",
				"3-(4-tert-Butylphenyl)propionaldehyde",
				"Bourgeonal",
				"Liliphenal",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/bourgeonal",
						nameUsed: "Bourgeonal",
						notes: [
							"floral",
							"green",
							"muguet",
							"fresh",
							"powerful",
							"water",
							"diffusive",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Bourgeonal is a powerful, diffusive and substantive fresh floral muguet, with a watery green character. Its unique muguet-aldehyde character is extensively used in toiletries and alcoholic fragrances.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_014.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-tert-Butyl-α-methylhydrocinnamic aldehyde (p-BMHCA)",
			cas: ["80-54-6"],
			otherNames: [
				"Benzenepropanal, 4-(1,1-dimethylethyl)-alpha-methyl",
				"p-t-Bucinal",
				"2-(4-tert-Butylbenzyl)propionaldehyde",
				"p-t-Butyl-alpha-methylhydrocinnamaldehyde",
				"Butylphenyl methylpropional",
				"alpha-Methyl-ß-(p-t-butylphenyl)propionaldehyde",
				"Lilestralis",
				"Lilial",
				"Lysmeral",
				"Lilyall",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "muguet", "fresh", "wax", "powder"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_015.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Carvone",
			cas: ["99-49-0", "2244-16-8", "6485-40-1"],
			otherNames: [
				"p-Mentha-6,8-dien-2-one",
				"1-Methyl-4-isopropenyl-6-cyclohexen-2-one",
				"2-Cyclohexen-1-one, 2-methyl-5-(1-methylethenyl)-",
				"5-Isopropenyl-2-methylcyclohex-2-en-1-one",
				"6,8(9)-p-Menthadien-2-one",
				"d-Carvone",
				"dextro-Carvone",
				"(S)-2-Methyl-5-(1-methylvinyl)cyclohex-2-en-1-one",
				"(S)-2-Methyl-5-(prop-1-en-2-yl)cyclohex-2-en-1-one",
				"d-p-Mentha-6,8(9)-dien-2-one",
				"d-1-Methyl-4-isopropenyl-6-cyclohexen-2-one",
				"2-Cyclohexen-1-one, 2-methyl-5-(1-methylethenyl)-, (5S)-",
				"l-Carvone",
				"laevo-Carvone",
				"l-p-Mentha-1(6),8-dien-2-one",
				"l-p-Mentha-6,8(9)-dien-2-one",
				"l-1-Methyl-4-isopropenyl-6-cyclohexen-2-one",
				"2-Cyclohexen-1-one, 2-methyl-5-(1-methylethenyl)-, (5R)-",
				"Carvone L",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Carvone.pdf",
						nameUsed: "Carvone L",
						notes: ["mint", "spices", "herbs"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_016.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.59,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cinnamic alcohol",
			cas: ["104-54-1"],
			otherNames: [
				"Cinnamyl alcohol",
				"3-Phenylallyl alcohol",
				"3-Phenyl-2-propen-1-ol",
				"2-Propen-1-ol, 3-phenyl-",
				"Styrone",
				"Styryl alcohol",
				"Zimtalcohol",
				"Styryl carbinol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Cinnamic_Alcohol.pdf",
						nameUsed: "Cinnamic alcohol",
						notes: ["spicy", "hyacinthe", "cinnamon", "balsamic", "styrax"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_017.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cinnamic aldehyde",
			cas: ["104-55-2"],
			otherNames: [
				"Cinnamal",
				"Cinnamaldehyde",
				"Phenylacrolein",
				"3-Phenyl-2-propena",
				"3-Phenyl-2-propen-1-a",
				"Cassia aldehyde",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC-reduziert-Einzelseiten/SYM_F-Cinnamic-Aldehyde.pdf",
						nameUsed: "Cinnamic aldehyde",
						notes: [
							"cocoa",
							"vanilla",
							"spices",
							"herbs",
							"red fruits",
							"alcohol",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_018.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cinnamic aldehyde dimethyl acetal",
			cas: ["4364-06-1"],
			otherNames: [
				"Benzene, (3,3-dimethoxy-1-propenyl)-",
				"(3,3-Dimethoxypropen-1-yl)benzene",
				"(3,3-Dimethoxyprop-1-en-1-yl)benzene",
				"3-Phenyl-2-propenal dimethyl acetal",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spice", "cinnamon", "sweet", "floral", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_019.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.35,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cinnamyl nitrile",
			cas: ["1885-38-7", "4360-47-8"],
			otherNames: [
				"Cinnamonitrile (E)",
				"trans-.β.-Phenylacrylonitrile",
				"2-Propenenitrile, 3-phenyl-, (E)-",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"spice",
							"cinnamon",
							"cassia",
							"deep",
							"cumin",
							"floral",
							"oil",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_020.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Citral",
			cas: ["5392-40-5", "141-27-5", "106-26-3"],
			otherNames: [
				"3,7-Dimethyl-2,6-octadienal",
				"Geranial (trans-citral)",
				"Neral",
				"Geranial",
				"Lemarome",
				"Citral FF",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Citral_FF.pdf",
						nameUsed: "Citral FF",
						notes: ["citrus", "lemon", "lime", "verbena"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_021.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Citronellol",
			cas: [
				"106-22-9",
				"1117-61-9",
				"26489-01-0",
				"6812-78-8",
				"141-25-3",
				"7540-51-4",
			],
			otherNames: [
				"3,7-Dimethyl-6-octen-1-ol",
				"6-Octen-1-ol, 3,7-dimethyl-",
				"dl-Citronellol",
				"Rhodinol pure",
				"3,7-Dimethyloct-6-en-1-ol",
				"6-Octen-1-ol, 3,7-dimethyl-, (R)-",
				"(R)-3,7-Dimethyloct-6-en-1-ol",
				"(+)-ß-Citronellol",
				"(+)-(R)-Citronellol",
				"6-Octen-1-ol, 3,7-dimethyl-,(+/-)-",
				"3,7-Dimethyloct-7-en-1-ol",
				"7-Octen-1-ol, 3,7-dimethyl-,(S)-",
				"3,7-Dimethyl-(6-or 7-)octen-1-ol",
				"3,7-Dimethyl-7-octen-1-ol",
				"7-Octen-1-ol, 3,7-dimethyl- (isomer unspecified)",
				"α-Citronellol",
				"Rhodinol",
				"(-)-3,7-Dimethyloct-6-en-1-ol",
				"(S)-3,7-Dimethyl-6-octen-1-ol",
				"6-Octen-1-ol, 3,7-dimethyl-, (S)-",
				"l-Citronellol",
				"Citronellol AJ",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Citronellol_AJ.pdf",
						nameUsed: "Citronellol AJ",
						notes: ["floral", "rose", "lily of the valley", "geranium"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_022.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 12,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Coumarin",
			cas: ["91-64-5"],
			otherNames: [
				"2H-1-Benzopyran-2-one",
				"1,2-Benzopyrone",
				"cis-o-Coumaric acid lactone",
				"Coumarinic anhydride",
				"2-Oxo-1,2-benzopyran",
				"2H-chromen-2-one",
				"Tonka bean camphor",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"hay",
							"tonka",
							"almond",
							"vanilla",
							"tobacco",
							"powder",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_023.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cuminaldehyde",
			cas: ["122-03-2"],
			otherNames: [
				"Benzaldehyde, 4-(1-methylethyl)-",
				"Cumaldehyde",
				"Cuminal",
				"Cuminic aldehyde",
				"4-Isopropylbenzaldehyde",
				"p-Isopropylbenzaldehyde",
				"4-Isopropylbenzenecarboxaldehyde",
				"Cuminic Aldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cuminic-aldehyde",
						nameUsed: "Cuminic Aldehyde",
						notes: ["spicy", "green", "herbal", "animal"],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Cuminic Aldehyde has a spicy green note with herbaceous and animalic undertones. It can be used at low dosage as a modifier in chypre, spicy or fougere notes.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_024.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclamen aldehyde",
			cas: ["103-95-7"],
			otherNames: [
				"Benzenepropanal, α-methyl-4-(1-methylethyl)-",
				"Benzenepropanol, .α.-methyl-4-(1-methylethyl)-",
				"3-p-Cumenyl-2-methylpropionaldehyde",
				"p-Isopropyl-α-methylhydrocinnamaldehyde",
				"3-(4-Isopropylphenyl)-2-methylpropanal",
				"2-Methyl-3-(p-isopropylphenyl)propionaldehyde",
				"α-Methyl-p-isopropylphenylpropylaldehyde",
				"α-Methyl-4-(1-methylethyl)benzenepropanal",
				"Cyclamal",
				"Cyclaviol",
				"Cyclosal",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cyclamen-aldehyde-extra",
						nameUsed: "Cyclamen Aldehyde Extra",
						notes: ["floral", "green", "powerful", "fresh", "marine"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Cyclamen Aldehyde Extra can be used in many floral, green, fresh and marine accords. Its stability and substantivity are especially useful for functional perfumery.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_025.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.95,
							},
						},
						{
							status: "specification",
							notes: [
								"Cyclamen aldehyde must not contain more than 1.5% Cyclamen alcohol.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclopentadecanolide",
			cas: ["106-02-5"],
			otherNames: [
				"Angelica lactone",
				"15-Hydroxypentadecanoic acid, ω-lactone",
				"Oxacyclohexadecan-2-one",
				"Pentadecalactone",
				"ω-Pentadecalactone",
				"Pentadecanolide",
				"Cyclopentadecanolid Supra",
				"Exaltex",
				"Exaltolide",
				"Macrolide",
				"Muskalactone",
				"Pentalide",
				"Thibetolide",
				"Macrolide Supra",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC_Einzel-PDF/SYM_FC-Macrolide_Supra.pdf",
						nameUsed: "Macrolide Supra",
						notes: ["musk", "soap"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_026.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Dibenzyl ether",
			cas: ["103-50-4"],
			otherNames: [
				"Phenylmethoxymethylbenzene",
				"Benzene, 1,1'-[oxybis(methylene)]bis-",
				"Benzyl ether",
				"Benzyl oxide",
				"Dibenzyl oxide",
				"1,1'-[Oxybis(methylene)]dibenzene",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"almond",
							"chocolate",
							"spice",
							"fruit",
							"sweet",
							"floral",
							"mushroom",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_027.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.012,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "6,7-Dihydro-1,1,2,3,3-pentamethyl-4(5H)-indanone (DPMI)",
			cas: ["33704-61-9"],
			otherNames: [
				"1,2,3,5,6,7-Hexahydro-1,1,2,3,3-pentamethyl-4H-inden-4-one",
				"4H-Inden-4-one, 1,2,3,5,6,7-hexahydro-1,1,2,3,3-pentamethyl-",
				"1,1,2,3,3-Pentamethyl-1,2,3,5,6,7-hexahydro-4H-inden-4-one",
				"Cashmeran",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/cashmeran",
						nameUsed: "Cashmeran",
						notes: [
							"diffusive",
							"spicy",
							"animalic",
							"floral",
							"powdery",
							"velvet",
							"apple",
							"earthy",
							"amber",
							"wood",
							"red fruits",
							"pine",
							"oriental",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_028.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 3.8,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Dihydrocoumarin",
			cas: ["119-84-6"],
			otherNames: [
				"1,2-Benzodihydropyrone",
				"2H-1-Benzopyran-2-one, 3,4-dihydro-",
				"Chroman-2-one",
				"2-Chromanone",
				"3,4-Dihydro-2H-1-benzopyran-2-one",
				"o-Hydroxydihydrocinnamic acid lactone",
				"Melilotic acid lactone",
				"Melilotic lactone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"coconut",
							"coumarin",
							"caramel",
							"vanilla",
							"nut",
							"tobacco",
							"herbal",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_029.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.21,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Dimethylcyclohex-3-ene-1-carbaldehyde (mixed isomers)",
			cas: [
				"68737-61-1",
				"68039-49-6",
				"68039-48-5",
				"27939-60-2",
				"67801-65-4",
				"36635-35-5",
				"68084-52-6",
				"35145-02-9",
			],
			otherNames: [
				"Dimethylcyclohex-3-ene-1-carbaldehyde (isomer mixture)",
				"2,4-Dimethyl-3-cyclohexen-1-carboxaldehyde",
				"3,5-Dimethylcyclohex-3-ene-1-carbaldehyde",
				"Dimethylcyclohex-3-ene-1-carbaldehyde (isomer unspecified)",
				"3,6-Dimethyl-3-cyclohexene-1-carboxaldehyde",
				"3-Cyclohexene-1-carboxaldehyde, dimethyl- (isomer mixture)",
				"2,4-Dimethyltetrahydrobenzaldehyde",
				"Dimethyltetrahydrobenzaldehyde (isomer mixture)",
				"Triplal",
				"Vertocitral",
				"Vertoliff",
				"Tricyclal",
				"Hivertal",
				"Agrumen Aldehyde",
				"Cyclovertal",
				"Ligustral",
				"Aldehyde AA",
				"Cyclal C",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Vertocitral.pdf",
						nameUsed: "Vertocitral",
						notes: [
							"green",
							"grass",
							"aldehyde",
							"citrus",
							"herbal",
							"chrysanthemum",
						],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cyclal-c",
						nameUsed: "Cyclal C",
						notes: ["green", "leaf", "floral", "powerful"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Cyclal C is a key product in many modern compositions for its extremely natural green character. It blends beautifully with fruity, citrus, agrestic, floral compositions where it imparts its unique vibrant quality. It is also used to enrich and reinforce classic green notes.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_030.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "1-(5,5-Dimethyl-1-cyclohexen-1-yl)pent-4-en-1-one",
			cas: ["56973-85-4"],
			otherNames: [
				"α-Dynascone",
				"4-Penten-1-one, 1-(5,5-dimethyl-1-cyclohexen-1-yl)-",
				"Dynascone",
				"Galbanone",
				"Galbascone",
				"Neobutenone",
				"Neogal",
				"Neogalbenum",
				"Galbascone 95",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/galbascone-95/",
						nameUsed: "Galbascone 95",
						notes: [
							"hyacinth",
							"green",
							"ozonic",
							"fruit",
							"juicy",
							"pineapple",
							"diffusive",
							"impactful",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_031.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2,2-Dimethyl-3-(3-tolyl)propan-1-ol",
			cas: ["103694-68-4"],
			otherNames: [
				"Benzenepropanol, β,β,3-trimethyl-",
				"2,2-Dimethyl-3-(3-methylphenyl)propanol",
				"Benzene propanol",
				"Majantol",
				"Linlan alcohol",
				"Muguetol B",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Majantol.pdf",
						nameUsed: "Majantol",
						notes: [
							"floral",
							"lily of the valley",
							"transparent",
							"white flowers",
							"rose",
							"jasmine",
							"ylang-ylang",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_032.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.7,
							},
						},
						{
							status: "specification",
							notes: [
								"Total chlorine in raw material must not exceed 25 ppm (organochlorine compounds restricted).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Ethoxy-4-methylphenol",
			cas: ["2563-07-7"],
			otherNames: [
				"2-Ethoxy-p-cresol",
				"4-Methyl-2-ethoxyphenol",
				"Phenol, 2-ethoxy-4-methyl-",
				"Ultravanil",
				"Supravanil",
				"Ultravanil 80%/DPG",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ultravanil-80dpg",
						nameUsed: "Ultravanil 80%/DPG",
						notes: ["gourmand", "vanilla", "sweet", "phenolic", "powerful"],
						olfactiveFamily: "Gourmand",
						olfactiveDescription: [
							"Ultravanil 80%/DPG has a very powerful vanilla absolute note. Neat it has a strong phenolic background. 1%-2% of a 10% dilution can be used as a booster to other vanillic notes in a formulation. Ultravanil 80%/DPG works well in combination with vanillin and ethyl vanillin. It is also used to boost the performance of Isobutavan. Ultravanil is far less discolouring than other vanillic notes.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_033.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.099,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Ethylbenzaldehyde",
			cas: ["4748-78-1"],
			otherNames: ["4-Ethylbenzaldehyde", "Benzaldehyde, 4-ethyl-"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["almond", "sweet", "cherry", "spice", "anise"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_034.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Eugenol",
			cas: ["97-53-0"],
			otherNames: [
				"4-Allylcatechol-2-methyl ether",
				"1-Allyl-4-hydroxy-3-methoxybenzene",
				"4-Allyl-2-methoxyphenol",
				"Caryophyllic acid",
				"2-Hydroxy-5-allylanisole",
				"1-Hydroxy-2-methoxy-4-allylbenzene",
				"4-Hydroxy-3-methoxy-1-allylbenzene",
				"1-Hydroxy-2-methoxy-4-propenylbenzene",
				"2-Methoxy-4-allylphenol",
				"2-Methoxy-4-(2-propenyl)phenol",
				"Phenol, 2-methoxy-4-(2-propenyl)-",
				"Eugenic acid",
				"Allylguaiacol",
				"4-Allylguaiacol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spice", "clove", "warm", "dry", "sweet", "wood", "phenol"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_035.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Farnesol",
			cas: ["4602-84-0", "106-28-5", "3790-71-4", "16106-95-9", "3879-60-5"],
			otherNames: [
				"2,6,10-Dodecatrien-1-ol, 3,7,11-trimethyl-",
				"Farnesyl alcohol",
				"Trimethyl dodecatrienol",
				"3,7,11-Trimethyl-2,6,10-dodecatrien-1-ol",
				"trans-trans-Farnesol",
				"cis-trans-Farnesol",
				"2Z,6Z-Farnesol",
				"cis-cis-Farnesol",
				"2-trans,6-cis-Farnesol",
				"Farnesol Special",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Farnesol_Special.pdf",
						nameUsed: "Farnesol Special",
						notes: ["floral", "green", "lily of the valley", "peony"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_036.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
						{
							status: "specification",
							notes: [
								"Farnesol must contain a minimum of 96% farnesol isomers as determined by GLC.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Geraniol",
			cas: ["106-24-1"],
			otherNames: [
				"3,7-Dimethylocta-2,6-dien-1-ol",
				"2,6-Octadien-1-ol, 3,7-dimethyl-, (e)-",
				"2,6-Dimethyl-2,6-octadien-8-ol",
				"trans-3,7-Dimethyl-2,6-octadien-1-ol",
				"Geraniol 60",
				"Geraniol Coeur",
				"Geraniol extra",
				"Geraniol SP",
				"Geraniol Supra",
				"Meranol",
				"Rhodinol pure",
				"Geraniol Prime",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Geraniol_Prime.pdf",
						nameUsed: "Geraniol Prime",
						notes: ["floral", "geranium", "herbal", "palmarosa", "rose"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_037.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4.7,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Heptylidene cyclopentan-1-one",
			cas: ["39189-74-7"],
			otherNames: [
				"2-Heptylidenecyclopentanone",
				"2-Heptylidenecyclopentan-1-one",
				"Cyclopentanone, 2-heptylidene-",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "fruit", "spice", "wax", "celery", "jasmine"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_038.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Hexenal",
			cas: ["505-57-7", "6728-26-3", "16635-54-4"],
			otherNames: [
				"Hex-2-enal",
				"trans-2-Hexenal",
				"2-Hexenal, (E)-",
				"Hexen-2-al",
				"Leaf aldehyde",
				"beta-Propyl acrolein",
				"cis-2-Hexenal",
				"2-Hexenal, (Z)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"leaf",
							"apple",
							"banana",
							"fruit",
							"oil",
							"pungent",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_039.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.0077,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Hexyl cinnamic aldehyde",
			cas: ["101-86-0"],
			otherNames: [
				"2-Benzylideneoctanal",
				"Hexyl cinnamal",
				"α-Hexyl cinnamaldehyde",
				"Hexyl cinnamic aldehyde",
				"α-n-Hexylcinnamic aldehyde",
				"Hexyl cinnamyl",
				"α-n-Hexyl-β-phenylacrolein",
				"Octanal, 2-(phenylmethylene)-",
				"Jasmonal H",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"leaf",
							"apple",
							"banana",
							"fruit",
							"oil",
							"pungent",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_040.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 9.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Hexylidene cyclopentanone",
			cas: ["17373-89-6"],
			otherNames: [
				"2-Hexylidene cyclopentanone",
				"Cyclopentanone, 2-hexylidene-",
				"Jasmalone",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"green",
							"fruit",
							"spice",
							"herbal",
							"nut",
							"cream",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_041.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.13,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Hexyl salicylate",
			cas: ["6259-76-3"],
			otherNames: [
				"Hexyl 2-hydroxybenzoate",
				"Benzoic acid, 2-hydroxy-, hexyl ester",
				"Hexyl o-hydroxybenzoate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Hexyl_Salicylate.pdf",
						nameUsed: "Hexyl Salicylate",
						notes: ["floral", "green", "water lily", "chrysanthemum"],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/hexyl-salicylate",
						nameUsed: "Hexyl Salicylate",
						notes: ["floral", "green", "fruity"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Hexyl Salicylate has a floral fruity character, with a mild, sweet herbaceous slant. It is a very useful modifier of floral fragrances especially with Amyl Salicylate.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_042.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 6.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Hydroxycitronellal",
			cas: ["107-75-5"],
			otherNames: [
				"Citronellalhydrate",
				"7-Hydroxy-3,7-dimethyloctanal",
				"3,7-Dimethyl-7-hydroxyoctanal",
				"Octanal, 7-hydroxy-3,7-dimethyl-",
				"Oxydihydrocitronellal",
				"Laurinal",
				"Laurine",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "muguet", "fresh", "sweet", "green", "water"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_043.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName:
				"3 and 4-(4-Hydroxy-4-methylpentyl)-3-cyclohexene-1-carboxaldehyde (HMPCC)",
			cas: ["31906-04-4", "51414-25-6"],
			otherNames: [
				"3-Cyclohexen-1-carboxaldehyde, 4-(4-hydroxy-4-methylpentyl)-",
				"3-Cyclohexen-1-carboxaldehyde, 3-(4-hydroxy-4-methylpentyl)-",
				"Hydroxyisohexyl 3-cyclohexene carboxaldehyde",
				"4-(4-Hydroxy-4-methylpentyl) cyclohex-3-enecarbaldehyde",
				"3-(4-Hydroxy-4-methylpentyl) cyclohex-3-ene-1-carbaldehyde",
				"HICC",
				"Lyral",
				"Kovanol",
				"Mugonal",
				"Landolal",
				"Cyclohexal",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/lyral",
						nameUsed: "Lyral",
						notes: [
							"soft",
							"delicate",
							"floral",
							"lily",
							"cyclamen",
							"lilac",
							"diffusive",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_044.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Isobutyl-alpha-methyl hydrocinnamaldehyde",
			cas: ["6658-48-6"],
			otherNames: [
				"p-Isobutyl-α-methyl hydrocinnamic aldehyde",
				"Benzenepropanal, α-methyl-4-(2-methylpropyl)-",
				"3-(4-Isobutyl-phenyl)-2-methyl-propionaldehyde",
				"2-Methyl-3-[4-(2-methylpropyl)phenyl]propanal",
				"3-(p-Cumenyl)-2-methylpropionaldehyde",
				"Cyclamen homoaldehyde",
				"Rhodial",
				"Silvial",
				"Suzaral",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"muguet",
							"lily",
							"green",
							"tropical",
							"oil",
							"grease",
							"marine",
							"balsam",
						],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/silvialtm",
						nameUsed: "Silvial™",
						notes: ["floral", "muguet", "powerful", "fresh", "citrus"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Silvial™ is a powerful, vibrant muguet ingredient with a slight citrus undertone and a fresh, aldehydic touch. It is used in perfumery in the same way as the other related muguet products.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_045.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.99,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isocyclocitral",
			cas: ["1335-66-6", "1423-46-7", "67634-07-5"],
			otherNames: [
				"1-Formyl-[2,4,6-]&[3,5,6-]trimethyl-3-cyclohexene",
				"[2,4,6-]&[3,5,6-]Trimethyl-3-cyclohexene-1-carboxaldehyde",
				"3-Cyclohexene-1-carboxaldehyde, 2,4,6-trimethyl-",
				"Neocyclocitral",
				"2,4,6-Trimethylcyclohex-3-enecarbaldehyde",
				"2,4,6-Trimethyl-3-cyclohexenylcarboxaldehyde",
				"2,4,6-Trimethyl-3-cyclohexene-1-carbaldehyde",
				"3-Cyclohexene-1-carboxaldehyde, 3,5,6-trimethyl-",
				"3,5,6-Trimethylcyclohex-3-ene-1-carbaldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"herbal",
							"leaf",
							"mint",
							"marine",
							"grass",
							"citrus",
							"rind",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_046.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isocyclogeraniol",
			cas: ["68527-77-5"],
			otherNames: [
				"3-Cyclohexene-1-methanol, 2,4,6-trimethyl-",
				"2,4,6-Trimethyl-3-cyclohexene-1-methanol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/iso-cyclo-geraniol/",
						nameUsed: "Iso Cyclo Geraniol",
						notes: ["spicy", "green", "floral", "carnation"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_047.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isoeugenol",
			cas: ["97-54-1", "5932-68-3"],
			otherNames: [
				"1-Hydroxy-2-methoxy-4-propen-1-ylbenzene",
				"4-Hydroxy-3-methoxy-1-propen-1-ylbenzene",
				"4-Hydroxy-3-methoxy-1-propenylbenzene",
				"iso-Eugenol",
				"3-Methoxy-4-hydroxy-1-propen-1-ylbenzene",
				"2-Methoxy-4-propenylphenol",
				"2-Methoxy-4-(1-propenyl)phenol",
				"Phenol, 2-methoxy-4-(1-propenyl)-",
				"4-Propenylguaiacol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"spice",
							"clove",
							"floral",
							"carnation",
							"sweet",
							"warm",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_048.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.11,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Jasmine absolute (grandiflorum)",
			cas: ["8022-96-6", "8024-43-9", "90045-94-6", "84776-64-7"],
			otherNames: [
				"Jasmine absolute (Jasminum grandiflorum L.)",
				"Jasminum grandiflorum absolute",
				"Jasmin officinale var. grandiflorum",
				"Jasmine Absolute Egypt",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/jasmin-absolute-egypt/",
						nameUsed: "Jasmine Absolute Egypt",
						notes: [
							"floral",
							"fruit",
							"jasmine",
							"warm",
							"indole",
							"spicy",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_049.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Jasmine absolute (sambac)",
			cas: ["91770-14-8", "1034798-23-6"],
			otherNames: [
				"Jasmin sambac extract",
				"Jasminum sambac (L.) Aiton",
				"Jasmine Absolute Sambac",
				"Jasmine Sambac Absolute India",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/jasmine-sambac-absolute-india",
						nameUsed: "Jasmine Sambac Absolute India",
						notes: [
							"fruity",
							"jasmine",
							"green",
							"floral",
							"green bouquet",
							"anthranilate",
							"orange blossom",
							"indole",
							"animalic",
							"honeysuckle",
							"banana",
							"fresh",
							"honey",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmine sambac has an intriguing floral green bouquet. Compared to Jasmine grandiflorum, it has an intense floral note with more anthranilate compound, giving orange blossom nuances to the jasmine scent found in Jasmine grandiflorum.",
							"The indole molecule in it gives a more natural animal side that is quite floral in the background. It also has a strong green fruity facet, reminiscent of honeysuckle or banana. The freshness is a little dazzling at the top and the background is quite animal, very green and honeyed.",
						],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/jasmin-absolute-sambac/",
						nameUsed: "Jasmine Absolute Sambac",
						notes: [
							"fruity",
							"green",
							"warm",
							"diffusive",
							"floral",
							"jasmine",
							"indole",
							"spicy",
							"rich",
							"orange blossom",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_050.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 3.8,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Melissa oil (genuine Melissa officinalis L.)",
			cas: ["8014-71-9", "84082-61-1"],
			otherNames: [
				"Balm oil (Melissa officinalis L.)",
				"Lemon balm oil",
				"Melissa officinalis leaf oil",
				"Melissa oil (Melissa officinalis L.)",
				"Oil of balm",
				"Melissa Oil Balkan Org For Life",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/melissa-oil-balkan-org-for-life/",
						nameUsed: "Melissa Oil Balkan Org For Life",
						notes: ["citrus", "lemon", "rose petal", "fresh", "herbal"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_051.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Perilla aldehyde",
			cas: ["2111-75-3"],
			otherNames: [
				"1-Cyclohexene-1-carboxaldehyde, 4-(1-methylethenyl)-",
				"4-Isopropenylcyclohex-1-ene-1-carbaldehyde",
				"4-Isopropenyl-1-cyclohexene-1-carboxaldehyde",
				"Dihydrocuminic aldehyde",
				"p-Mentha-1,8-dien-7-al",
				"Perillaldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["herbal", "mint", "spice", "citrus", "green", "fat"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_052.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Menthadiene-7-methyl formate",
			cas: ["68683-20-5"],
			otherNames: [
				"Cyclohexadiene-1-ethanol, 4-(1-methylethyl)-, formate",
				"Isobergamate",
				"4-(Isopropyl)cyclohexadiene-1-ethyl formate",
				"2-(4-Isopropylcyclohexadienyl)ethyl formate",
				"Menthadienyl formate",
				"4-(1-Methylethyl)cyclohexadiene-1-ethyl formate",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "fruit", "citrus", "herbal", "mint"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_053.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Methoxybenzaldehyde",
			cas: ["123-11-5"],
			otherNames: [
				"Anisaldehyde",
				"p-Anisaldehyde",
				"Anisic aldehyde",
				"Anisyl aldehyde",
				"Benzaldehyde, 4-methoxy-",
				"4-Methoxybenzaldehyde",
				"Aubepine P Cresol",
				"Aubepine liquid",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"sweet",
							"hawthorn",
							"anise",
							"almond",
							"powder",
							"vanilla",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_054.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "o-Methoxycinnamaldehyde",
			cas: ["1504-74-1"],
			otherNames: [
				"2'-Methoxycinnamaldehyde",
				"ortho-Methoxycinnamic aldehyde",
				"β-(o-Methoxyphenyl)acrolein",
				"3-(2-Methoxyphenyl)acrylaldehyde",
				"3-(o-Methoxyphenyl)-2-propenal",
				"2-Propenal, 3-(2-methoxyphenyl)-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spice", "cinnamon", "sweet", "warm"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_055.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methoxy dicyclopentadiene carboxaldehyde",
			cas: ["86803-90-9"],
			otherNames: [
				"4,7-Methano-1H-indene-2-carboxaldehyde, octahydro-5-methoxy-",
				"8-Methoxytricyclo[5.2.2.1]decane-4-carboxaldehyde",
				"Scentenal",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/scentenalr-pe-981810",
						nameUsed: "Scentenal",
						notes: [
							"water",
							"aldehyde",
							"marine",
							"green",
							"rose",
							"floral",
							"mossy",
							"fruit",
							"pear",
							"alcoholic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_056.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4-Methoxy-alpha-methylbenzenepropanal",
			cas: ["5462-06-6"],
			otherNames: [
				"4-Methoxy-α-methylbenzenepropanal",
				"2-Anisylpropional",
				"2-(p-Anisyl)propanal",
				"Benzenepropanal, 4-methoxy-α-methyl-",
				"Benzenepropanal, 4-methoxy-alpha-methyl-",
				"Hydrocinnamaldehyde, p-methoxy-α-methyl-",
				"p-Methoxyhydratropaldehyde",
				"p-Methoxy-α-methylhydrocinnamaldehyde",
				"p-Methoxy-alpha-methylhydrocinnamaldehyde",
				"3-(4-Methoxyphenyl)-2-methylpropanal",
				"3-(p-Methoxyphenyl)-2-methylpropionaldehyde",
				"2-Methyl-3-(p-methoxyphenyl)propanal",
				"2-Methyl-3-(4-methoxyphenyl)propionaldehyde",
				"Canthoxal",
				"Fennaldehyde",
				"Foliaver",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/canthoxal/",
						nameUsed: "Canthoxal",
						notes: ["licorice", "basil", "fennel", "anise", "fruit", "water"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_057.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Methoxy-4-methylphenol",
			cas: ["93-51-6"],
			otherNames: [
				"Creosol",
				"p-Creosol",
				"p-Cresol, 2-methoxy-",
				"Homoguaiacol",
				"1-Hydroxy-2-methoxy-4-methylbenzene",
				"4-Hydroxy-3-methoxytoluene",
				"2-Methoxy-p-cresol",
				"3-Methoxy-4-hydroxytoluene",
				"4-Methylguaiacol",
				"p-Methylguaiacol",
				"4-Methyl-2-methoxyphenol",
				"Phenol, 2-methoxy-4-methyl-",
				"Valspice",
				"Methyl Guaiacol-4",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC-reduziert-Einzelseiten/SYM_F-Methyl-Guaiacol-4.pdf",
						nameUsed: "Methyl Guaiacol-4",
						notes: ["phenolic", "smoky", "sweet", "coffee", "vanilla", "cocoa"],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/creosol",
						nameUsed: "Creosol",
						notes: ["spicy", "vanilla", "balsam", "leather", "medicinal"],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Creosol has a spicy vanilla note with leathery inflexions and medicinal, balsam undertones. It can be used as a modifier in white floral accords and is interesting in floral, leather and animalic compositions.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_058.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.047,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Methyl-1,3-benzodioxole-5-propionaldehyde (MMDHCA)",
			cas: ["1205-17-0"],
			otherNames: [
				"1,3-Benzodioxole-5-propanal, α-methyl-",
				"3-(1,3-Benzodioxol-5-yl)-2-methylpropanal",
				"2-Methyl-3-(3,4-methylenedioxyphenyl)propionaldehyde",
				"2-Methyl-3-(3,4-methylenedioxyphenyl)propanal",
				"α-Methyl-3,4-(methylenedioxy)-hydrocinnamaldehyde",
				"α-Methyl-1,3-benzodioxole-5-propanal",
				"α-Methyl-1,3-benzodioxole-5-propionaldehyde",
				"3-(3,4-Methylenedioxyphenyl)-2-methylpropanal",
				"α-Methyl-3,4-methylene-dioxyhydrocinnamic aldehyde",
				"Heliofolal",
				"Heliogan",
				"Helional",
				"Tropional",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/helional/",
						nameUsed: "Helional",
						notes: ["green", "floral", "ozonic", "new mown hay"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_059.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Methyl cinnamic aldehyde",
			cas: ["101-39-3"],
			otherNames: [
				"α-Methylcinnamaldehyde",
				"α-Methylcinnamyl aldehyde",
				"α-Methylcinnamic aldehyde",
				"2-Methyl-3-phenyl-2-propenal",
				"3-Phenyl-2-methylacrolein",
				"2-Propenal, 2-methyl-3-phenyl-",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spice", "cinnamon", "sweet", "floral", "wood"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_060.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "6-Methyl-3,5-heptadien-2-one",
			cas: ["1604-28-0"],
			otherNames: [
				"3,5-Heptadien-2-one, 6-methyl-",
				"Methylheptadienone",
				"2-Methylhepta-2,4-dien-6-one",
				"6-Methylhepta-3,5-dien-2-one",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"green",
							"spicy",
							"herbal",
							"wood",
							"fruit",
							"cinnamon",
							"coconut",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_061.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.047,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl heptine carbonate",
			cas: ["111-12-6"],
			otherNames: [
				"Methyl heptyne carbonate",
				"Methyl 2-octynoate",
				"Methyl oct-2-ynoate",
				"MHC",
				"2-Octynoic acid, methyl ester",
				"Folione",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/folionetm",
						nameUsed: "Folione",
						notes: [
							"green",
							"leaf",
							"floral",
							"powerful",
							"violet",
							"cucumber",
						],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Folione™, used in traces, produces violet-leaf and cucumber notes. It blends extremely well with products in the orris family like the Isoraldeine™s and the ionones.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_062.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.047,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl ionone, mixed isomers",
			cas: [
				"1335-46-2",
				"127-42-4",
				"127-43-5",
				"127-51-5",
				"7779-30-8",
				"79-89-0",
				"1335-94-0",
				"15789-90-9",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isoraldeinetm-95",
						nameUsed: "Isoraldeine 95",
						notes: [
							"floral",
							"orris",
							"wood",
							"fruit",
							"violet",
							"spicy",
							"oriental",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Isoraldeine™ 95 has a fine violet note, often used in flowery, woody, spicy and oriental accords. It brings volume and diffusion to compounds as well as a skin care effect that is more powdery than with Isoraldeine™ 70.",
						],
						relatedCas: ["1335-46-2", "127-51-5", "15789-90-9"],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isoraldeinetm-cetone-alpha",
						nameUsed: "Isoraldeine™ Cetone Alpha",
						notes: ["floral", "orris", "wood", "powder"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Isoraldeine™ Cetone Alpha is a highly refined alpha-iso-methyl ionone used in rich floral perfumes where an exceptional quality of methyl ionone is required.",
						],
						relatedCas: ["1335-46-2", "127-51-5", "15789-90-9"],
					},
				},
			],
			otherNames: [
				"Methyl ionone, mixture of isomers",
				"Methyl-α-ionone",
				"α-Cetone",
				"α-Cyclocitrylidenebutanone",
				"α-Cyclocitrylidenemethyl ethyl ketone",
				"α-Methylionone",
				"1-Penten-3-one, 1-(2,6,6-trimethyl-2-cyclohexen-1-yl)-, [R-(E)]-",
				"(R-(E))-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)pent-1-en-3-one",
				"Methyl-beta-ionone",
				"Methyl-β-ionone",
				"β-Methylionone",
				"β-Cetone",
				"β-Cyclocitrylidenebutanone",
				"β-Iraldeine",
				"1-Penten-3-one, 1-(2,6,6-trimethyl-1-cyclohexen-1-yl)-",
				"5-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-4-penten-3-one",
				"1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)pent-1-en-3-one",
				"α-Isomethylionone",
				"3-Buten-2-one, 3-methyl-4-(2,6,6-trimethyl-2-cyclohexen-1-yl)-",
				"3-Methyl-4-(2,6,6-trimethyl-2-cyclohexen-1-yl)-3-buten-2-one",
				"α-Isomethyl ionone",
				"Iraldeine gamma",
				"Isoraldeine 95",
				"1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)pent-1-en-3-one",
				"1-Penten-3-one, 1-(2,6,6-trimethyl-2-cyclohexen-1-yl)-",
				"iso-Methyl-β-ionone",
				"3-Buten-2-one, 3-methyl-4-(2,6,6-trimethyl-1-cyclohexen-1-yl)-",
				"3-Methyl-4-(2,6,6-trimethylcyclohex-1-en-1-yl)but-3-en-2-one",
				"δ-Iraldeine",
				"Irone",
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_063.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 30,
							},
						},
						{
							status: "specification",
							notes: [
								"Pseudo methyl ionones (CAS 26651-96-7, 72968-25-3, 1117-41-5) must not be used as fragrance ingredients; up to 2% as impurity in methyl ionones is accepted.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl octine carbonate",
			cas: ["111-80-8"],
			otherNames: [
				"Methyl octyne carbonate",
				"Methyl 2-nonynoate",
				"2-Nonynoic acid, methyl ester",
				"MOC",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-octyne-carbonate",
						nameUsed: "Methyl Octyne Carbonate",
						notes: [
							"floral",
							"violet leaf",
							"green",
							"fruit",
							"vegetable",
							"cucumber",
							"powerful",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Methyl Octyne Carbonate is widely used in floral notes. It produces the powerful yet subtle note of violet leaves with a fruity-vegetable, cucumber undertone.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_064.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Methyl-2-(pentyloxy)cyclopent-2-en-1-one",
			cas: ["68922-13-4"],
			otherNames: [
				"2-Cyclopenten-1-one, 2-(pentyloxy)-3-methyl-",
				"Pentyloxy cyclopentenone",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "jasmine", "fruit", "sweet", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_065.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Nonyn-1-al dimethyl acetal",
			cas: ["13257-44-8"],
			otherNames: [
				"1,1-Dimethoxynon-2-yne",
				"2-Nonyn-1-al dimethyl acetal",
				"2-Nonyne, 1,1-dimethoxy-",
				"Parmavert",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "floral", "violet", "leaf", "fresh", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_066.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 9.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Oakmoss extracts",
			cas: ["90028-68-5", "68917-10-2", "9000-50-4"],
			otherNames: [
				"Oakmoss absolute",
				"Evernia absolute",
				"Evernia prunastri, ext.",
				"Mousse de Chêne absolute",
				"Oakmoss absolute (Evernia prunastri)",
				"Evernia prunastri (Oakmoss) extract",
				"Moss Oak Absolute IFRA 43",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/moss-oak-absolute-ifra-43/",
						nameUsed: "Moss Oak Absolute IFRA 43",
						notes: [
							"wood",
							"moss",
							"leather",
							"fruit",
							"balsam",
							"earth",
							"smoke",
							"marine",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_067.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.1,
							},
						},
						{
							status: "specification",
							notes: [
								"Oakmoss extracts must not contain added treemoss (source of resin acids).",
								"Dehydroabietic acid (DHA) from manufacturing traces must not exceed 0.1% (1000 ppm) in the extract.",
								"Atranol and chloroatranol must each be below 100 ppm in oakmoss extracts.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName:
				"1-(1,2,3,4,5,6,7,8 Octahydro-2,3,8,8-tetramethyl-2-naphthalenyl) ethanone (OTNE)",
			cas: ["54464-57-2", "54464-59-4", "68155-66-8", "68155-67-9"],
			otherNames: [
				"1-(1,2,3,4,5,6,7,8-Octahydro-2,3,8,8-tetramethyl-2-naphthalenyl)ethanone",
				"1',2',3',4',5',6',7',8'-Octahydro-2',3',8',8'-tetramethyl-2'-acetonaphthone",
				"1-(1,2,3,4,5,6,7,8-octahydro-2,3,8,8-tetramethyl-2-naphthyl)ethan-1-one",
				"1-(2,3,8,8-tetramethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-2-yl)ethanone",
				"7-Acetyl-1,2,3,4,5,6,7,8-octahydro-1,1,6,7-tetramethylnaphthalene",
				"Ethanone, 1-(1,2,3,4,5,6,7,8-octahydro-2,3,8,8-tetramethyl-2-naphthalenyl)-",
				"Naphthalene, 1,2,3,4,5,6,7,8-octahydro-2,3,8,8-tetramethyl-2-aceto-",
				"Ambergris Ketone",
				"Amberonne",
				"Ambralux",
				"Boisvelone",
				"Iso Ambois Super",
				"Iso-E Super",
				"Iso Gamma Super",
				"Isocyclemone E",
				"Orbitone",
				"Orbitone T",
				"1-(1,2,3,4,5,6,7,8-octahydro-2,3,5,5-tetramethyl-2-naphthalenyl)ethan-1-one",
				"1-(2,3,5,5-tetramethyl-1,2,3,4,5,6,7,8-octahydronaphthalen-2-yl)ethanone",
				"Ethanone, 1-(1,2,3,4,5,6,7,8-octahydro-2,3,5,5-tetramethyl-2-naphthalenyl)-",
				"Naphthalene, 1,2,3,4,5,6,7,8-octahydro-2,3,5,5-tetramethyl-2-aceto-",
				"1-(1,2,3,5,6,7,8,8a-Octahydro-2,3,8,8-tetramethyl-2-naphthyl)ethan-1-one",
				"1-(2,3,8,8-Tetramethyl-1,2,3,5,6,7,8,8a-octahydronaphthalen-2-yl)ethanone",
				"Ethanone, 1-(1,2,3,5,6,7,8,8a-octahydro-2,3,8,8-tetramethyl-2-naphthalenyl)-",
				"Decalene, 2-Aceto-2,3,8,8-Tetramethyl(1,2,3,5,6,7,8,8A-Octahydro)-",
				"1-(1,2,3,4,6,7,8,8a-Octahydro-2,3,8,8-tetramethyl-2-naphthyl)ethan-1-one",
				"1-(2,3,8,8-Tetramethyl-1,2,3,4,6,7,8,8a-octahydronaphthalen-2-yl)ethanone",
				"Ethanone, 1-(1,2,3,4,6,7,8,8a-octahydro-2,3,8,8-tetramethyl-2-naphthalenyl)-",
				"Decalene, 2-Aceto-2,3,8,8-Tetramethyl(1,2,3,4,6,7,8,8A-Octahydro)-",
				"Dimethyl Myrcetone Extra",
				"Iso E Super",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-DMM_Extra.pdf",
						nameUsed: "Dimethyl Myrcetone Extra",
						notes: [
							"wood",
							"cedarwood",
							"amber",
							"blondwood",
							"sandalwood",
							"vetiver",
						],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/iso-e-super/",
						nameUsed: "Iso E Super",
						notes: ["smooth", "wood", "amber", "velvet", "floral"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_068.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 20,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "1-Octen-3-yl acetate",
			cas: ["2442-10-6"],
			otherNames: [
				"3-Acetoxyoctene",
				"Amyl crotonyl acetate",
				"Amyl vinyl carbinyl acetate",
				"1-Octen-3-ol, acetate",
				"Octenyl acetate",
				"β-Octenyl acetate",
				"n-Pentyl vinyl carbinol acetate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "herbal", "fruit", "mint", "mushroom", "lavender"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_069.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Opoponax",
			cas: ["8021-36-1", "9000-78-6", "93384-32-8"],
			otherNames: [
				"Opoponax (absolute, resinoid, oil, gum, tincture)",
				"Bisabol-myrrh",
				"Sweet myrrh",
				"Opoponax chironium (L.) W.D.J. Koch",
				"Commiphora erythraea Engler var. glabrescens (Burseraceae)",
				"Opoponax RDE Super",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/opoponax-rde-super-pe-968239",
						nameUsed: "Opoponax RDE Super",
						notes: [
							"sweet",
							"earth",
							"liqueur",
							"mushroom",
							"spicy",
							"warm",
							"botanical",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_070.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
						{
							status: "specification",
							notes: [
								"Opoponax oil from pyrolysis must be rectified per GMP.",
								"Benzopyrene and 1,2-benzanthracene are PAH markers; if used alone or with rectified cade, birch tar, or styrax oils, combined marker concentration must not exceed 1 ppb in the final product.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Peru balsam",
			cas: ["8007-00-9"],
			otherNames: [
				"Exudation of Myroxylon pereirae Klotsch",
				"Balsam oil, Peru (Myroxylon pereirae Klotzsch)",
				"Myroxylon pereirae (Balsam Peru) oil",
				"Myroxylon pereirae (Balsam Peru) resin",
				"Myroxylon pereirae oil",
				"Peru balsam absolute",
				"Peru balsam anhydrol",
				"Peru Balsam Oil MD Fair Wild",
				"Peru Balsam Res",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/peru-balsam-oil-md-fair-wild/",
						nameUsed: "Peru Balsam Oil MD Fair Wild",
						notes: [
							"balsamic",
							"vanilla",
							"amber",
							"opulent",
							"sweet",
							"powder",
							"cinnamon",
						],
					},
				},
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/peru-balsam-res-pe-971716",
						nameUsed: "Peru Balsam Res",
						notes: ["balsamic", "resinous", "rich", "sweet", "amber"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_071.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.41,
							},
						},
						{
							status: "prohibition",
							notes: [
								"Peru balsam crude must not be used as a fragrance ingredient in any finished product application.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "1-(2,4,4,5,5-Pentamethyl-1-cyclopenten-1-yl)ethan-1-one",
			cas: ["13144-88-2"],
			otherNames: [
				"2-Acetyl-1,3,3,4,4-pentamethyl-1-cyclopentene",
				"Ethanone, 1-(2,4,4,5,5-pentamethyl-1-cyclopenten-1-yl)-",
				"1-(2,4,4,5,5-Pentamethylcyclopent-1-en-1-yl)ethanone",
				"Alpinone",
				"1-(2,4,4,5,5-Pentamethyl-1-cyclopenten-1-yl)ethan-1-one",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/1-24455-pentamethyl-1-cyclopenten-1-ylethan-1-one-83177",
						nameUsed: "1-(2,4,4,5,5-Pentamethyl-1-cyclopenten-1-yl)ethan-1-one",
						notes: [
							"wood",
							"floral",
							"sweet",
							"fruit",
							"powder",
							"orris",
							"musk",
							"dry",
							"tobacco",
							"amber",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_072.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Phenylacetaldehyde",
			cas: ["122-78-1"],
			otherNames: [
				"Benzeneacetaldehyde",
				"Benzylcarboxaldehyde",
				"Hyacinthin",
				"1-Oxo-2-phenylethane",
				"α-Tolualdehyde",
				"α-Toluic aldehyde",
				"Phenylacetic aldehyde",
				"Phenyl acetic aldehyde (pure)",
				"Phenyl Acetaldehyde 85%/PEA",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Phenylacetaldehyde.pdf",
						nameUsed: "Phenylacetaldehyde",
						notes: ["green", "floral", "honey"],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/phenyl-acetaldehyde-85pea",
						nameUsed: "Phenyl Acetaldehyde 85%/PEA",
						notes: ["floral", "green", "honey", "rose", "diffusive"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Phenyl Acetaldehyde 85%/PEA has a very diffusive rosy top note with honey facets.",
						],
						relatedCas: ["122-78-1", "60-12-8"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_073.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Phenylbutanal",
			cas: ["16251-77-7"],
			otherNames: [
				"Benzenepropanal, β-methyl-",
				"3-Phenylbutyraldehyde",
				"3-Phenyl-3-methylpropanal",
				"Trifernal",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/trifernalr-pe-989007",
						nameUsed: "Trifernal",
						notes: [
							"green",
							"grass",
							"tomato leaf",
							"earth",
							"bitter",
							"crushed foliage",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_074.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.44,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Phenylpropionaldehyde",
			cas: ["93-53-8", "1340-11-0", "34713-70-7"],
			otherNames: [
				"Benzeneacetaldehyde, α-methyl-",
				"Hydratropaldehyde",
				"α-Methylphenylacetaldehyde",
				"α-Methyltolualdehyde",
				"2-Phenylpropanal",
				"α-Phenylpropionaldehyde",
				"(R)-2-Phenylpropionaldehyde",
				"(S)-2-Phenylpropionaldehyde",
				"Hydratropic aldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"floral",
							"hyacinth",
							"sweet",
							"honey",
							"fruit",
							"spicy",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_075.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.16,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Propylidenephthalide",
			cas: ["17369-59-4"],
			otherNames: [
				"1(3H)-Isobenzofuranone, 3-propylidene-",
				"3-Propylidene-2-benzofuran-1(3H)-one",
				"Propylidene phthalide",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["herbal", "celery", "lovage", "green", "spicy"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_076.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Rose ketones",
			cas: [
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
			otherNames: [
				"1-(2,6,6-Trimethylcyclohexa-1,3-dienyl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-1,3-cyclohexadien-1-yl)-",
				"Damascenone",
				"Floriffone",
				"Doricenone",
				"(E)-1-(2,6,6-Trimethyl-1,3-cyclohexadien-1-yl)-2-buten-1-one",
				"trans-1-(2,6,6-Trimethyl-1,3-cyclohexadien-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-1,3-cyclohexadien-1-yl)-, (2E)-",
				"β-Damascenone",
				"(2Z)-1-(2,6,6-trimethyl-1,3-cyclohexadien-1-yl)-2-buten-1-one",
				"(Z)-β-Damascenone",
				"cis-Damascenone",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-1,3-cyclohexadien-1-yl)-, (Z)-",
				"α-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-2-cyclohexen-1-yl)-",
				"α-Damascone",
				"Dihydrofloriffone α",
				"(E)-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"trans-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)but-2-en-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-2-cyclohexen-1-yl)-, (2E)-",
				"trans-α-Damascone",
				"Damascone alpha",
				"Dorinone",
				"(Z)-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"cis-1-(2,6,6-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-2-cyclohexen-1-yl)-, (Z)-",
				"1-(2,6,6-Trimethylcyclohex-2-en-1-yl)but-2-en-1-one",
				"cis-α-Damascone",
				"1-(2,6,6-Trimethylcyclohex-1-en-1-yl)but-2-en-1-one",
				"(Z)-β-1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"(Z)-1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-1-cyclohexen-1-yl)-, (2Z)-",
				"cis-β-Damascone",
				"Damasione",
				"(2E)-1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"(E)-1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"trans-β-Damascone",
				"Dihydrofloriffone β",
				"Dorinone beta",
				"2,6,6-Trimethyl-1-(2-butenoyl)-1-cyclohexene",
				"2,6,6-Trimethyl-1-crotonoyl-1-cyclohexene",
				"1-(2,6,6-Trimethylcyclohexenyl)-2-buten-1-one",
				"1-(2,6,6-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"Damascone β",
				"β-Damascone",
				"δ-1-(2,6,6-Trimethyl-3-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,6,6-trimethyl-3-cyclohexen-1-yl)-",
				"1-(2,6,6-Trimethyl-3-cyclohexen-1-yl)-2-buten-1-one",
				"δ-Damascone",
				"Dihydrofloriffone TD",
				"[1α(E),2β]-1-(2,6,6-Trimethyl-3-cyclohexen-1-yl)-2-buten-1-one",
				"[1α(E),2β]-1-(2,6,6-Trimethylcyclohex-3-en-1-yl)but-2-en-1-one",
				"trans,trans-δ-Damascone",
				"trans δ Damascone",
				"1-(2,2-Dimethyl-6-methylenecyclohexyl)but-2-en-1-one",
				"2-Buten-1-one, 1-(2,2-dimethyl-6-methylenecyclohexyl)-",
				"Damascone γ",
				"γ-Damascone",
				"1-(2,4,4-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"(E)-1-(2,4,4-Trimethyl-2-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,4,4-trimethyl-2-cyclohexen-1-yl)-, (2E)-",
				"2-Buten-1-one, 1-(2,4,4-trimethyl-2-cyclohexen-1-yl)-, (E)-",
				"(E)-α-Isodamascone",
				"Isodamascone (high α)",
				"1-(2,4,4-Trimethyl-1-cyclohexen-1-yl)-2-buten-1-one",
				"2-Buten-1-one, 1-(2,4,4-trimethyl-1-cyclohexene-1-yl)-",
				"Generic β-Isodamascone",
				"Isodamascone (standard quality)",
				"1-(2,4,4-Trimethylcyclohex-2-en-1-yl)but-2-en-1-one",
				"2-Buten-1-one, 1-(2,4,4-trimethyl-2-cyclohexen-1-yl)-",
				"Isodamascone (isomer unspecified)",
				"Generic δ-Isodamascone",
				"2-Buten-1-one, 1-(2,4,4-trimethyl-2-cyclohexen-1-yl)-, (Z)-",
				"cis-Isodamascone",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"rose",
							"fruity",
							"apple",
							"berry",
							"plum",
							"wine",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_077.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.043,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Styrax",
			cas: [
				"8046-19-3",
				"8024-01-9",
				"94891-27-7",
				"94891-28-8",
				"101227-15-0",
			],
			otherNames: [
				"Styrax crude gums",
				"Styrax resin",
				"Styrax oil",
				"Styrax oil, rectified",
				"Styrax oil, pyrogenated, distilled",
				"Styrax Honduras Res",
				"Styrax Resinoid Low Styrene",
				"Benzoin Powder Resinoid Laos",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/styrax-honduras-res-pe-983834",
						nameUsed: "Styrax Honduras Res",
						notes: [
							"botanical",
							"balsam",
							"rich",
							"sweet",
							"floral",
							"spicy",
							"resinous",
							"cinnamon",
						],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/styrax-resinoid-low-styrene/",
						nameUsed: "Styrax Resinoid Low Styrene",
						notes: [
							"balsam",
							"leather",
							"cinnamon",
							"floral",
							"resin",
							"amber",
							"animalic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_078.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.64,
							},
						},
						{
							status: "specification",
							notes: [
								"Styrax oil from pyrolysis must be rectified per GMP.",
								"Benzopyrene and 1,2-benzanthracene are PAH markers; if used alone or with rectified cade, birch tar, or opoponax oils, combined marker concentration must not exceed 1 ppb in the final product.",
							],
						},
						{
							status: "prohibition",
							notes: [
								"Crude gums of Liquidambar styraciflua L. var. macrophylla or Liquidambar orientalis Mill. must not be used as fragrance ingredients in any finished product application.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Tea leaf absolute",
			cas: ["84650-60-2"],
			otherNames: [
				"Camellia sinensis leaf extract",
				"Tea, ext.",
				"Tea sinensis absolute",
				"Thea chinensis ext.",
				"Thea sinensis ext.",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "herbal", "hay", "leaf", "smoke", "wood", "tea"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_079.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.21,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Treemoss extracts",
			cas: ["90028-67-4", "68648-41-9", "68917-40-8"],
			otherNames: [
				"Treemoss absolute (Pseudevernia furfuracea)",
				"Treemoss (Usnea furfuracea)",
				"Treemoss colourless",
				"Pseudevernia furfuracea extract",
				"Cedar moss",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"moss",
							"wood",
							"resin",
							"earth",
							"powder",
							"leather",
							"seaweed",
							"smoke",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_080.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.1,
							},
						},
						{
							status: "specification",
							notes: [
								"Dehydroabietic acid (DHA) must not exceed 0.8% as a marker of 2% total resin acids in treemoss extracts.",
								"Atranol and chloroatranol must each be below 100 ppm in treemoss extracts.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "o,m,p-Tolualdehydes and their mixtures",
			cas: ["529-20-4", "620-23-5", "104-87-0", "1334-78-7"],
			otherNames: [
				"2-Tolualdehyde",
				"ortho-Tolualdehyde",
				"2-Methylbenzaldehyde",
				"meta-Tolualdehyde",
				"3-Methyl-benzaldehyde",
				"Benzaldehyde, 3-methyl-",
				"para-Tolualdehyde",
				"4-Methyl-benzaldehyde",
				"Benzaldehyde, 4-methyl-",
				"Tolyl Aldehyde Para Extra",
				"Benzaldehyde, methyl-",
				"o,m,p-Methyl-benzaldehydes",
				"Methylbenzaldehyde (mixed 2,3,4)",
				"Tolualdehydes (mixed o,m,p)",
				"Tolualdehyde",
				"Toluic aldehyde (mixed 2,3,4)",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"cherry",
							"fruity",
							"sweet",
							"almond",
							"floral",
							"spicy",
							"phenolic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_081.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2,6,6-Trimethylcyclohex-1,3-dienyl methanal",
			cas: ["116-26-7"],
			otherNames: [
				"2,6,6-Trimethylcyclohexa-1,3-diene-1-carbaldehyde",
				"2,6,6-Trimethyl-1,3-cyclohexadienal",
				"2,6,6-Trimethyl-1,3-cyclohexadien-1-carboxaldehyde",
				"1,1,3-Trimethyl-2-formylcyclohexa-2,4-diene",
				"Dehydro-β-cyclocitral",
				"Safranal",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/safranal",
						nameUsed: "Safranal",
						notes: ["spicy", "safron", "herbaceous", "tobacco", "floral"],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Safranal has a spicy saffron-like note with herbaceous, tobacco facets and floral undertones. It is very useful in spicy, agrestic, tobacco, orris and woody compositions.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_082.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.012,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Verbena oil and absolute (Lippia citriodora Kunth.)",
			cas: ["8024-12-2", "85116-63-8"],
			otherNames: [
				"Lippia citriodora oils",
				"Lippia citriodora absolute",
				"Verbena absolute",
				"Aloysia triphylla absolute",
				"Lippia triphylla absolute",
				"Verbena triphylla absolute",
				"Zappania citrodora absolute",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"citrus",
							"lemon",
							"herbal",
							"green",
							"floral",
							"sweet",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_083.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.69,
							},
						},
						{
							status: "prohibition",
							notes: [
								"Verbena oils from Lippia citriodora Kunth. must not be used as fragrance ingredients.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Ylang ylang extracts",
			cas: ["8006-81-3", "68606-83-7", "83863-30-3"],
			otherNames: [
				"Cananga odorata (Lamark) (Hooker et Thompson) (Anonaceae)",
				"Cananga odorata extract",
				"Cananga odorata flower oil",
				"Cananga odorata oil",
				"Cananga oil",
				"Ylang ylang oil (Cananga odorata Hook. f. and Thomas)",
				"Ylang ylang oil extra",
				"Ylang ylang oil I",
				"Ylang ylang oil II",
				"Ylang ylang oil III",
				"Ylang ylang, Cananga odorata, ext.",
				"Ylang ylang oil complete madag org",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/ylang-ylang-oil-complete-madag-org/",
						nameUsed: "Ylang ylang oil complete madag org",
						notes: [
							"floral",
							"solar",
							"spicy",
							"exotic",
							"warm",
							"white flowers",
							"fruit",
							"wintergreen",
							"soft",
							"cream",
							"balsam",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_084.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.73,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Acetyl hexamethyl indan (AHMI)",
			cas: ["15323-35-0"],
			otherNames: [
				"5-Acetyl-1,1,2,3,3,6-hexamethyl indan",
				"6-Acetyl-1,1,2,3,3,5-hexamethylindane",
				"1-(2,3-Dihydro-1,1,2,3,3,6-hexamethyl-1h-inden-5-yl)ethanone",
				"Ethanone, 1-(2,3-dihydro-1,1,2,3,3,6-hexamethyl-1H-inden-5-yl)-",
				"1,1,2,3,3,6-Hexamethylindan-5-yl methylketone",
				"Phantolid",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "sweet", "powder", "floral", "wood"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_085.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Angelica root oil",
			cas: ["8015-64-3", "84775-41-7"],
			otherNames: [
				"Angelica archangelica oil",
				"Angelica archangelica root oil",
				"Angelica root oil (Angelica archangelica L.)",
				"Angelica Root Oil Belgium",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/angelica-root-oil-belgium",
						nameUsed: "Angelica Root Oil Belgium",
						notes: ["zest", "spicy", "earth", "musk", "terpenic"],
						olfactiveFamily: "Aromatic",
						olfactiveDescription: [
							"Angelica Root Oil Belgium has an aromatic and spicy profile with musky and earthy undertones. The essential oil contains very small amounts of components such as exaltolide, which gives the musky notes.",
							"Its particular profile blends perfectly with green accords, giving them a fresh, natural character. Its musky, terpenic and spicy facets are an excellent addition to floral heart notes or woody bases.",
						],
						relatedCas: ["8015-64-3"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_086.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.8,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Bergamot oil expressed",
			cas: ["8007-75-8", "89957-91-5"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/bergamot-oil-italy",
						nameUsed: "Bergamot Oil Italy",
						notes: [
							"fresh",
							"zest",
							"lavender",
							"rich",
							"sweet",
							"fruit",
							"floral",
							"balsamic",
							"bright",
							"sparkling",
							"citrus",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"With its extremely rich, sweet and fruity top note, followed by floral and balsamic undertones, this oil brings a beautifully bright and sparkling citrus facet to fragrances.",
							"Bergamot is the mainstay of the first modern perfume accord: cologne. From the beginning of the 18th century to the present day, bergamot has been used in all types of perfume to bring freshness and naturalness to the fragrance. It is particularly used in floral top notes to accompany tea and citrus accords, and in the heart of woody or ambery compositions to add a fresh and floral freshness.",
						],
						relatedCas: ["8007-75-8"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_087.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Bitter orange peel oil expressed",
			cas: ["68916-04-1", "72968-50-4"],
			otherNames: [
				"Orange Peel Oil, Bitter (Citrus aurantium L. subsp amara L.)",
				"Bitter orange oil (Citrus aurantium L. subsp. amara L.)",
				"Citrus aurantium peel oil",
				"Curacao peel oil (Citrus aurantium L.)",
				"Daidai peel oil (Citrus aurantium L.)",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/petitgrain-oil-paraguay",
						nameUsed: "Petitgrain Oil Paraguay",
						notes: [
							"fresh",
							"green",
							"sweet",
							"floral",
							"orange blossom",
							"wood",
							"herb",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"A fresh, green and sweet floral reminiscent of orange blossom with a woody, herbaceous undertone. Petitgrain oil is often used in colognes to accompany an orange blossom absolute or neroli. It is also sometimes used in tea notes. It is also used in soap perfumery, where its great strength and versatility are appreciated.",
						],
						relatedCas: ["72968-50-4"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_088.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName:
				"Citrus oils and other furocoumarins containing essential oils",
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"citrus",
							"fresh",
							"zesty",
							"juicy",
							"bitter",
							"green",
							"herbal",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_089.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.0015,
							},
							notes: [
								"Limit is for total bergapten (5-MOP) in the finished product (15 ppm), not for a single oil concentration.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Cumin oil",
			cas: ["8014-13-9", "84775-51-9"],
			otherNames: [
				"Cumin seed oil",
				"Cuminum cyminum (Cumin) seed oil",
				"Cuminum cyminum L.",
				"Cuminum cyminum oil",
				"Oils, cumin (Cuminum cyminum)",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spicy", "warm", "herbal", "earthy", "animalic", "sharp"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_090.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Grapefruit oil expressed",
			cas: ["8016-20-4", "90045-43-5"],
			otherNames: ["Grapefruit Oil USA"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/grapefruit-oil-usa",
						nameUsed: "Grapefruit Oil USA",
						notes: [
							"fresh",
							"zest",
							"bitter",
							"orange",
							"grapefruit",
							"citrus",
							"sweet",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Grapefruit essential oil is a vibrant citrus note with a fresh sweetness and bitter notes that set it apart from other citrus fruits.",
							"Often found in eau de cologne, grapefruit essential oil blossoms with vetyver notes or as an accompaniment to floral notes, giving them a natural aldehydic freshness.",
						],
						relatedCas: ["8016-20-4"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_091.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Lemon oil cold pressed",
			cas: ["8008-56-8", "84929-31-7"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"citrus",
							"fresh",
							"juicy",
							"zesty",
							"sharp",
							"tart",
							"sweet",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_092.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Lime oil expressed",
			cas: ["8008-26-2", "90063-52-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/lmr-compendium/lime-oil-cp-persian-mex-fcr-lmr/",
						nameUsed: "Lime Oil CP Persian Mex FCR LMR",
						notes: [
							"fresh",
							"citrus",
							"zest",
							"juicy",
							"lime",
							"herbal",
							"sweet",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_093.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.7,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl N-methylanthranilate",
			cas: ["85-91-6"],
			otherNames: [
				"Benzoic acid, 2-(methylamino)-, methyl ester",
				"Dimethyl anthranilate",
				"2-Methylamino methyl benzoate",
				"N-Methylanthranilic acid, methyl ester",
				"Methyl 2-(methylamino)benzoate",
				"Methyl 2-methylaminobenzoate",
				"Methyl o-methylaminobenzoate",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/dimethyl-anthranilate",
						nameUsed: "Dimethyl Anthranilate",
						notes: ["floral", "orange blossom", "neroli", "mandarin"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Dimethyl Anthranilate is similar in use to Methyl Anthranilate, but it will not form Schiff bases with the aldehydes and has little or no tendency to discolour.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_094.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.1,
							},
						},
						{
							status: "specification",
							notes: [
								"This material has been identified for having the potential of forming nitrosamines in nitrosating systems. Downstream users therefore have to be notified of the presence of the material and its potential, to be able to consider adequate protective measures.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl beta-naphthyl ketone",
			cas: ["93-08-3"],
			otherNames: [
				"2-Acetonaphthone",
				"β-Acetylnaphthalene",
				"Cetone d",
				"Ethanone, 1-(2-naphthalenyl)",
				"β-Methyl naphthyl ketone",
				"β-Naphthyl methyl ketone",
				"Oranger crystals",
				"Methyl Naphthyl Ketone Beta Cryst.",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_ohnePC_Datenblaetter/SYM_P_Methyl_Naphthyl_Ketone_Beta_Cryst.pdf",
						nameUsed: "Methyl Naphthyl Ketone Beta Cryst.",
						notes: ["floral", "orange blossom", "anthranilate", "powder"],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/oranger-crystals",
						nameUsed: "Oranger Crystals",
						notes: ["floral", "orange blossom", "sweet", "honey"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Oranger Crystals is very useful in neroli / orange blossom blends. It gives pretty effects in jasmine accords and colognes. Its stability and substantivity allow it to be used to great advantage in soap and detergent compositions.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_095.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Rue oil",
			cas: ["8014-29-7", "84929-47-5"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"herbal",
							"bitter",
							"fruity",
							"coconut",
							"citrus",
							"sharp",
							"acrid",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_096.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.15,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Tagetes oil and absolute",
			cas: ["90131-43-4", "8016-84-0", "91722-29-1", "91770-75-1"],
			otherNames: [
				"Tagetes erecta L.",
				"Tagetes absolute (Tagetes patula L.)",
				"Tagetes patula absolute",
				"Tagetes patula, ext.",
				"Tagetes minuta absolute",
				"Tagetes oil",
				"Tagete EO",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/tagete-eo-pe-984594",
						nameUsed: "Tagete EO",
						notes: [
							"fresh",
							"sweet",
							"floral",
							"fruit",
							"lemon",
							"apple",
							"pink grapefruit",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_097.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
						{
							status: "specification",
							notes: [
								"The content of alpha-Terthienyl (Terthiophene, CAS number 1081-34-1) in Tagetes patula and Tagetes minuta oils and absolutes must not exceed 0.35%.",
							],
						},
						{
							status: "prohibition",
							notes: [
								"Tagetes erecta should not be used as a fragrance ingredient in any finished product application. Only Tagetes patula and Tagetes minuta should be used as fragrance ingredients according to the Restriction and Specification set in this Standard.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Furfural",
			cas: ["98-01-1"],
			otherNames: [
				"2-Formylfuran",
				"Fural",
				"Furaldehyde",
				"2-Furaldehyde",
				"2-Furancarbonal",
				"2-Furancarboxaldehyde",
				"Furfuraldehyde",
				"α-Furfuraldehyde",
				"2-Furylcarboxaldehyde",
				"Pyromucic aldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"bread",
							"almond",
							"sweet",
							"baked",
							"brown",
							"wood",
							"caramel",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_098.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.001,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Estragole",
			cas: ["140-67-0", "1407-27-8", "77525-18-9"],
			otherNames: [
				"p-Allylanisole",
				"4-Allylanisole",
				"1-Allyl-4-methoxybenzene",
				"Benzene, 1-methoxy-4-(2-propenyl)-",
				"Chavicyl methyl ether",
				"Isoanethole",
				"p-Methoxyallylbenzene",
				"1-Methoxy-4-(2-propen-1-yl)benzene",
				"Methyl chavicol",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"anise",
							"licorice",
							"sweet",
							"phenolic",
							"herb",
							"basil",
							"spicy",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_099.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.014,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl eugenol",
			cas: ["93-15-2"],
			otherNames: [
				"Eugenol methyl ether",
				"Eugenyl methyl ether",
				"Methyl eugenol ether",
				"Allylveratrole",
				"4-Allylveratrole",
				"Veratrole methyl ether",
				"4-Allyl-1,2-dimethoxybenzene",
				"Benzene, 1,2-dimethoxy-4-(2-propenyl)-",
				"1,2-Dimethoxy-4-allylbenzene",
				"1,2-dimethoxy-4-(2-propenyl)-benzene",
				"3,4-Dimethoxyallylbenzene",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"anise",
							"licorice",
							"sweet",
							"phenolic",
							"herb",
							"basil",
							"spicy",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_100.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.011,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl N-formylanthranilate",
			cas: ["41270-80-8"],
			otherNames: [
				"Benzoic acid, 2-(formylamino)-, methyl ester",
				"Methyl 2-(formylamino)benzoate",
				"Methyl 2-formamidobenzoate",
				"Methyl o-formamidobenzoate",
				"N-Formylanthranilic acid, methyl ester",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"powdery",
							"medicinal",
							"fruity",
							"grape",
							"violet leaf",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_101.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.1,
							},
						},
						{
							status: "specification",
							notes: [
								"This material has been identified for having the potential of forming nitrosamines in nitrosating systems. Downstream users therefore have to be notified of the presence of the material and its potential, to be able to consider adequate protective measures.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Thujone",
			cas: ["546-80-5", "471-15-8", "76231-76-0", "1125-12-8"],
			otherNames: [
				"1-Isopropyl-4-methylbicyclo[3.1.0]hexan-3-one",
				"3-Thujanone, (1s,4r,5r)-(-)-",
				"α-Thujone",
				"β-Thujone",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"herbal",
							"camphoreous",
							"wood",
							"cedar",
							"spicy",
							"mint",
							"medicinal",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_102.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Acetyl ethyl tetramethyl tetralin (AETT)",
			cas: ["88-29-9"],
			otherNames: [
				"7-Acetyl-6-ethyl-1,1,4,4-tetramethyl-1,2,3,4-tetrahydronaphthalene",
				"Ethanone, 1-(3-ethyl-5,6,7,8-tetrahydro-5,5,8,8-tetramethyl-2-naphthalenyl)-",
				"Versalide",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "sweet", "powdery", "clean", "wood", "animalic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_103.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Acetyl ethyl tetramethyl tetralin (AETT) should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Acetyl isovaleryl",
			cas: ["13706-86-0"],
			otherNames: [
				"5-Methyl-2,3-hexanedione",
				"2,3-Hexanedione, 5-methyl",
				"Acetyl isopentanoyl",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["butter", "cream", "oil", "sweet", "cheese", "fat"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_104.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Acetyl isovaleryl should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Alantroot oil",
			cas: ["84012-20-4", "97676-35-2"],
			otherNames: [
				"Alantroot oil (Inula helenium)",
				"Elecampane oil",
				"Inula helenium oil",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"wood",
							"herbal",
							"earth",
							"medicinal",
							"warm",
							"honey",
							"sweet",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_105.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Alantroot oil should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Allyl heptine carbonate",
			cas: ["73157-43-4"],
			otherNames: ["Allyl 2-octynoate", "2-Octynoic acid, 2-propenyl ester"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "violet leaf", "cucumber", "fruity", "vegetal"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_106.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Allyl heptine carbonate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Allyl isothiocyanate",
			cas: ["57-06-7"],
			otherNames: [
				"Allyl isosulfocyanate",
				"Allyl thiocarbonimide",
				"1-Propenal, 3-isothiocyanato-",
				"2-Propenyl isothiocyanate",
				"AITC",
				"Allinat/ Allyl Isothiocyanate 98 Toco",
				"Allinat",
				"Allyl Isothiocyanate 98 Toco",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC_Einzel-PDF/SYM_FC-Allinat_Allyl_Isothiocyanate_98_Toco.pdf",
						nameUsed: "Allinat/ Allyl Isothiocyanate 98 Toco",
						notes: ["mustard", "radish", "pungent"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_107.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Allyl isothiocyanate should not be used as a fragrance ingredient.",
								"Allyl isothiocyanate as such should not be used as a fragrance ingredient.",
								"The natural extracts containing Allyl isothiocyanate should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Amylcyclopentenone",
			cas: ["25564-22-1"],
			otherNames: [
				"2-Cyclopenten-1-one, 2-pentyl",
				"2-Pentyl-2-cyclopentenone",
				"2-Pentylcyclopent-2-en-1-one",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"jasmine",
							"floral",
							"fruity",
							"celery",
							"herbal",
							"lactonic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_108.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Amylcyclopentenone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Anisylidene acetone",
			cas: ["943-88-4"],
			otherNames: [
				"3-Butene-2-one, 4-(4-methoxyphenyl)-",
				"4-(p-methoxyphenyl)-3-butene-2-one",
				"Methyl p-methoxycinnamyl ketone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "floral", "cream", "balsam", "hawthorn", "anise"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_109.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Anisylidene acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "cis-and trans-Asarone",
			cas: ["494-40-6", "2883-98-9", "5273-86-9"],
			otherNames: [
				"Benzene, 1,2,4-trimethoxy-5-(1-propen-1-yl)- (unspecified isomer)",
				"(E)-and (Z)-2,4,5-Trimethoxypropen-1-yl benzene",
				"α-Asarone",
				"trans-Asarone",
				"Benzene, 1,2,4-trimethoxy-5-(1-propenyl)-, (E)-",
				"trans-Isoasarone",
				"ß-Asarone",
				"cis-ß-Asarone",
				"Benzene, 1,2,4-trimethoxy-5-(1-propenyl)-, (Z)-",
				"cis-Isoasarone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spicy", "herbal", "sweet", "wood", "warm"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_110.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
						{
							status: "prohibition",
							notes: [
								"cis- and trans-Asarone as such should not be used as fragrance ingredients.",
								"The natural extracts containing cis- and trans-Asarone should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzene",
			cas: ["71-43-2"],
			otherNames: ["Benzol"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"aromatic",
							"solvent-like",
							"chemical",
							"medicinal",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_111.pdf",
					rules: [
						{
							status: "prohibition",
							notes: ["Benzene should not be used as a fragrance ingredient."],
						},
						{
							status: "specification",
							notes: [
								"The level of Benzene has to be kept as low as practicable and should never exceed 1 ppm in the fragrance compound/mixture or fragrance oil.",
								"Since the introduction of the original Restriction on the use of Benzene by IFRA in 1988, there have been significant changes in manufacturing practices that permit the reduction of the maximum permitted level of this substance. These include use of technological improvements allowing replacement of this solvent for the extraction of fragrance materials and in eliminating its presence as an impurity in alternative extraction solvents.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzyl cyanide",
			cas: ["140-29-4"],
			otherNames: [
				"Benzeneacetonitrile",
				"Benzylnitrile",
				"Phenylacetonitrile",
				"Phenyl acetyl nitrile",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "sweet", "honey", "balsamic", "powdery"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_112.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
						{
							status: "prohibition",
							notes: [
								"Benzyl cyanide as such should not be used as fragrance ingredient.",
								"The natural extracts containing Benzyl cyanide should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Benzylidene acetone",
			cas: ["122-57-6"],
			otherNames: [
				"4-Phenyl-3-buten-2-one",
				"3-Buten-2-one, 4-phenyl-",
				"Benzilideneacetone",
				"Methyl styryl ketone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"balsamic",
							"floral",
							"powdery",
							"spicy",
							"cinnamon",
							"coumarin",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_113.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Benzylidene acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Birch wood pyrolysate",
			cas: [
				"8001-88-5",
				"68917-50-0",
				"84012-15-7",
				"85251-66-7",
				"85940-29-0",
				"91745-85-6",
			],
			otherNames: [
				"Birch tar oil, crude",
				"Birch tar oil dephenolated",
				"Birch tar oil rectified",
				"Essence bouleau dephenolisée",
				"Essence bouleau (Goudron) rect.",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"smoky",
							"leather",
							"wood",
							"burnt",
							"phenolic",
							"tar",
							"balsamic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_114.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Birch wood pyrolysate should not be used as a fragrance ingredient.",
								"Crude birch wood (bark) pyrolysates (oils) derived by pyrolysis (destructive distillation) of the wood or bark of Betula pubescens, Betula pendula, Betula lenta or Betula alba should not be used as a fragrance ingredient for any finished product application. Only rectified (purified) Birch tar oils being in compliance with the limitations for polynuclear aromatic hydrocarbons (PAH) established by this IFRA Standard should be used.",
							],
						},
						{
							status: "specification",
							notes: [
								"Limit content of polynuclear aromatic hydrocarbons (PAH) resulting from the use of rectified oils according to Good Manufacturing Practice.",
								"Benzopyrene and 1,2-Benzanthracene are to be used as markers for PAH. If used alone or in combination with rectified Cade oil, rectified Styrax oil or rectified Opoponax oil, the total concentration of both of the markers should not exceed 1 ppb in the final product.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Boldo oil",
			cas: ["8022-81-9", "84649-96-7"],
			otherNames: [
				"Boldo leaf oil (Peumus boldus Mol.)",
				"Oil, boldo leaf",
				"Peumus boldus oil",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"herbal",
							"camphoreous",
							"minty",
							"spicy",
							"medicinal",
							"cineolic",
							"warm",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_115.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Boldo oil should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Bromo-1,7,7-trimethylbicyclo[2.2.1]heptane-2-one",
			cas: ["76-29-9"],
			otherNames: [
				"Bicyclo[2.2.1]heptan-2-one, 3-bromo-1,7,7-trimethyl-",
				"2-Bornanone, 3-bromo-",
				"3-Bromobornan-2-one",
				"3-Bromo-2-bornanone",
				"3-Bromocamphor",
				"Camphor bromide",
				"Camphor, 3-bromo-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"camphoreous",
							"herbal",
							"medicinal",
							"sharp",
							"minty",
							"penetrating",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_116.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"3-Bromo-1,7,7-trimethylbicyclo[2.2.1]heptane-2-one should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Bromostyrene",
			cas: ["103-64-0"],
			otherNames: [
				"Benzene, (2-bromoethenyl)-",
				"α-Bromo-ß-phenylethylene",
				"ß-Bromostyrene",
				"ß-Bromovinylbenzene",
				"ω-Bromstyrene",
				"Bromstyrol",
				"Bromstyrolene",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "hyacinth", "floral", "leaf", "sharp", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_117.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Bromostyrene should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "p-tert-Butylphenol",
			cas: ["98-54-4"],
			otherNames: [
				"4-tert-Butylphenol",
				"4-(1,1-Dimethylethyl) phenol",
				"1-Hydroxy-4-tert-butylbenzene",
				"Phenol, 4-(1,1-dimethylethyl)-",
				"Phenol, p-tert-butyl",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"leathery",
							"oakmoss",
							"phenolic",
							"medicinal",
							"smoke",
							"spicy",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_118.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"p-tert-Butylphenol should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Cade oil",
			cas: ["8013-10-3", "90046-02-9"],
			otherNames: ["Juniper tar", "Juniper tar oil", "Juniperus oxycedrus oil"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"smoky",
							"leather",
							"tar",
							"wood",
							"burnt",
							"phenolic",
							"balsamic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_119.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Cade oil should not be used as a fragrance ingredient.",
								"Crude cade oil derived by pyrolysis of the wood and twigs of Juniperus oxycedrus L. should not be used as a fragrance ingredient for any finished product application.",
								"Only rectified (purified) cade oils being in compliance with the limitations for polynuclear aromatic hydrocarbons (PAH) established by this IFRA Standard should be used.",
							],
						},
						{
							status: "specification",
							notes: [
								"Limit content of polynuclear aromatic hydrocarbons (PAH) resulting from the use of rectified oils according to Good Manufacturing Practice.",
								"Benzopyrene and 1,2-Benzanthracene are to be used as markers for PAH. If used alone or in combination with rectified Birch tar oils, rectified Opoponax oil or rectified Styrax oil, the total concentration of both of the markers should not exceed 1 ppb in the final product.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Carvone oxide",
			cas: ["33204-74-9"],
			otherNames: [
				"Carvone epoxide",
				"1,6-Epoxy-p-menth-8-en-2-one",
				"1-Methyl-4-(1-methylvinyl)-7-oxabicyclo[4.1.0]heptan-2-one",
				"7-Oxabicyclo[4.1.0]heptan-2-one, 1-methyl-4-(1-methylethenyl)-",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"herbal",
							"minty",
							"spearmint",
							"carvone-like",
							"sweet",
							"spicy",
							"fruity",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_120.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Carvone oxide should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Chenopodium oil",
			cas: ["8006-99-3", "8024-11-1", "89997-47-7"],
			otherNames: [
				"American wormseed oil",
				"Chenopodium ambrosioides L. var anthelminticum",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["camphoreous", "herbal", "sharp", "wood", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_121.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Chenopodium oil should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Cinnamylidene acetone",
			cas: ["4173-44-8"],
			otherNames: [
				"3,5-Hexadien-2-one, 6-phenyl-",
				"Methyl 4-phenyl-1,3-butadienyl ketone",
				"1-Phenyl-3,5-hexadien-5-one",
				"6-Phenyl-3,5-hexadien-2-on",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["spicy", "cinnamon", "sweet", "balsamic", "wood", "powder"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_122.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Cinnamylidene acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Colophony",
			cas: ["8050-09-7"],
			otherNames: ["Colophonium", "Rosin"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["balsamic", "resinous", "wood", "pine", "warm", "smoky"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_123.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Colophony should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Costus root oil, absolute and concrete",
			cas: ["8023-88-9", "90106-55-1"],
			otherNames: [
				"Costus root essential oil, absolute and concrete (Saussurea lappa Clarke)",
				"Oils, costus",
				"Saussurea lappa root oil",
				"Spiral flag oil",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["animalic", "musk", "wood", "iris", "fat", "sebum"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_124.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Costus root oil, absolute and concrete should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclamen alcohol",
			cas: ["4756-19-8"],
			otherNames: [
				"3-(4-Isopropylphenyl)-2-methylpropan-1-ol",
				"3-(p-Isopropyl)phenyl-2-methyl-1-propanol",
				"Benzenepropanol, β-methyl-4-(1-methylethyl)-",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"floral",
							"cyclamen",
							"linden blossom",
							"green",
							"mild",
							"rhubarb",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_125.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Cyclamen alcohol should not be used as a fragrance ingredient.",
							],
						},
						{
							status: "specification",
							notes: [
								"Cyclamen alcohol should not be used as a fragrance ingredient as such, but a level of up to 1.5% in Cyclamen aldehyde (CAS number 103-95-7) is accepted.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk alpha",
			cas: ["63697-53-0"],
			otherNames: [
				"1,3-Dibromo-2-methoxy-4-nitro-5-(1,1-dimethylethyl)-6-methyl-benzene",
				"Benzene, 1,3-dibromo-5-(1,1-dimethylethyl)-2-methoxy-4-methyl-6-nitro",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "toxic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_126.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Musk alpha should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk KS",
			cas: ["62265-99-0"],
			otherNames: [
				"1,3-Dibromo-2-methoxy-4-methyl-5-nitrobenzene",
				"Benzene, 1,3-dibromo-2-methoxy-4-methyl-5-nitro-",
				"1,3-Dibromo-2-methoxy-5-nitro-6-methylbenzene",
				"2,4-Dibromo-3-methoxy-6-nitrotoluene",
				"2,6-Dibromo-3-methyl-4-nitroanisole",
				"6-Nitro-2,4-dibromo-3-methoxytoluene",
				"Bromorose",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_127.pdf",
					rules: [
						{
							status: "prohibition",
							notes: ["Musk KS should not be used as a fragrance ingredient."],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,2-Dichloro-1-methylcyclopropylbenzene",
			cas: ["3591-42-2"],
			otherNames: ["Benzene, (2,2-dichloro-1-methylcyclopropyl)-"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["herbal", "sweet", "aromatic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_128.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2,2-Dichloro-1-methylcyclopropylbenzene should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,4-Dienals",
			cas: [
				"764-40-9",
				"142-83-6",
				"80466-34-8",
				"5910-85-0",
				"30361-28-5",
				"6750-03-4",
				"2363-88-4",
				"13162-46-4",
				"21662-16-8",
				"25152-84-5",
				"30361-29-6",
				"4313-03-5",
				"20432-40-0",
				"4488-48-6",
				"5577-44-6",
				"5910-87-2",
			],
			otherNames: [
				"2,4-Pentadienal",
				"2,4-Hexadienal",
				"2,4-Heptadienal",
				"2,4-Octadienal",
				"2,4-Nonadienal",
				"2,4-Decadienal",
				"2,4-Undecadienal",
				"2,4-Dodecadienal",
				"trans,trans-2,4-Decadienal",
				"trans,trans-2,4-Undecadienal",
				"2,4-Heptadien-1-al",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"fat",
							"oil",
							"citrus",
							"orange",
							"green",
							"grass",
							"fried",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_129.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2,4-Dienals should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Diethyl maleate",
			cas: ["141-05-9"],
			otherNames: [
				"2-Butenedioic acid (2Z)-, diethyl ester",
				"Ethyl maleate",
				"Maleic acid, diethyl ester",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["banana", "citrus", "fruity", "sweet", "apple", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_130.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Diethyl maleate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,4-Dihydroxy-3-methylbenzaldehyde",
			cas: ["6248-20-0"],
			otherNames: [
				"Benzaldehyde, 2,4-dihydroxy-3-methyl-",
				"4-Formyl-2-methylresorcinol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"phenolic",
							"sweet",
							"medicinal",
							"burnt",
							"spicy",
							"smoky",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_131.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2,4-Dihydroxy-3-methylbenzaldehyde should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "4,6-Dimethyl-8-tert-butylcoumarin",
			cas: ["17874-34-9"],
			otherNames: [
				"2H-1-Benzopyran-2-one, 8-(1,1-dimethylethyl)-4,6-dimethyl-",
				"Butolia",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_132.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"4,6-Dimethyl-8-tert-butylcoumarin should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "3,7-Dimethyl-2-octen-1-ol",
			cas: ["40607-48-5"],
			otherNames: ["6,7-Dihydrogeraniol", "2-Octen-1-ol, 3,7-dimethyl"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "rose", "geranium", "wax", "fresh", "citrus"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_133.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"3,7-Dimethyl-2-octen-1-ol should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Dimethyl citraconate",
			cas: ["617-54-9"],
			otherNames: [
				"2-Butenedioic acid, 2-methyl-, dimethyl ester, (2Z)-",
				"Dimethyl methyl maleate",
				"Methylmaleic acid, dimethyl ester",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fruity", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_134.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Dimethyl citraconate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Diphenylamine",
			cas: ["122-39-4"],
			otherNames: ["Benzeneamine, N-phenyl-"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_135.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Diphenylamine should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,4-Dodecadien-1-ol, (2E, 4E)",
			cas: ["18485-38-6"],
			otherNames: ["2,4-Dodecadien-1-ol"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fat", "oil", "wax", "green", "melon", "citrus"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_136.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2,4-Dodecadien-1-ol, (2E, 4E) should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName:
				"Esters of 2-Nonynoic acid (except Methyl octine carbonate)",
			cas: ["10031-92-2"],
			otherNames: [
				"Ethyl 2-nonynoate",
				"Ethyl octine carbonate",
				"Ethyl octyne carbonate",
				"2-Nonynoic acid, ethyl ester",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "violet leaf", "cucumber", "fruit", "wax"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_137.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Esters of 2-Nonynoic acid (except Methyl octine carbonate) should not be used as a fragrance ingredient.",
								"For Methyl octine carbonate (CAS Number 111-80-8), please refer to the IFRA Restricted Standard Methyl octine carbonate.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName:
				"Esters of 2-Octynoic acid (except Methyl heptine carbonate)",
			cas: ["10484-32-9", "10519-20-7"],
			otherNames: [
				"Amyl heptine carbonate",
				"2-Octynoic acid, pentyl ester",
				"Pentyl 2-octynoic acid",
				"Vert de violette",
				"Ethyl heptine carbonate",
				"Ethyl 2-octynoate",
				"2-Octynoic acid, ethyl ester",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "violet leaf", "cucumber", "fruit", "wax"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_138.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Esters of 2-Octynoic acid (except Methyl heptine carbonate) should not be used as a fragrance ingredient.",
								"For Methyl heptine carbonate (CAS number 111-12-6), please refer to the IFRA Restricted Standard Methyl heptine carbonate.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Ethyl acrylate",
			cas: ["140-88-5"],
			otherNames: ["Ethyl propenoate", "2-Propenoic acid, ethyl ester"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sharp", "harsh", "fruity", "sweet", "garlic", "chemical"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_139.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Ethyl acrylate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Ethylene glycol monoethyl ether and its acetate",
			cas: ["110-80-5", "111-15-9"],
			otherNames: [
				"Ethylene glycol ethyl ether",
				"2-Ethoxyethanol",
				"Ethanol, 2-ethoxy-",
				"Cellosolve",
				"Oxitol",
				"Ethylene glycol ethyl ether acetate",
				"2-Ethoxyethyl acetate",
				"Ethyl cellosolve acetate",
				"Ethanol, 2-ethoxy-, acetate",
				"1-Acetoxy-2-ethoxyethane",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "mild", "ether-like", "pleasant", "fruity"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_140.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Ethylene glycol monoethyl ether and its acetate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Ethylene glycol monomethyl ether and its acetate",
			cas: ["109-86-4", "110-49-6"],
			otherNames: [
				"Ethylene glycol methyl ether",
				"2-Methoxyethanol",
				"Ethanol, 2-methoxy-",
				"Methyl cellosolve",
				"Ethylene glycol methyl ether acetate",
				"2-Methoxyethanol acetate",
				"2-Methoxyethyl acetate",
				"Methyl cellosolve acetate",
				"Ethanol, 2-methoxy-, acetate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "mild", "ether-like", "sharp"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_141.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Ethylene glycol monomethyl ether and its acetate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Fig leaf absolute",
			cas: ["68916-52-9", "90028-74-3"],
			otherNames: ["Ficus carica absolute", "Fig leaf absolute (Ficus carica)"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"moss",
							"wood",
							"earth",
							"vegetal",
							"sweet",
							"coconut",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_142.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Fig leaf absolute should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Furfuryl alcohol",
			cas: ["98-00-0"],
			otherNames: [
				"2-Furancarbinol",
				"2-Furanmethanol",
				"Furfuralcohol",
				"α-Furylcarbinol",
				"2-Furylcarbinol",
				"2-Furylmethanol",
				"2-Hydroxymethylfuran",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"burnt",
							"bread",
							"caramel",
							"sweet",
							"coffee",
							"roasted",
							"cooked",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_143.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Furfuryl alcohol should not be used as a fragrance ingredient.",
								"The natural extracts containing Furfuryl alcohol should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Furfurylidene acetone",
			cas: ["623-15-4"],
			otherNames: [
				"3-Buten-2-one, 4-(2-furanyl)-",
				"Furfuralacetone",
				"4-(2-Furyl)-3-buten-2-one",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"caramel",
							"spicy",
							"cinnamon",
							"balsamic",
							"roasted",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_144.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Furfurylidene acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Geranyl nitrile",
			cas: ["5146-66-7", "5585-39-7", "31983-27-4"],
			otherNames: [
				"(2E)-3,7-dimethylocta-2,6-dienenitrile",
				"3,7-Dimethyl-2,6-octadienenitrile",
				"Geranonitrile (isomer unspecified)",
				"2,6-Octadienenitrile, 3,7-dimethyl-",
				"Citranile",
				"Citralva",
				"Geranitrile",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"citrus",
							"lemon",
							"sharp",
							"fresh",
							"metallic",
							"green",
							"fruity",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_145.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Geranyl nitrile should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "trans-2-Heptenal",
			cas: ["18829-55-5"],
			otherNames: [
				"beta-Butylacrolein",
				"3-Butylacrolein",
				"(E)-2-Hepten-1-al",
				"2-Heptenal, (E)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "fat", "fruit", "apple", "oil", "herbal"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_146.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"trans-2-Heptenal should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,4-Hexadien-1-ol",
			cas: ["111-28-4", "17102-64-6"],
			otherNames: [
				"1-Hydroxy-2,4-hexadiene",
				"Hexa-2,4-dien-1-ol",
				"Sorbic alcohol",
				"Sorbyl alcohol",
				"Hexadienol",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "pineapple", "herb", "sweet", "almond", "nut"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_147.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2,4-Hexadien-1-ol should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Hexahydrocoumarin",
			cas: ["700-82-3"],
			otherNames: [
				"2H-1-Benzopyran-2-one, 3,4,5,6,7,8-hexahydro-",
				"Coumarin, hexahydro-",
				"Coumarin, 3,4,5,6,7,8-hexahydro-",
				"1-Cyclohexene-1-propanoic acid, 2-hydroxy-, d-lactone",
				"3,4,5,6,7,8-Hexahydro-2H-1-benzopyran-2-one",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["coconut", "tonka", "coumarin"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_148.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Hexahydrocoumarin should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "trans-2-Hexenal diethyl acetal",
			cas: ["67746-30-9"],
			otherNames: [
				"1,1-Diethoxy-trans-2-hexene",
				"(E)-2-Hexenal diethyl acetal",
				"2-Hexene, 1,1-diethoxy-, (2E)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"pepper",
							"spicy",
							"fruit",
							"apple",
							"pear",
							"wine",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_149.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"trans-2-Hexenal diethyl acetal should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "trans-2-Hexenal dimethyl acetal",
			cas: ["18318-83-7"],
			otherNames: [
				"1,1-Dimethoxy-trans-2-hexene",
				"2-Hexene, 1,1-dimethoxy-, (2E)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fruity", "apple"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_150.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"trans-2-Hexenal dimethyl acetal should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Hydroabietyl alcohol, Dihydroabietyl alcohol",
			cas: ["13393-93-6", "26266-77-3", "1333-89-7"],
			otherNames: ["Abitol (mixture of different hydroabietyl alcohols)"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["balsamic", "pine", "wood", "resinous"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_151.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Hydroabietyl alcohol, Dihydroabietyl alcohol should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Hydroquinone monoethyl ether",
			cas: ["622-62-8"],
			otherNames: [
				"1-Ethoxy-4-hydroxybenzene",
				"p-Ethoxyphenol",
				"Phenol, 4-ethoxy-",
				"4-Ethoxyphenol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"floral",
							"anise",
							"smoky",
							"phenolic",
							"medicinal",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_152.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Hydroquinone monoethyl ether should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Hydroquinone monomethyl ether",
			cas: ["150-76-5"],
			otherNames: [
				"4-Hydroxyanisole",
				"p-Hydroxyanisole",
				"4-Methoxyphenol",
				"p-Methoxyphenol",
				"Phenol, p-methoxy-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "phenolic", "medicinal", "smoky", "anise"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_153.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Hydroquinone monomethyl ether should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Isophorone",
			cas: ["78-59-1"],
			otherNames: [
				"2-Cyclohexen-1-one, 3,5,5-trimethyl-",
				"Isoacetophorone",
				"3,5,5-Trimethyl-2-cyclohexen-1-one",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"camphoreous",
							"minty",
							"musty",
							"chemical",
							"sharp",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_154.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.0013,
							},
						},
						{
							status: "prohibition",
							notes: [
								"Isophorone as such should not be used as fragrance ingredient.",
								"Natural extracts containing Isophorone should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "6-Isopropyl-2-decalol",
			cas: ["34131-99-2"],
			otherNames: [
				"Decahydro-6-isopropyl-2-naphthol",
				"Decahydro-6-(1-methylethyl)-2-naphthalenol",
				"6-Isopropyl-2-decahydronaphthalenol",
				"6-Isopropyldecalol",
				"2-Naphthalenol, decahydro-6-(1-methylethyl)-",
				"Decatol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "earth", "moss", "warm"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_155.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"6-Isopropyl-2-decalol should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Massoia bark oil",
			cas: ["85085-26-3"],
			otherNames: [
				"Cryptocarya massoio oil",
				"Cryptocarya massoy bark extract",
				"Cryptocarya massoy, ext.",
				"Massoia bark oil (Cryptocarya massoio)",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"creamy",
							"milk",
							"coconut",
							"sweet",
							"lactonic",
							"buttery",
							"wood",
							"vanilla",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_156.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Massoia bark oil should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Massoia lactone",
			cas: ["54814-64-1", "51154-96-2"],
			otherNames: [
				"2-Decen-1,5-lactone",
				"(-)-2-Decenoic acid, 5-hydroxy, δ-lactone",
				"(R)-5,6-Dihydro-6-pentyl-2H-pyran-2-one",
				"5,6-Dihydro-6-pentyl-2H-pyran-2-one",
				"5-Hydroxy-2-decenoic acid δ-lactone",
				"2H-Pyran-2-one, 5,6-dihydro-6-pentyl-, (R)-",
				"Massoi lactone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"creamy",
							"milk",
							"coconut",
							"lactonic",
							"buttery",
							"sweet",
							"fruity",
							"peach",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_157.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Massoia lactone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "7-Methoxycoumarin",
			cas: ["531-59-9"],
			otherNames: ["2H-1-Benzopyran-2-one, 7-methoxy-", "Herniarin"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["balsamic", "tonka", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_158.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
						{
							status: "prohibition",
							notes: [
								"7-Methoxycoumarin as such should not be used as fragrance ingredient.",
								"The natural extracts containing 7-Methoxycoumarin should not be used as substitutes for this substance.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "α-Methyl anisylidene acetone",
			cas: ["104-27-8"],
			otherNames: [
				"1-(p-Methoxyphenyl)-1-penten-3-one",
				"p-Methoxystyryl ethyl ketone",
				"alpha-Methylanisalacetone",
				"α-Methylanisalacetone",
				"1-(4-Methoxyphenyl)-1-penten-3-one",
				"1-Penten-3-one, 1-(4-(methoxyphenyl))-",
				"Ethone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"powder",
							"ketone",
							"sweet",
							"anise",
							"floral",
							"hawthorn",
							"butter",
							"cream",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_159.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"α-Methyl anisylidene acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "6-Methylcoumarin",
			cas: ["92-48-8"],
			otherNames: [
				"2H-1-Benzopyran-2-one, 6-methyl",
				"6-Methyl-2h-1-benzopyran-2-one",
				"6-Methylbenzopyrone",
				"6-Methyl coumarin",
				"6-Methyl-cis-o-coumarinic lactone",
				"5-Methyl-2-hydroxyphenylpropenoic acid lactone",
				"Toncarine",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "vanilla-like", "herbaceous", "spicy", "tonka"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_160.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"6-Methylcoumarin should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "7-Methylcoumarin",
			cas: ["2445-83-2"],
			otherNames: [
				"2H-1-Benzopyran-2-one, 7-methyl",
				"7-Methyl-2-H-1-benzopyran-2-one",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "herb", "tonka", "coumarin"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_161.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"7-Methylcoumarin should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl crotonate",
			cas: ["623-43-8"],
			otherNames: [
				"2-Butenoic acid, methyl ester, (E)-",
				"Methyl trans-2-butenoate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sharp", "fruit", "green", "sweet", "wine", "apple"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_162.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Methyl crotonate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "4-Methyl-7-ethoxycoumarin",
			cas: ["87-05-8"],
			otherNames: [
				"2H-1-Benzopyran-2-one, 7-ethoxy-4-methyl",
				"Coumarin, 7-ethoxy-4-methyl",
				"7-Ethoxy-4-methylcoumarin",
				"4-Methyl-7-ethoxybenzopyrone",
				"Maraniol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"coconut",
							"tonka",
							"coumarin",
							"hay",
							"caramel",
							"anise",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_163.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"4-Methyl-7-ethoxycoumarin should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Methylhydrocinnamic aldehyde",
			cas: ["5406-12-2"],
			otherNames: [
				"Benzenepropanal, 4-methyl",
				"p-Methyldihydrocinnamaldehyde",
				"p-Methylhydrocinnamaldehyde",
				"3-(4-Methylphenyl)propanal",
				"3-p-Tolylpropionaldehyde",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "green", "mild", "aldehydic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_164.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"p-Methylhydrocinnamic aldehyde should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl methacrylate",
			cas: ["80-62-6"],
			otherNames: [
				"Methyl 2-methacrylate",
				"2-(methoxycarbonyl)-1-propene",
				"Methyl 2-methyl-2-propenoate",
				"2-Propenoic acid, 2-methyl-, methyl ester",
				"MMA",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sharp", "fruity", "acrylic", "chemical", "harsh"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_165.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Methyl methacrylate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Methyl-2(3)-nonenenitrile",
			cas: ["53153-66-5"],
			otherNames: ["2-Nonenenitrile, 3-methyl", "Citgrenile"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["citrus", "lemon", "green", "metallic", "sharp"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_166.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"3-Methyl-2(3)-nonenenitrile should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk moskene",
			cas: ["116-66-5"],
			otherNames: [
				"1,1,3,3,5-Pentamethyl-4,6-dinitroindane",
				"1H-Indene, 2,3-dihydro-1,1,3,3,5-pentamethyl-4,6,-dinitro",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "sweet", "powdery", "animalic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_167.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Musk moskene should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk ambrette",
			cas: ["83-66-9"],
			otherNames: [
				"Benzene, 1-(1,1-dimethylethyl)-2-methoxy-4-methyl-3,5-dinitro",
				"1-tert-Butyl-2-methoxy-4-methyl-3,5-dinitrobenzene",
				"4-tert-Butyl-3-methoxy-2,6-dinitrotoluene",
				"6-tert-Butyl-3-methyl-2,4-dinitroanisole",
				"1-(1,1-Dimethylethyl)-2-methoxy-4-methyl-3,5-dinitrobenzene",
				"2,6-Dinitro-3-methoxy-1-methyl-4-tert-butylbenzene",
				"2,6-Dinitro-3-methoxy-4-tert-butyltoluene",
				"2,4-Dinitro-3-methyl-6-tert-butylanisole",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"musk",
							"sweet",
							"floral",
							"ambrette",
							"powdery",
							"animalic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_168.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Musk ambrette should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk tibetene",
			cas: ["145-39-1"],
			otherNames: [
				"1-tert-Butyl-2,6-dinitro-3,4,5-trimethylbenzene",
				"Benzene, 1-(1,1-dimethylethyl)-3,4,5-trimethyl-2,6-dinitro",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "sweet", "powdery", "animalic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_169.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Musk tibetene should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk xylene",
			cas: ["81-15-2"],
			otherNames: [
				"2,4,6-Trinitro-1,3-methyl-5-tert-butylbenzene",
				"1-tert-Butyl-3,5-dimethyl-2,4,6-trinitrobenzene",
				"Benzene, 1-(1,1-dimethylethyl)-3,5-dimethyl-2,4,6-trinitro",
				"Musk xylol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["musk", "sweet", "powder", "animalic", "fat", "tenacious"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_170.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Musk xylene should not be used as a fragrance ingredient.",
								"Musk xylene can be present in Musk ketone as an impurity. Please refer to the IFRA Specification Standard on Musk ketone.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Nitrobenzene",
			cas: ["98-95-3"],
			otherNames: ["Benzene, nitro", "Nitrobenzol", "Mirbane oil"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["almond", "bitter", "sharp", "chemical"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_171.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Nitrobenzene should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Pentylidene cyclohexanone",
			cas: ["25677-40-1"],
			otherNames: ["Cyclohexanone, 2-pentylidene"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fruity", "green", "herbal", "nut"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_172.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"2-Pentylidene cyclohexanone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Phenyl acetone",
			cas: ["103-79-7"],
			otherNames: [
				"Benzyl methyl ketone",
				"Methyl benzyl ketone",
				"2-Propanone, 1-phenyl",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "floral", "fruity", "honey", "spicy"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_174.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Phenyl acetone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Phenyl benzoate",
			cas: ["93-99-2"],
			otherNames: ["Benzoic acid, phenyl ester"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["phenolic", "coal", "tar"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_175.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Phenyl benzoate should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Pseudoionone",
			cas: ["141-10-6"],
			otherNames: [
				"Citrylideneacetone",
				"2,6-Dimethylundeca-2,6,8-trien-10-one",
				"6,10-Dimethyl-3,5,9-undecatrien-2-one",
				"3,5,9-Undecatrien-2-one, 6,10-dimethyl",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"balsam",
							"sweet",
							"wax",
							"citrus",
							"floral",
							"dry",
							"dust",
							"powder",
							"spicy",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_176.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Pseudoionone should not be used as a fragrance ingredient.",
							],
						},
						{
							status: "specification",
							notes: [
								"Pseudoionone should not be used as fragrance ingredient as such, but a level of up to 2% as an impurity in Ionones is accepted.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Pseudo methylionones",
			cas: ["26651-96-7", "72968-25-3", "1117-41-5"],
			otherNames: [
				"2,6-Dimethyldodeca-2,6,8-trien-10-one",
				"7,11-Dimethyl-4,6,10-dodecatrien-3-one",
				"7,11-Dimethyldodeca-4,6,10-trien-3-one",
				"4,6,10-Dodecatrien-3-one, 7,11-dimethyl",
				"3,6,10-Trimethylundeca-3,5,9-trien-2-one",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["powerful", "oil", "wood", "floral"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_177.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Pseudo methylionones should not be used as a fragrance ingredient.",
							],
						},
						{
							status: "specification",
							notes: [
								"Pseudo methylionones should not be used as fragrance ingredient as such, but a level of up to 2% as an impurity in Methylionones is accepted.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Quinoline",
			cas: ["91-22-5"],
			otherNames: [
				"1-Benzazine",
				"2,3-Benzopyridine",
				"Benzo(b)pyridine",
				"Chinoleine",
				"Leucoline",
				"Quinoleine",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"leather",
							"animalic",
							"smoky",
							"medicinal",
							"chemical",
							"harsh",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_178.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Quinoline should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Safrole, Isosafrole and Dihydrosafrole",
			cas: ["94-59-7", "120-58-1", "94-58-6"],
			otherNames: [
				"1,3-Benzodioxole, 5-(2-propenyl)-",
				"3,4-Methylene dioxyallylbenzene",
				"4-Allyl-1,2-methylene dioxybenzene",
				"5-Allyl-1,3-benzodioxole",
				"Safrol",
				"1,2-Methylenedioxy-4-propenylbenzene",
				"1,3-Benzodioxole, 5-(1-propenyl)-",
				"5-Prop-1-en-1-yl-1,3-benzodioxole",
				"Iso-safrole",
				"1,3-Benzodioxole, 5-propyl",
				"3,4-Methylenedioxypropylbenzene",
				"5-Propyl-1,3-benzodioxole",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "spicy", "root beer", "anise", "sassafras"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_179.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.01,
							},
						},
						{
							status: "prohibition",
							notes: [
								"Safrole, Isosafrole and/or Dihydrosafrole as such should not be used as fragrance ingredients.",
								"The natural extracts containing Safrole, Isosafrole and/or Dihydrosafrole should not be used as substitutes for these ingredients.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Santolina oil",
			cas: ["84961-58-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["herbal", "floral", "balsamic", "sweet"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_180.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Santolina oil should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Savin oil",
			cas: ["8024-00-8", "90046-04-1", "68916-94-9", "90046-03-0"],
			otherNames: ["Juniperus sabina L.", "Juniperus phoenicea L."],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"herbal",
							"wood",
							"pine",
							"camphoreous",
							"sharp",
							"balsamic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_181.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Savin oil should not be used as a fragrance ingredient.",
								"Savin oil prepared from Juniperus sabina L. should not be used as a fragrance ingredient.",
								"Only oils obtained from Juniperus phoenicea L. should be used, under the conditions set in the fragrance ingredient specification mentioned below.",
							],
						},
						{
							status: "specification",
							notes: [
								"In the absence of an international standard, the following specificiations for oils of Juniperus phoenicea L. are proposed:",
								"Density d 20/20 0,864 - 0,873",
								"Refraction n 20 D 1,4700 - 1,4720",
								"Rotation alpha 20 D -1° - +4°",
								"Acid value 0,4 - 1",
								"Ester value 2,5 - 7",
								"Ester value after acetylation 10 - 23",
								"Solubility 0.5-6 vol. in alcohol 96%, beyond that opalescence on dilution.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Toluene",
			cas: ["108-88-3"],
			otherNames: ["Toluol", "Methylbenzol", "Methylbenzene"],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "gasoline", "paint-fumes"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_182.pdf",
					rules: [
						{
							status: "prohibition",
							notes: ["Toluene should not be used as a fragrance ingredient."],
						},
						{
							status: "specification",
							notes: [
								"The level of Toluene has to be kept as low as practicable and should never exceed 100 ppm in the fragrance compound/mixture or fragrance oil.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Sclareol",
			cas: ["515-03-7"],
			otherNames: [
				"Labd-14-ene-8,13-diol",
				"1-Naphthalenepropanol, decahydro-alpha-ethenyl-2-hydroxy-alpha,2,5,5,8a-pentamethyl-, (1R-(1-alpha(R*),2-beta,4a-beta,8a-alpha))-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "sweet", "amber", "balsam", "sandalwood", "dry"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_183.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Sclareol used as a fragrance ingredient should have a minimum purity of 98%.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Pinacea derivatives",
			otherNames: ["Derivatives from the Pine Family", "Pinacea", "Pine"],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["pine", "wood", "resin", "balsam", "fresh"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_184.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Essential oils (e.g. Turpentine oil) and isolates (e.g. delta-3-Carene) derived from the Pinacea family, including Pinus and Abies genera, should only be used when the level of peroxides is kept to the lowest practicable level, for instance by adding antioxidants at the time of production. Such products should have a peroxide value of less than 10 millimoles peroxide per liter, determined according to the IFRA analytical methodology for the determination of the peroxide value, which can be downloaded from the IFRA website (www.ifrafragrance.org).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Nootkatone",
			cas: ["4674-50-4"],
			otherNames: [
				"5,6-Dimethyl-8-isopropenylbicyclo(4.4.0)dec-1-en-3-one",
				"4a,5-Dimethyl-1,2,3,4,4a,5,6,7-octahydro-7-keto-3-isopropenylnaphthalene",
				"4betaH,5alpha-Eremorphila-1(10),11-dien-2-one",
				"(4R-(4alpha,4a alpha,6beta))-4,4a,5,6,7,8-Hexahydro-4,4a-dimethyl-6-(1-methylvinyl)naphthalen-2(3H)-one",
				"4,4a,5,6,7,8-Hexahydro-6-isopropenyl-4,4a-dimethyl-2(3H)-naphthalenone",
				"2(3H)-Naphthalenone, 4,4a,5,6,7,8-hexahydro-4,4a-dimethyl-6-(1-methylethenyl)-, (4R,4aS,6R)-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/nootkatone-crystals/",
						nameUsed: "Nootkatone Crystals",
						notes: ["citrus", "powerful", "grapefruit", "wood"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_185.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Nootkatone used as a fragrance ingredient should be at least 98% pure, with a melting point of at least 32°C. Lower purity grades may not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Limonene",
			cas: ["138-86-3", "7705-14-8", "5989-27-5", "5989-54-8"],
			otherNames: [
				"p-Mentha-1,8-diene",
				"1-methyl-4-prop-1-en-2-ylcyclohexene",
				"1-Methyl-4-(1-methylethenyl)cyclohexene",
				"1-Methyl-4-isopropenyl-1-cyclohexene",
				"4-Isopropenyl-1-methylcyclohexene",
				"Cyclohexene, 1-methyl-4-(1-methylethenyl)-",
				"Dipentene",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC-reduziert-Einzelseiten/SYM_F-Limonene-D.pdf",
						nameUsed: "Limonene D",
						notes: [
							"citrus",
							"orange",
							"terpene",
							"fruit",
							"sweet",
							"mandarin",
							"mint",
							"yellow fruits",
							"spice",
							"herb",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_186.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Oxidation products of Limonene, especially hydroperoxides, have been demonstrated to be potent sensitizers.",
								"d-, l- and dl-Limonene and natural products containing substantial amounts of it, should only be used when the level of (hydro)peroxides is kept to the lowest practical level, for instance by adding antioxidants at the time of production. The addition of 0.1% BHT or α-Tocopherol for example has shown great efficiency. Such products should have a peroxide value of less than 20 millimoles per liter, determined according to the IFRA analytical method for the determination of the peroxide value, which can be downloaded from the IFRA website (www.ifrafragrance.org).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Linalool",
			cas: ["78-70-6", "126-90-9", "126-91-0"],
			otherNames: [
				"1,6-Octadien-3-ol, 3,7-dimethyl",
				"2,6-Dimethyl-2,7-octadien-6-ol",
				"2,7-Octadien-6-ol, 2,6-dimethyl",
				"3,7-Dimethyl-1,6-octadien-3-ol",
				"3,7-Dimethylocta-1,6-dien-3-ol",
				"Coriandrol",
				"Licareol",
				"Linalyl alcohol",
				"(S)-3,7-Dimethyl-1,6-octadien-3-ol",
				"1,6-Octadien-3-ol, 3,7-dimethyl-, (S)-",
				"(R)-3,7-Dimethyl-1,6-octadien-3-ol",
				"1,6-Octadien-3-ol, 3,7-dimethyl-, (R)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://www.dsm-firmenich.com/es-mx/businesses/perfumery-beauty/beauty-care/products/linalool.html",
						nameUsed: "Linalool",
						notes: ["floral", "lavender", "sweet", "intense"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_187.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Oxidation products of Linalool, especially hydroperoxides, have been demonstrated to be potent sensitizers.",
								"d-, l- and dl-Linalool and natural products containing substantial amounts of it, should only be used when the level of (hydro)peroxides is kept to the lowest practical level, for instance by adding antioxidants at the time of production. The addition of 0.1% BHT or α-Tocopherol for example has shown great efficiency. Such products should have a peroxide value of less than 20 millimoles per liter, determined according to the IFRA analytical method for the determination of the peroxide value, which can be downloaded from the IFRA website (www.ifrafragrance.org).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Allyl esters",
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "leaf", "strong"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_188.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Allyl esters should only be used when the level of free Allylalcohol in the ester is less than 0.1%. This recommendation is based on the delayed irritant potential of Allylalcohol.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Musk ketone",
			cas: ["81-14-1"],
			otherNames: [
				"1-(4-tert-Butyl-2,6-dimethyl-3,5-dinitrophenyl) ethanone",
				"4'-tert-butyl-2',6'-dimethyl-3',5'-dinitroacetophenone",
				"3,5-Dinitro-2,6-dimethyl-4-tert-butylacetophenone",
				"1-[4-(1,1-Dimethylethyl)-2,6-dimethyl-3,5-dinitrophenyl]ethanone",
				"Ethanone, 1-[4-(1,1-dimethylethyl)-2,6-dimethyl-3,5-dinitrophenyl]-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fat", "musk", "soap", "dry", "floral", "powder"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_189.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"Musk xylene (CAS number 81-15-2), which has been prohibited for use in fragrance compounds for environmental reasons (vPvB), can be present in Musk ketone as an impurity.",
								"Musk ketone should only be used if it contains less than 0.1% of Musk xylene.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Propenylguaethol",
			cas: ["94-86-0", "63477-41-8"],
			otherNames: [
				"1-Ethoxy-2-hydroxy-4-propenylbenzene",
				"2-Ethoxy-5-prop-1-en-1-ylphenol",
				"2-Ethoxy-5-propenylphenol",
				"3-Propenyl-6-ethoxyphenol",
				"6-Ethoxy-m-anol",
				"Phenol, 2-ethoxy-5-(1-propenyl)-",
				"Vanitrope",
				"Isosafroeugenol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"vanilla",
							"wood",
							"tobacco",
							"spicy",
							"phenolic",
							"powder",
							"anise",
							"cream",
							"floral",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_190.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.99,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Methoxy-4-propylphenol",
			cas: ["2785-87-7"],
			otherNames: [
				"Phenol, 2-methoxy-4-propyl",
				"4-Propyl-ortho-methoxyphenol",
				"4-Propylguaicol",
				"5-Propyl-ortho-hydroxyanisole",
				"Dihydroeugenol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"clove",
							"sharp",
							"spicy",
							"sweet",
							"phenolic",
							"powdery",
							"allspice",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_191.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.73,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Bisabolol",
			cas: [
				"515-69-5",
				"23089-26-1",
				"23178-88-3",
				"78148-59-1",
				"76738-75-5",
				"72691-24-8",
			],
			otherNames: [
				"(R*,R*)-α,4-Dimethyl-α-(4-methyl-3-pentenyl)cyclohex-3-ene-1-methanol",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-pentenyl)-, (R*,R*)-",
				"6-Methyl-2-(4-methyl-3-cyclohexen-1-yl)-5-hepten-2-ol",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-penten-1-yl)-",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-penten-1-yl)-, (αS,1S)-",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-penten-1-yl)-, (αR,1R)-",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-penten-1-yl)-, (αR,1S)-",
				"3-Cyclohexene-1-methanol, α,4-dimethyl-α-(4-methyl-3-penten-1-yl)-, (αS,1R)-",
				"Bisabolol",
				"Bisabolol nat. roh (Candela-Öl)",
				"Dragosantol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "peppery", "balsamic", "clean"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_192.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Tolyl alcohol",
			cas: ["589-18-4"],
			otherNames: [
				"(4-Methylphenyl)methanol",
				"Benzenemethanol, 4-methyl",
				"p-Methylbenzyl alcohol",
				"p-Tolualcohol",
				"4-(Hydroxymethyl)toluene",
				"4-Methylbenzyl alcohol",
				"4-Tolylcarbinol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["mild", "floral"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_193.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Isopropylbenzyl alcohol",
			cas: ["536-60-7"],
			otherNames: [
				"(4-Isopropylphenyl)methanol",
				"Benzenemethanol, 4-(1-methylethyl)-",
				"p-iso-Propylbenzyl alcohol",
				"p-Cymen-7-ol",
				"Cumin alcohol",
				"Cuminic alcohol",
				"Cuminol",
				"Cuminyl alcohol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/cuminyl-alcohol/",
						nameUsed: "Cuminyl Alcohol",
						notes: ["spicy", "warm", "herbal", "caraway"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_194.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2,6,10-Trimethylundeca-5,9-dien-1-ol",
			cas: [
				"24048-14-4",
				"185019-19-6",
				"58001-88-0",
				"58001-87-9",
				"1373932-23-0",
				"1018832-07-9",
			],
			otherNames: [
				"2,6,10-Trimethylundeca-5,9-dienol",
				"5,9-Undecadien-1-ol, 2,6,10-trimethyl",
				"Dihydroapofarnesol",
				"Profarnesol",
				"(E)-2,6,10-Trimethylundeca-5,9-dien-1-ol",
				"(Z)-2,6,10-Trimethylundeca-5,9-dien-1-ol",
				"(2R,5E)-2,6,10-Trimethylundeca-5,9-dien-1-ol",
				"(2S, 5E)-2,6,10-Trimethylundeca-5,9-dien-1-ol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wax", "aldehyde"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_195.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cedrene",
			cas: ["11028-42-5", "469-61-4", "546-28-1"],
			otherNames: [
				"Cedr-8-ene",
				"α-Cedrene",
				"1H-3a,7-Methanoazulene, 2,3,4,7,8,8a-hexahydro-3,6,8,8-tetramethyl-, (3R-(3-α,3a-β,8a-α)]",
				"β-Cedrene",
				"1H-3a,7-Methanoazulene, octahydro-3,8,8-trimethyl-6-methylene-, [3R-(3alpha,3abeta,7beta,8aalpha)]-",
				"Cedr-8(15)-ene",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "cedar", "dry", "amber", "balsam"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_197.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4-Phenyl-3-buten-2-ol",
			cas: ["17488-65-2"],
			otherNames: [
				"3-Buten-2-ol, 4-phenyl",
				"4-Phenylbut-3-en-2-ol",
				"Methyl styryl carbinol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "fruity", "floral", "balsamic"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_198.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Longifolene",
			cas: ["475-20-7", "16846-09-6", "19067-29-9"],
			otherNames: [
				"4,8,8-Trimethyl-9-methylenedecahydro-1,4-methanoazulene",
				"1,4-Methanoazulene, decahydro-4,8,8-trimethyl-9-methylene-)",
				"1,4-Methanoazulene, decahydro-4,8,8-trimethyl-9-methylene-, [1S-(1α,3αβ,4α,8aβ)]-",
				"1,4-Methanoazulene, decahydro-4,8,8-trimethyl-9-methylene-, (1R,3αS,4R,8αR)-",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "sweet", "pine", "resin"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_199.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4-Hydroxy-2,5-dimethyl-3(2H)-furanone",
			cas: ["3658-77-3"],
			otherNames: [
				"3(2H)-Furanone, 4-hydroxy-2,5-dimethyl",
				"2,5-Dimethyl-4-hydroxy-2,3-dihydrofuran-3-one",
				"4-Hydroxy-2,5-dimethylfuran-3(2H)-one",
				"Dimethylhydroxy furanone",
				"Strawberry furanone",
				"Furaneol",
				"Neofuraneol",
				"Pineapple compound",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/furaneolr-pe-943881",
						nameUsed: "Furaneol",
						notes: [
							"gourmand",
							"caramel",
							"fruit",
							"cotton candy",
							"intense",
							"strawberry",
							"pineapple",
							"exotic fruits",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_201.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Farnesal",
			cas: ["19317-11-4"],
			otherNames: [
				"2,6,10-Dodecatrienal, 3,7,11-trimethyl",
				"3,7,11-Trimethyl dodecatrien-2,6,10-al-1",
				"3,7,11-Trimethyl-2,6,10-dodecatrienal",
				"3,7,11-Trimethyldodeca-2,6,10-trienal",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "sweet", "green", "muguet", "citrus"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_202.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3,7-Dimethyl-2,6-nonadien-1-al",
			cas: ["41448-29-7"],
			otherNames: [
				"2,6-Nonadien-1-al, 3,7-dimethyl",
				"3,7-Dimethylnona-2,6-dienal",
				"Ethyl citral",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["citrus", "lemon", "sweet", "fresh", "fruity"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_203.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "5,9-Dimethyl-4,8-decadienal",
			cas: ["762-26-5"],
			otherNames: [
				"4,8-Decadienal, 5,9-dimethyl",
				"5,9-Dimethyldeca-4,8-dienal",
				"Geraldehyde",
				"Geranyl Acetaldehyde",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"citrus",
							"aldehydic",
							"marine",
							"floral",
							"ozone",
							"fresh",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_204.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3,7-Dimethyl-3,6-octadienal",
			cas: ["55722-59-3", "1754-00-3", "72203-98-6", "72203-97-5"],
			otherNames: [
				"3,6-Octadienal, 3,7-dimethyl",
				"3,7-Dimethylocta-3,6-dienal",
				"(E)-3,7-Dimethyl-3,6-octadienal",
				"(Z)-3,7-Dimethyl-3,6-octadienal",
				"Isocitral",
				"Isogeranial",
				"Isoneral",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["citrus", "lemon", "fresh", "green", "herbal"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_205.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Citronellal",
			cas: ["106-23-0", "5949-05-3"],
			otherNames: [
				"2,3-Dihydrocitral",
				"3,7-Dimethyl-6-octenal",
				"3,7-Dimethyloct-6-enal",
				"6-Octenal, 3,7-dimethyl",
				"Citronellal Extra",
				"Rhodinal",
				"6-Octenal, 3,7-dimethyl-, (3S)-",
				"l-Citronellal",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"dry",
							"floral",
							"herbal",
							"wax",
							"aldehyde",
							"citrus",
							"rose",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_206.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.49,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4,8-Dimethyl-4,9-decadienal",
			cas: ["71077-31-1"],
			otherNames: [
				"4,9-Decadienal, 4,8-dimethyl",
				"Aldehyde DMD",
				"Floral Super",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/floral-super/",
						nameUsed: "Floral Super",
						notes: ["fresh", "cyclamen", "floral", "intense"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_207.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.24,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "cis,trans-4-(Isopropyl)cyclohexanemethanol",
			cas: ["5502-75-0", "13828-37-0", "13674-19-6"],
			otherNames: [
				"(4-propan-2-ylcyclohexyl)methanol",
				"4-(1-methylethyl)-cyclohexanemethanol",
				"4-Isopropylcyclohexylmethanol",
				"(4-Isopropylcyclohexyl)methanol",
				"Reaction mass of trans-4-(isopropyl)cyclohexanemethanol and cis-4-(isopropyl)cyclohexanemethanol",
				"cis-4-(Isopropyl)cyclohexanemethanol",
				"trans-4-(Isopropyl)cyclohexanemethanol",
				"Cyclohexanemethanol, 4-(1-methylethyl)-, cis",
				"Cyclohexanemethanol, 4-(1-methylethyl)-, trans",
				"p-Menthan-7-ol",
				"cis-p-Menthan-7-ol",
				"trans-p-Menthan-7-ol",
				"Mayol",
				"Meijiff",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/mayolr-pe-957230",
						nameUsed: "Mayol®",
						notes: [
							"muguet",
							"water",
							"fresh",
							"soft",
							"clean",
							"floral",
							"white petals",
							"muguet blossom",
							"magnolia blossom",
							"tuberose blossom",
							"cyclamen blossom",
							"slightly spicy",
							"aldehydic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_208.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4.7,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4-(Isopropyl)-.beta.-methylcyclohexanethanol",
			cas: ["67634-03-1"],
			otherNames: [
				"2-(4-Isopropylcyclohexyl)propan-1-ol",
				"Cyclohexaneethanol, .β.-methyl-4-(1-methylethyl)-",
				"Rodipol C",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["light", "floral", "muguet", "fresh"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_209.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 6.4,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclohexanemethanol, 2,4-dimethyl-",
			cas: ["68480-15-9"],
			otherNames: [
				"(2,4-Dimethylcyclohexyl)methanol",
				"2,4-Dimethylcyclohexanemethanol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "minty", "earthy", "leather"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_210.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.0013,
							},
						},
					],
				},
			},
		},
		{
			canonicalName:
				"3,3-Dimethyl-5-(2,2,3-trimethyl-3-cyclopenten-1-yl)-4-penten-2-ol",
			cas: ["107898-54-4"],
			otherNames: [
				"4-Penten-2-ol, 3,3-dimethyl-5-(2,2,3-trimethyl-3-cyclopenten-1-yl)-",
				"(+/-) trans-3,3-Dimethyl-5-(2,2,3-trimethyl-cyclopent-3-en-1-yl)pent-4-en-2-ol",
				"Mysantol",
				"Polysantol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/polysantolr-pe-974656",
						nameUsed: "Polysantol®",
						notes: ["botanical", "sandalwood", "cream"],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/mysantol/",
						nameUsed: "Mysantol",
						notes: ["diffusive", "sandalwood", "cream"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_211.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "5-(2,2,3-Trimethyl-3-cyclopentenyl)-3-methylpentan-2-ol",
			cas: ["65113-99-7"],
			otherNames: [
				"3-Cyclopentene-1-butanol, .α.,.β.,2,2,3-pentamethyl",
				"3-Methyl-5-(2,2,3-trimethylcyclopent-3-en-1-yl)pentan-2-ol",
				"a,b,2,2,3-Pentamethylcyclopent-3-ene-1-butanol",
				"Sandal Series G",
				"Sandalore",
				"Sandalore™",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/sandaloretm",
						nameUsed: "Sandalore™",
						notes: [
							"wood",
							"sandalwood",
							"sweet",
							"warm",
							"powerful",
							"diffusive",
							"rich",
						],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Sandalore™, a powerful, diffusive and extremely tenacious product, imparts a rich, warm, natural sandalwood character to perfumes, as well as volume and substantivity. It is an interesting sandalwood replacement in combination with Ebanol™.",
						],
					},
				},
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/dersantoltm-pe-981200",
						nameUsed: "Sandalore",
						notes: [
							"botanical",
							"sandalwood",
							"warm",
							"delicate",
							"sweet",
							"leather",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_212.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha,2,2,3-Tetramethylcyclopent-3-ene-1-butyraldehyde",
			cas: ["65114-03-6"],
			otherNames: [
				"2-Methyl-4-(2,2,3-trimethylcyclopent-3-en-1-yl)butanal",
				"3-Cyclopentene-1-butanal, α,2,2,3-tetramethyl",
				"Florenza",
				"Santafleur",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/3-cyclopentene-1-butanal-alpha223-tetramethyl-6455034",
						nameUsed: "3-Cyclopentene-1-butanal, alpha,2,2,3-tetramethyl-",
						notes: [
							"wood",
							"floral",
							"aldehydic",
							"wax",
							"sandalwood",
							"dry",
							"green",
							"fresh",
							"herbal",
							"citrus",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_213.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.21,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isobutyl N-methylanthranylate",
			cas: ["65505-24-0"],
			otherNames: [
				"Benzoic acid, 2-(methylamino)-, 2-methylpropyl ester",
				"Isobutyl 2-(methylamino)benzoate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fruity", "grape", "grapefruit"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_214.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"The material has been identified for having the potential of forming nitrosamines in nitrosating systems. Downstream users therefore have to be notified of the presence of the material and its potential, to be able to consider adequate protective measures.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Methyltetrahydroquinoline",
			cas: ["91-61-2"],
			otherNames: [
				"6-Methyl-1,2,3,4-tetrahydroquinoline",
				"Quinoline, 1,2,3,4-tetrahydro-6-methyl",
				"1,2,3,4-Tetrahydro-6-methylquinoline",
				"Tetrahydro-p-methylquinoline",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["animalic", "civet", "leather", "ambergris"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_215.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"The material has been identified for having the potential of forming nitrosamines in nitrosating systems. Downstream users therefore have to be notified of the presence of the material and its potential, to be able to consider adequate protective measures.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "1,2,3,4-Tetrahydro-4-methylquinoline",
			cas: ["19343-78-3"],
			otherNames: [
				"4-Methyl-1,2,3,4-tetrahydroquinoline",
				"Quinoline, 1,2,3,4-tetrahydro-4-methyl",
				"1,2,3,4-Tetrahydrolepidine",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["animalic", "civet", "leather", "chemical"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_216.pdf",
					rules: [
						{
							status: "specification",
							notes: [
								"The material has been identified for having the potential of forming nitrosamines in nitrosating systems. Downstream users therefore have to be notified of the presence of the material and its potential, to be able to consider adequate protective measures.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "4-(4-Hydroxyphenyl)butan-2-one",
			cas: ["5471-51-2"],
			otherNames: [
				"p-Hydroxybenzylacetone",
				"1-p-Hydroxyphenyl-3-butanone",
				"2-Butanone, 4-(4-hydroxyphenyl)-",
				"4-(p-Hydroxyphenyl)-2-butanone",
				"Raspberry ketone",
				"Corps N 112",
				"Frambinon",
				"Oxanone",
				"Oxyphenylon",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "fruity", "berry", "raspberry", "jam", "powdery"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_217.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Mintlactone",
			cas: ["13341-72-5", "38049-04-6"],
			otherNames: [
				"2(4H)-Benzofuranone, 5,6,7,7a-tetrahydro-3,6-dimethyl",
				"3,6-Dimethyl-5,6,7,7a-tetrahydro-1-benzofuran-2(4H)-one",
				"3,6-Dimethyl-5,6,7,7a-tetrahydro-2(4H)benzo-furanone",
				"5,6,7,7a-Tetrahydro-3,6-dimethyl-(4H)-benzofuran-2-one",
				"Dehydroxymenthofurolactone",
				"Menthofurolactone",
				"Mint furanone",
				"2(4H)-Benzofuranone, 5,6,7,7a-tetrahydro-3,6-dimethyl-, (6R,7aR)-",
				"(-)-Mintlactone",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"tonka",
							"sweet",
							"creamy",
							"coumarin",
							"coconut",
							"minty",
							"herbal",
							"powder",
							"tobacco",
							"spearmint",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_218.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"Mintlactone should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "Ethyl isopropyl bicycloheptene-2-carboxylate",
			cas: ["116044-44-1", "116126-82-0"],
			otherNames: [
				"(2-endo,3-exo)-Ethyl 3-(1-methylethyl)bicyclo[2.2.1]hept-5-ene-2-carboxylate",
				"(2-endo,3-exo)-Ethyl 3-isopropylbicyclo[2.2.1]hept-5-ene-2-carboxylate",
				"Bicyclo[2.2.1]hept-5-ene-2-carboxylic acid, 3-(1-methylethyl)-, ethyl ester, (2-endo,3-exo)-",
				"Ethyl (2S,3S)-3-isopropylbicyclo[2.2.1]hept-5-ene-2-carboxylate",
				"3-(1-Methyl ethyl) bicyclo(2.2.1) hept-5-ene-2-carboxylic acid ethyl ester",
				"Bicyclo[2.2.1]hept-5-ene-2-carboxylic acid, 3-(1-methylethyl)-, ethyl ester, (2-exo,3-endo)-",
				"Ethyl (2R,3R)-3-isopropylbicyclo[2.2.1]hept-5-ene-2-carboxylate",
				"Herbanate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/herbanate",
						nameUsed: "Herbanate",
						notes: [
							"fruit",
							"green",
							"tropical",
							"banana",
							"pineapple",
							"blackcurrant",
							"fresh",
							"herbal",
							"warm",
							"spicy",
						],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Herbanate has a fruity note with hints of banana, pineapple and blackcurrant. The background is fresh and herbal with a warm spicy element. Herbanate is a versatile material that provides or enhances the natural effect of fragrances, particularly in fruity notes where it gives a juicy tropical fruit effect. It can also be used as a 10% dilution to give a green herbal freshness and blends well with citrus, green and even spicy notes.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_219.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.94,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Tetramethyl bicyclo-2-heptene-2-propionaldehyde",
			cas: ["33885-52-8"],
			otherNames: [
				".alpha.,.alpha.,6,6-Tetramethyl-2-norpinene-2-propionaldehyde",
				".alpha.,.alpha.,6,6-Tetramethylbicyclo[3.1.1]hept-2-ene-2-propionaldehyde",
				".α.,.α.,6,6-Tetramethyl-2-norpinene-2-propionaldehyde",
				".α.,.α.,6,6-Tetramethylbicyclo[3.1.1]hept-2-ene-2-propionaldehyde",
				"3-(6,6-Dimethylbicyclo[3.1.1]hept-2-en-2-yl)-2,2-dimethylpropanal",
				"Bicyclo[3.1.1]hept-2-ene-2-propanal, .alpha.,.alpha.,6,6-tetramethyl",
				"Bicyclo[3.1.1]hept-2-ene-2-propanal, .α.,.α.,6,6-tetramethyl",
				"PIBA",
				"Pinyl iso butyraldehyde",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "pine", "herbal", "aldehydic", "clean"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_220.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "1-(2,2,6-Trimethylcyclohexyl)-3-hexanol",
			cas: ["70788-30-6"],
			otherNames: [
				"1-(Trimethylcyclohexyl)-hexanol",
				"2,2,6-Trimethyl-alpha-propylcyclohexanepropanol",
				"2,2,6-Trimethyl-α-propylcyclohexanepropanol",
				"Cyclohexanepropanol, 2,2,6-trimethyl-.alpha.-propyl",
				"Cyclohexanepropanol, 2,2,6-trimethyl-.α.-propyl",
				"Norlimbanol",
				"Norlimbanol Dextrol",
				"Timberol",
				"Karmawood",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Firmenich",
					data: {
						url: "https://studio.dsm-firmenich.com/product/norlimbanolr-pe-967412",
						nameUsed: "Norlimbanol®",
						notes: ["dry", "wood", "amber", "powerful"],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/karmawood/",
						nameUsed: "Karmawood",
						notes: ["wood", "powder", "amber", "cream", "sandalwood", "strong"],
					},
				},
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Timberol.pdf",
						nameUsed: "Timberol®",
						notes: [
							"wood",
							"amber",
							"cedarwood",
							"ambergris",
							"powerful",
							"floral",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_221.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "1-(2-tert.-Butyl cyclohexyloxy)-2-butanol",
			cas: ["139504-68-0"],
			otherNames: [
				"1-(2-tert-Butylcyclohexyl)oxybutan-2-ol",
				"1-[(2-tert-Butylcyclohexyl)oxy]butan-2-ol",
				"1-(2-t.-Butyl cyclohexyloxy)-2-butanol",
				"1-(2-t-Butylcyclohexyl)oxybutan-2-ol",
				"1-[(2-t-Butylcyclohexyl)oxy]butan-2-ol",
				"Amber Core",
				"Coramber",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["amber", "wood", "ambrette"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_222.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3,6,7-Trimethyl-2,6-octadienal",
			cas: ["1891-67-4"],
			otherNames: [
				"2,6-Octadienal, 3,6,7-trimethyl",
				"3,6,7-Trimethyl-2,6-octadienal",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/367-trimethyl-26-octadienal-14917671",
						nameUsed: "3,6,7-Trimethyl-2,6-octadienal",
						notes: [
							"fruit",
							"citrus",
							"floral",
							"herbal",
							"sweet",
							"fresh",
							"lemon",
							"rose",
							"wood",
							"spicy",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_223.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.6,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2,4,4,7-Tetramethyl-6-octen-3-one",
			cas: ["74338-72-0"],
			otherNames: ["Claritone"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Claritone.pdf",
						nameUsed: "Claritone",
						notes: [
							"citrus",
							"grapefruit",
							"clary sage",
							"grape",
							"fresh",
							"fougere",
							"sparkling champagne",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_224.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Cyclohexylidene-2-ortho-tolylacetonitrile",
			cas: ["916887-53-1"],
			otherNames: [
				"2-Cyclohexylidene-2-o-tolylacetonitrile",
				"Benzeneacetonitrile, alpha-cyclohexylidene-2-methyl",
				"Benzeneacetonitrile, α-cyclohexylidene-2-methyl",
				"Petalia",
				"2-Cyclohexylidene-2-ortho-tolyl acetonitrile",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/2-cyclohexylidene-2-ortho-tolylacetonitrile-916887531",
						nameUsed: "2-Cyclohexylidene-2-ortho-tolyl acetonitrile",
						notes: [
							"floral",
							"fresh",
							"citrus",
							"ozone",
							"rose",
							"lily",
							"muguet",
							"neroli",
							"grapefruit",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_225.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.52,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Ethyl and Methyl furaneol",
			cas: ["27538-09-6", "27538-10-9"],
			otherNames: [
				"2-Ethyl-4-hydroxy-5-methylfuran-3-one",
				"Ethyl furaneol",
				"Methyl furaneol",
				"2-Ethyl-4-hydroxy-5-methyl-3(2H)-furanone",
				"3(2H)-Furanone, 5-ethyl-4-hydroxy-2-methyl",
				"5-Ethyl-4-hydroxy-2-methyl-3(2H)-furanone",
				"5-Ethyl-4-hydroxy-2-methylfuran-3(2H)-one",
				"2-Ethyl-4-hydroxy-5-methylfuran-3(2H)-one",
				"3(2H)-Furanone, 2-ethyl-4-hydroxy-5-methyl",
				"Homofuraneol",
				"Maltarome",
				"Homofuronol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"caramellic",
							"candy",
							"butterscotch",
							"berry",
							"wine",
							"fruity",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_226.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Hexylidenecyclohexan-1-one",
			cas: ["16429-07-5"],
			otherNames: ["2-Hexylidenecyclohexanone", "Cyclohexanone, 2-hexylidene"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/cyclohexanone-2-hexylidene-86002",
						nameUsed: "Cyclohexanone, 2-hexylidene-",
						notes: [
							"fruit",
							"floral",
							"jasmin",
							"herbal",
							"green",
							"fresh",
							"sweet",
							"spicy",
							"wax",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_227.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.13,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Methyl-2-pentenal",
			cas: ["623-36-9"],
			otherNames: [
				"2-Methylpent-2-enal",
				"2-Pentenal, 2-methyl",
				"2,4-Dimethylcrotonaldehyde",
				"α-Methyl-β-ethylacrolein",
				"alpha-Methyl-beta-ethylacrolein",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/2-methyl-2-pentenal-1121",
						nameUsed: "2-Methyl-2-pentenal",
						notes: [
							"green",
							"fruit",
							"aldehydic",
							"floral",
							"jasmin",
							"herb",
							"fresh",
							"sweet",
							"spicy",
							"wax",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_228.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.0077,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "2-Octen-4-one",
			cas: ["4643-27-0"],
			otherNames: [
				"Butyl propenyl ketone",
				"Oct-2-en-4-one",
				"Propenyl butyl ketone",
				"Strawbinone",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"yeast",
							"jam",
							"tropical",
							"fruit",
							"mushroom",
							"metallic",
							"bread",
							"pineapple",
							"horseradish",
							"earth",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_229.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.047,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl lavender ketone",
			cas: ["67801-33-6", "67633-95-8"],
			otherNames: [
				"2-Nonanone, 3-(hydroxymethyl)-",
				"3-(Hydroxymethyl)nonan-2-one",
				"Herbal ketone",
				"2-Acetyl-1-octanol",
				"1-Hydroxydecan-3-one",
				"3-Decanone, 1-hydroxy",
				"1-Hydroxy-3-decanone",
				"Ethyl hydroxyheptyl ketone",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/methyl-lavender-ketone/",
						nameUsed: "Methyl Lavender Ketone",
						notes: ["sweet", "herbal", "metallic", "lavender"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_231.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.082,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3,4,5,6,6-Pentamethylhept-3-en-2-one",
			cas: ["81786-74-5", "81786-73-4", "86115-11-9", "81786-75-6"],
			otherNames: [
				"2-Heptanone, 3,5,6,6-tetramethyl-4-methylene",
				"3,5,6,6-Tetramethyl-4-methyleneheptan-2-one",
				"3,5,6,6-Tetramethyl-4-methylideneheptan-2-one",
				"(Z)-3,4,5,6,6-Pentamethylhept-3-en-2-one",
				"3-Hepten-2-one, 3,4,5,6,6-pentamethyl-, (Z)-",
				"3-Hepten-2-one, 3,4,5,6,6-pentamethyl-",
				"(E)-3,4,5,6,6-Pentamethylhept-3-en-2-one",
				"3-Hepten-2-one, 3,4,5,6,6-pentamethyl-, (E)-",
				"Koavone",
				"Acetyl Diisoamylene",
				"Koavone®",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/koavone/",
						nameUsed: "Koavone®",
						notes: [
							"wood",
							"balsamic",
							"pine needle",
							"floral",
							"amber",
							"violet",
							"diffusive",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_232.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Methyl-5-phenylpent-2-enenitrile",
			cas: ["53243-60-0", "53243-59-7", "93893-89-1"],
			otherNames: [
				"2-Pentenenitrile, 3-methyl-5-phenyl- (isomer unspecified)",
				"(Z)-3-Methyl-5-phenylpent-2-enenitrile",
				"2-Pentenenitrile, 3-methyl-5-phenyl-, (Z)-",
				"(E)-3-Methyl-5-phenylpent-2-enenitrile",
				"2-Pentenenitrile, 3-methyl-5-phenyl-, (E)-",
				"Citronitrile",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Citronitrile.pdf",
						nameUsed: "Citronitrile",
						notes: [
							"citrus",
							"rose",
							"wax",
							"cinnamon",
							"coriander",
							"floral",
							"lime",
							"lemon",
							"grapefruit",
							"orange",
							"mandarin",
							"herb",
							"green",
							"fruit",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_233.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.12,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Octen-2-one",
			cas: ["1669-44-9"],
			otherNames: [
				"Oct-3-en-2-one",
				"Methyl hexenyl ketone",
				"1-Hexenyl methyl ketone",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/3-octen-2-one-2222",
						nameUsed: "3-Octen-2-one",
						notes: [
							"fruit",
							"green",
							"fat",
							"herbal",
							"sweet",
							"earth",
							"ketone",
							"cheese",
							"spicy",
							"mushroom",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_234.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.047,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Dimethyl octenone",
			cas: ["2550-11-0"],
			otherNames: ["4,7-Dimethyloct-6-en-3-one", "6-Octen-3-one, 4,7-dimethyl"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/dimethyl-octenone",
						nameUsed: "Dimethyl Octenone",
						notes: ["citrus", "fruit", "fresh", "bitter", "diffusive"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Dimethyl Octenone can be used to great advantage in citrus accords where it underlines the natural bitterness of the fruit. Its combination with fresh notes is much appreciated for the diffusion that it brings to compositions. Its utilisation with certain modern accords can give original and natural grapefruit effects.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_235.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isopentylcyclohexanone",
			cas: ["16587-71-6"],
			otherNames: [
				"4-(1,1-Dimethylpropyl)cyclohexanone",
				"4-t-Amylcyclohexanone",
				"4-tert-Amylcyclohexanone",
				"4-tert-Pentylcyclohexanone",
				"Cyclohexanone, 4-(1,1-dimethylpropyl)-",
				"p-tert Amyl cyclohexanone",
				"Orris hexanone",
				"4-(2-Methylbutan-2-yl)cyclohexan-1-one",
				"Orivone",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/orivone/",
						nameUsed: "Orivone",
						notes: ["powerful", "orris", "camphor", "earth"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_236.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.15,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Woody furan",
			cas: ["351343-77-6", "338735-71-0"],
			otherNames: [
				"2,6,6,7,8,8-hexamethyldecahydro-2H-indeno[4,5-b]furan",
				"Decahydro-2,6,6,7,8,8-hexamethyl-2H-indeno[4,5-b]furan",
				"8H-Indeno(4,5-B)furan,2,3,3a,4,5,5a,6,7,8a,9-decahydro-2,6,6,7,8,8-hexamethyl (mixture of isomers)",
				"1H-Indene, 2,3,3a,4,5,7a-hexahydro-1,1,2,3,3-pentamethyl-6-(2-propenyl)-",
				"Trisamber",
				"Tris amber super",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/trisamber/",
						nameUsed: "Trisamber",
						notes: [
							"strong",
							"wood",
							"amber",
							"warm",
							"sensual",
							"clean",
							"fresh",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_237.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.94,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Allyl 3-cyclohexylpropionate",
			cas: ["2705-87-5"],
			otherNames: [
				"2-Propen-1-yl cyclohexanepropionate",
				"Allyl 3-cyclohexylpropanoate",
				"Allyl beta-cyclohexylpropionate",
				"Allyl β-cyclohexylpropionate",
				"Allyl cyclohexanepropionate",
				"Allyl cyclohexylpropionate",
				"Allyl hexahydrophenylpropionate",
				"Cyclohexanepropionic acid, 2-propenyl ester",
				"Prop-2-enyl 3-cyclohexylpropanoate",
				"Cyclohexylpropionic acid allyl ester",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC-reduziert-Einzelseiten/SYM_F-Allyl-Cyclohexyl-Propionate.pdf",
						nameUsed: "Allyl Cyclohexyl Propionate",
						notes: [
							"yellow fruits",
							"tropical",
							"fruit",
							"pineapple",
							"green",
							"ester",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_238.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.47,
							},
						},
						{
							status: "specification",
							notes: [
								"Allyl esters: free allyl alcohol must be less than 0.1% (IFRA Allyl esters Specification Standard).",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Amylcinnamicaldehyde diethyl acetal",
			cas: ["60763-41-9"],
			otherNames: [
				"α-Amylcinnamicaldehyde diethyl acetal",
				"[2-(Diethoxymethyl)hept-1-en-1-yl]benzene",
				"1,1-Diethoxy-2-amyl-3-phenyl-2-propene",
				"1,1-Diethoxy-2-amyl-3-phenylacrolein",
				"2-Diethoxymethyl-1-phenylhept-1-ene",
				"Benzene, [2-(diethoxymethyl)-1-heptenyl]-",
				"2-(Diethoxymethyl)hept-1-enylbenzene",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["floral", "leaf", "mild", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_239.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.35,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Amylcinnamicaldehyde dimethyl acetal",
			cas: ["91-87-2"],
			otherNames: [
				"α-Amylcinnamicaldehyde dimethyl acetal",
				"alpha-Amylcinnamaldehyde dimethyl acetal",
				"α-Amylcinnamaldehyde dimethyl acetal",
				"[2-(Dimethoxymethyl)hept-1-en-1-yl]benzene",
				"1,1-Dimethoxy-2-amyl-3-phenyl-2-propene",
				"1,1-Dimethoxy-2-benzylideneheptane",
				"alpha-Amyl-beta-phenylacrolein dimethyl acetal",
				"α-Amyl-β-phenylacrolein dimethyl acetal",
				"alpha-Pentylcinnamaldehyde dimethyl acetal",
				"α-Pentylcinnamaldehyde dimethyl acetal",
				"Benzene, [2-(dimethoxymethyl)-1-heptenyl]-",
				"[2-(Dimethoxymethyl)-1-heptenyl]benzene",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["jasmin", "lily", "green", "lemon"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_240.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.35,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "alpha-Cyclohexylidene benzeneacetonitrile",
			cas: ["10461-98-0"],
			otherNames: [
				"α-Cyclohexylidene benzeneacetonitrile",
				".delta.1,.alpha.-Cyclohexaneacetonitrile, .alpha.-phenyl-",
				".δ.1,.α.-Cyclohexaneacetonitrile, .α.-phenyl",
				"2-Cyclohexylidene-2-phenylacetonitrile",
				"Benzeneacetonitrile, alpha-cyclohexylidene",
				"Benzeneacetonitrile, α-cyclohexylidene",
				"Peonile",
				"Rosinile",
				"Sensinile",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/peoniletm",
						nameUsed: "Peonile™",
						notes: [
							"floral",
							"geranium",
							"grapefruit",
							"fresh",
							"rose",
							"powerful",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Peonile™, with its geranium-rosy character, gives interesting combinations in floral, fougere or hesperidic accords. Peonile™ is powerful, relatively non-volatile and is very stable in almost all media. It has very high substantivity on wet and dry laundry and helps to increase volume and tenacity in functional perfumes.",
						],
					},
				},
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Sensinile.pdf",
						nameUsed: "Sensinile",
						notes: [
							"floral",
							"rose",
							"geranium",
							"tea",
							"lime pulp",
							"pear",
							"lily of the valley",
							"orris",
							"violet",
							"fruit",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_241.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.52,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "5-Hexen-1-yl 2-methylbutanoate",
			cas: ["155514-23-1"],
			otherNames: [
				"Hex-5-en-1-yl 2-methylbutanoate",
				"Butanoic acid, 2-methyl-, 5-hexen-1-yl ester",
				"Fructate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"fruity",
							"apple",
							"raspberry",
							"pear",
							"tropical",
							"green",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_242.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.64,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Carvyl acetate",
			cas: ["97-42-7", "1205-42-1", "1134-95-8"],
			otherNames: [
				"2-Cyclohexen-1-ol, 2-methyl-5-(1-methylethenyl)-, acetate",
				"5-Isopropenyl-2-methylcyclohex-2-en-1-yl acetate",
				"p-Mentha-6,8-dien-2-yl acetate",
				"p-Mentha-6,8-dien-2-ol, acetate",
				"2-Cyclohexen-1-ol, 2-methyl-5-(1-methylethenyl)-, acetate, cis",
				"5-Isopropenyl-2-methylcyclohex-2-en-1-yl acetate, cis",
				"p-Mentha-6,8-dien-2-ol, acetate, cis",
				"l-1-p-Mentha-6,8(9)-dien-2-yl acetate",
				"cis-Carvyl acetate",
				"laevo-Carvyl acetate",
				"1-Carvyl acetate",
				"cis-2-Methyl-5-(1-methylvinyl)cyclohex-2-en-1-yl acetate",
				"2-Cyclohexen-1-ol, 2-methyl-5-(1-methylethenyl)-, acetate, trans",
				"5-Isopropenyl-2-methyl-2-cyclohexen-1-yl acetate, trans",
				"p-Mentha-6,8-dien-2-ol, acetate, trans",
				"trans-Carvyl acetate",
				"(E)-Carvyl acetate",
				"Carvyl acetate E",
				"CarvyL Acetate Cis L",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_FC_Einzel-PDF/SYM_FC-Carvyl_Acetate_Cis_L.pdf",
						nameUsed: "CarvyL Acetate Cis L",
						notes: [
							"mint",
							"spice",
							"herb",
							"allium",
							"citrus",
							"red fruit",
							"tropical",
							"fruit",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_243.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.24,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "cis-3-Heptenyl acetate",
			cas: ["1576-78-9"],
			otherNames: [
				"(Z)-Hept-3-enyl acetate",
				"3-Hepten-1-ol, acetate, (Z)-",
				"Hept-3-en-1-yl acetate",
				"3-Hepten-1-yl acetate",
				"(Z)-3-hepten-1-yl acetate",
				"Violana",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"green",
							"tropical",
							"banana",
							"vegetable",
							"fat",
							"passion fruit",
							"violet",
							"earth",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_244.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "cis-3-Hexenyl isovalerate",
			cas: ["35154-45-1"],
			otherNames: [
				"(Z)-Hex-3-enyl isovalerate",
				"Hex-3-en-1-yl 3-methylbutanoate",
				"Isovaleric acid, 3-hexenyl ester, (z)-",
				"(Z)-3-Hexen-1-yl isovalerate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["green", "sweet", "apple", "fruity", "creamy", "buttery"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_245.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "cis-3-Hexenyl methyl carbonate",
			cas: ["67633-96-9"],
			otherNames: [
				"Carbonic acid, 3-hexenyl methyl ester, (Z)-",
				"cis-3-Hexenyl carbonate",
				"Hex-3-en-1-yl methyl carbonate",
				"Methyl cis-3-hexenyl carbonate",
				"(Z)-3-Hexen-1-yl methyl carbonate",
				"Liffarome",
				"Leafovert",
				"Vertelione",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/liffarome/",
						nameUsed: "Liffarome™",
						notes: ["violet", "green", "pear", "grass"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_246.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.56,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "cis-3-Nonenyl acetate",
			cas: ["13049-88-2"],
			otherNames: [
				"(Z)-3-Nonenyl acetate",
				"3-Nonen-1-ol, acetate, (3Z)-",
				"(Z)-3-Nonen-1-yl acetate",
				"Acetic acid 3-nonenyl ester",
				"Pear acetate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["fruity", "fleshy", "pear", "green", "tropical", "herbal"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_247.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Citronellyl acetate",
			cas: ["150-84-5", "67601-05-2", "141-11-7"],
			otherNames: [
				"3,7-Dimethyl-6-octen-1-ol acetate",
				"3,7-Dimethyl-6-octen-1-yl acetate",
				"3,7-Dimethyloct-6-en-1-yl acetate",
				"6-Octen-1-ol, 3,7-dimethyl-, acetate",
				"Acetic acid, citronellyl ester",
				"laevo-Citronellyl acetate",
				"3,7-Dimethyloct-6-enyl acetate",
				"6-Octen-1-ol, 3,7-dimethyl-, 1-acetate (3S)-",
				"6-Octen-1-ol, 3,7-dimethyl-, acetate (S)-",
				"(S)-3,7-Dimethyloct-6-en-1-yl acetate",
				"(-)-3,7-dimethyloct-6-enyl acetate",
				"alpha-Citronellyl acetate",
				"3,7-Dimethyl-(6-or 7-)octen-1-yl acetate",
				"3,7-Dimethyl-(6-or 7-)octen-1-yl ethanoate",
				"3,7-Dimethyloct-7-en-1-yl acetate",
				"7-Octen-1-ol, 3,7-dimethyl-, acetate",
				"3,7-Dimethyl-7-octen-1-yl acetate",
				"3,7-Dimethyl-7-octen-1-yl ethanoate",
				"(S)-3,7-Dimethyloct-7-enyl acetate",
				"Rhodinyl acetate",
				"Rhodinyl ethanoate",
				"L-Citronellyl acetate",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/citronellyl-acetate/",
						nameUsed: "Citronellyl Acetate",
						notes: ["rose", "citrus", "fresh", "fruit"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_248.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.7,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclohexadecanone",
			cas: ["2550-52-9"],
			otherNames: ["Homoexaltone", "Isomuscone"],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Isomuscone.pdf",
						nameUsed: "Isomuscone®",
						notes: [
							"musk",
							"tonkin musk",
							"animal",
							"powder",
							"balsam",
							"floral",
							"wood",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_249.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Cyclohexadecenone",
			cas: [
				"3100-36-5",
				"88642-03-9",
				"5365-06-0",
				"2550-59-6",
				"5120-20-7",
				"854373-71-0",
				"854373-70-9",
			],
			otherNames: [
				"Cyclohexadec-2-en-1-one",
				"Cyclohexadec-8(7)-en-1-one",
				"8-Cyclohexadecen-1-one, (8E)",
				"(Z)-Cyclohexadec-8-enone",
				"7-Cyclohexadecen-1-one",
				"8-Cyclohexadecen-1-one",
				"Cyclohexadec-8-en-1-one mixture of cis and trans isomer",
				"Cyclohexadec-8-en-1-one",
				"8-Cyclohexadecen-1-one, (8Z)",
				"8-Cyclohexadecen-1-one, (Z)",
				"(Z)-8-Cyclohexadecen-1-one",
				"8-Cyclohexadecenone",
				"cis-Cyclohexadec-8-en-1-on",
				"8-cis-Cyclohexadecen-1-on",
				"7-Cyclohexadecen-1-one, (7Z)",
				"7-Cyclohexadecen-1-one, (7E)",
				"(E)-Cyclohexadec-7-enone",
				"Globanone",
				"Aurelione",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Aurelione.pdf",
						nameUsed: "Aurelione®",
						notes: ["musk", "balsam", "powder", "animal", "wood"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_250.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 4.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "1-(2,2,6-Trimethylcyclohexyl)-3-pentanol",
			cas: ["60241-53-4", "60241-52-3"],
			otherNames: [
				"Cyclohexanepropanol, α-ethyl-2,2,6-trimethyl",
				"Cyclohexanepropanol, alpha-ethyl-2,2,6-trimethyl",
				"alpha-Ethyl-2,2,6-trimethylcyclohexanepropanol",
				"α-Ethyl-2,2,6-trimethylcyclohexanepropanol",
				".alpha.,.beta.,2,2,6-Pentamethylcyclohexanepropanol",
				".α.,.β.,2,2,6-Pentamethylcyclohexanepropanol",
				"3-Methyl-4-(2,2,6-trimethylcyclohexyl)butan-2-ol",
				"4-(2,6,6-Trimethylcyclohexyl)-3-methylbutan-2-ol",
				"Cyclohexanepropanol, .α.,.β.,2,2,6-pentamethyl",
				"Cyclohexanepropanol, .alpha.,.beta.,2,2,6-pentamethyl",
				"Methyltetrahydroionol",
				"Iso-methyl tetrahydroionol",
				"Madranol",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Madranol.pdf",
						nameUsed: "Madranol®",
						notes: [
							"wood",
							"cedarwood",
							"violet",
							"amber",
							"plum",
							"floral",
							"sandalwood",
							"patchouli",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_251.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.3,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "(Ethoxymethoxy)-cyclododecane",
			cas: ["58567-11-6"],
			otherNames: [
				"Cyclododecane, (ethoxymethoxy)-",
				"Formaldehyde cyclododecyl ethyl acetal",
				"Amber decane",
				"Amberwood",
				"2-Cyclododecyl propanol",
				"Amberwood F",
				"Boisambrene forte",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Amberwood_F.pdf",
						nameUsed: "Amberwood® F",
						notes: ["wood", "cedarwood", "amber", "sandalwood"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_252.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "6-Hydroxy-2,6-dimethylheptanal",
			cas: ["62439-42-3"],
			otherNames: ["Heptanal, 6-hydroxy-2,6-dimethyl"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Bedoukian",
					data: {
						pdfUrl:
							"https://bedoukian.com/wp-content/uploads/FR-279-SUS-spec-sheet.pdf",
						nameUsed: "Hydrofleur®",
						notes: [
							"powerful",
							"fresh",
							"water",
							"ozonic",
							"fruit",
							"raspberry",
							"melon",
							"white petals",
							"muguet",
							"tuberose",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_253.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isobutyl cinnamate",
			cas: ["122-67-8"],
			otherNames: [
				"2-Methylpropyl 3-phenylpropenoate",
				"2-Methylpropyl beta-phenylacrylate",
				"2-Methylpropyl β-phenylacrylate",
				"2-Methylpropyl cinnamate",
				"2-Propenoic acid, 3-phenyl-, 2-methylpropyl ester",
				"Isobutyl 3-phenylacrylate",
				"Isobutyl 3-phenylpropenoate",
				"Isobutyl beta-phenylacrylate",
				"Labdanol",
				"3-Phenylpropenoic acid isobutyl ester",
				"2-methylpropyl (E)-3-phenylprop-2-enoate",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["sweet", "balsamic", "fruity", "labdanum", "spicy"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_254.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.2,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Isoeugenyl acetate",
			cas: ["93-29-8"],
			otherNames: [
				"2-Methoxy-4-prop-1-en-1-ylphenyl acetate",
				"2-Methoxy-4-propenylphenyl acetate",
				"4-Acetoxy-3-methoxy-1-(1-propen-1-yl)benzene",
				"Acetisoeugenol",
				"Acetyl isoeugenol",
				"Isoeugenol acetate",
				"Phenol, 2-methoxy-4-(1-propenyl)-, acetate",
				"1-Acetoxy-2-methoxy-4-(1-propenyl)benzene",
				"Acetic acid isoeugenyl ester",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"spicy",
							"powdery",
							"floral",
							"carnation",
							"balsamic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_255.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.99,
							},
						},
					],
				},
			},
		},
		{
			canonicalName:
				"4-Methyl-1-propan-2-ylbicyclo[2.2.2]oct-2-ene-8-carboxylate",
			cas: ["68966-86-9"],
			otherNames: [
				"Bicyclo[2.2.2]oct-5-ene-2-carboxylic acid, 1(or 4)-methyl-4(or 1)-(1-methylethyl)-, methyl ester",
				"Methyl 4(or 1)-isopropyl-1(or 4)-methylbicyclo[2.2.2]oct-5-ene-2-carboxylate",
				"Mahagonat",
				"Poivrol",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Poivrol.pdf",
						nameUsed: "Poivrol®",
						notes: [
							"pepper",
							"laurel leaf",
							"wood",
							"fresh",
							"spicy",
							"herb",
							"earth",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_256.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.94,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methyl vanillyl ether",
			cas: ["5533-03-9"],
			otherNames: [
				"2-Methoxy-4-(methoxymethyl)phenol",
				"Phenol, 2-methoxy-4-(methoxymethyl)-",
				"4-Hydroxy-3-methoxybenzyl methyl ether",
				"Mevanyl",
				"Vani-White",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"vanilla",
							"caramel",
							"butterscotch",
							"spicy",
							"warm",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_257.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.5,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Myraldyl acetate",
			cas: ["72403-67-9"],
			otherNames: [
				"3(or 4)-(4-Methylpenten-3-yl)cyclohex-3-ene-1-methyl acetate",
				"3-Cyclohexene-1-methanol, 3(or 4)-(4-methyl-3-pentenyl)-, acetate",
				"4(or 3)-(4-Methyl-3-pentenyl)-3-cyclohexenylmethyl acetate & isomers",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/myraldyl-acetate",
						nameUsed: "Myraldyl Acetate",
						notes: [
							"floral",
							"jasmine",
							"sweet",
							"fruit",
							"green",
							"muguet",
							"diffusive",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Myraldyl Acetate brings a diffusive jasmine / muguet odour. It gives an exceptionally full bodied, floral character to compositions. Its good stability and long lasting qualities, combined with its original floral character, make this ingredient an attractive choice for soap and detergent perfumery.",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_258.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName:
				"Octahydro-dimethylnaphthalene-2-carbaldehyde (mixed isomers)",
			cas: ["68991-96-8", "68991-97-9", "68738-96-5", "68738-94-3"],
			otherNames: [
				"2-Naphthalenecarboxaldehyde, octahydro-8,8-dimethyl",
				"Dimethyloctahydro-2-naphthaldehyde",
				"Octahydro-8,8-dimethyl-2-naphthalenecarboxaldehyde",
				"Octahydro-8,8-dimethylnaphthalene-2-carbaldehyde",
				"2-Naphthalenecarboxaldehyde, octahydro-5,5-dimethyl",
				"Octahydro-5,5-dimethylnaphthalene-2-carbaldehyde",
				"1,2,3,4,5,6,7,8-Octahydro-5,5-dimethylnaphthalene-2-carbaldehyde",
				"2-Naphthalenecarboxaldehyde, 1,2,3,4,5,6,7,8-octahydro-5,5-dimethyl",
				"5,5-Dimethyl-1,2,3,4,5,6,7,8-octahydro-2-naphthalenecarboxaldehyde",
				"1,2,3,4,5,6,7,8-Octahydro-8,8-dimethyl-2-naphthaldehyde",
				"2-Naphthalenecarboxaldehyde, 1,2,3,4,5,6,7,8-octahydro-8,8-dimethyl",
				"8,8-Dimethyl-1,2,3,4,5,6,7,8-octahydro-2-naphthalenecarboxaldehyde",
				"Melafleur",
				"Cyclemone A",
				"Cyclomeral",
				"Cyclomyral",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/cyclemone-a/",
						nameUsed: "Cyclemone A",
						notes: ["fresh", "clean", "ozonic", "marine", "herbal"],
					},
				},
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/melafleur/",
						nameUsed: "Melafleur",
						notes: ["floral", "muguet", "fresh", "green", "melon"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_259.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 2.1,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "p-Cresol",
			cas: ["106-44-5", "1319-77-3"],
			otherNames: [
				"1-Hydroxy-4-methylbenzene",
				"1-Methyl-4-hydroxybenzene",
				"4-Cresol",
				"4-Methylphenol",
				"para-Cresol",
				"p-Cresylic acid",
				"Phenol, 4-methyl",
				"p-Hydroxytoluene",
				"p-Methylphenol",
				"Cresols",
				"Cresol (mixed isomers)",
				"Cresol, pure",
				"Methylphenol",
				"Mixed cresols",
				"Phenol, methyl",
			],
			noteType: "base",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["phenolic", "narcissus", "animal", "mimosa"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_260.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.005,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Phenoxyacetaldehyde",
			cas: ["2120-70-9"],
			otherNames: [
				"Acetaldehyde, phenoxy",
				"Cortex aldehyde 50",
				"2-Phenoxyacetaldehyde",
				"Acetaldehyde, 2-phenoxy",
				"Cortex Aldehyde 50% TEC",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "IFF",
					data: {
						url: "https://www.iff.com/scent/ingredients-compendium/cortex-aldehyde-50-tec/",
						nameUsed: "Cortex Aldehyde 50% TEC",
						notes: ["green", "floral", "fresh"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_261.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.25,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Carvomenthone",
			cas: ["499-70-7", "59471-80-6"],
			otherNames: [
				"trans-p-Menthan-2-one",
				"p-Menthan-2-one",
				"trans-5-Isopropyl-2-methylcyclohexan-1-one",
				"5-Isopropyl-2-methylcyclohexanone",
				"Cyclohexanone, 2-methyl-5-(1-methylethyl)-, trans",
				"Tetrahydrocarvone",
				"Cyclohexanone, 2-methyl-5-(1-methylethyl)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "mint", "spearmint", "cooling", "green"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_262.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 1.9,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "4-tert-Butylcyclohexanone",
			cas: ["98-53-3"],
			otherNames: [
				"para-tert-Butylcyclohexanone",
				"p-tert-Butylcyclohexanone",
				"Cyclohexanone, 4-(1,1-dimethylethyl)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: ["wood", "mint", "patchouli", "musk", "leather"],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_263.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.15,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "7-Methoxy-3,7-dimethyloct-1-ene",
			cas: ["53767-86-5"],
			otherNames: [
				"1-Octene, 7-methoxy-3,7-dimethyl",
				"1-Octene, 7-methoxy-3,7-dimethyl-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Scent VN",
					data: {
						url: "https://scent.vn/en/pages/compound/1-octene-7-methoxy-37-dimethyl-103825",
						nameUsed: "1-Octene, 7-methoxy-3,7-dimethyl-",
						notes: [
							"citrus",
							"floral",
							"herb",
							"fresh",
							"lemon",
							"wood",
							"rose",
							"lavender",
							"bergamot",
							"sweet",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_264.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.00001,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Methoxycyclododecane",
			cas: ["2986-54-1"],
			otherNames: [
				"Cyclododecane, methoxy",
				"Cyclododecyl methyl ether",
				"Palisandin",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Symrise",
					data: {
						pdfUrl:
							"https://www.symrise.com/fileadmin/symrise/Marketing/Scent_and_care/Aroma_molecules/Ingredient_finder/SYM_PC_Datenblaetter/SYM_PC-Palisandin.pdf",
						nameUsed: "Palisandin",
						notes: [
							"wood",
							"amber",
							"sandalwood",
							"cedarwood",
							"orris",
							"floral",
							"vetiver",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_265.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.43,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "3-Acetyl-2,5-dimethylfuran",
			cas: ["10599-70-9"],
			otherNames: [
				"1-(2,5-Dimethyl-3-furyl)ethanone",
				"2,5-Dimethyl-3-acetylfuran",
				"Ethanone, 1-(2,5-dimethyl-3-furanyl)-",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"sweet",
							"musty",
							"nut",
							"earthy",
							"cocoa",
							"corn",
							"leathery",
							"powdery",
							"roasted",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_266.pdf",
					rules: [
						{
							status: "prohibition",
							notes: [
								"3-Acetyl-2,5-dimethylfuran should not be used as a fragrance ingredient.",
							],
						},
					],
				},
			},
		},
		{
			canonicalName: "2,5-Octadien-4-one, 5,6,7-trimethyl-, (2E)-",
			cas: ["358331-95-0", "357650-26-1", "847144-75-6"],
			otherNames: [
				"(2E,5Z)-5,6,7-Trimethylocta-2,5-dien-4-one",
				"2,5-Octadien-4-one, 5,6,7-trimethyl-, (2E,5Z)-",
				"2,5-Octadien-4-one, 5,6,7-trimethyl-, (2E,5E)-",
				"(2E,5E)-5,6,7-Trimethylocta-2,5-dien-4-one",
				"Pomarose",
			],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Google AI",
					data: {
						notes: [
							"fruity",
							"rose",
							"apple",
							"dried apple",
							"plum",
							"raisin",
							"fruit",
							"dried fruit",
							"rum",
							"caramellic",
						],
					},
				},
			],
			regulatory: {
				ifra: {
					pdfUrl:
						"https://d3t14p1xronwr0.cloudfront.net/docs/standards/IFRA_STD_267.pdf",
					rules: [
						{
							status: "restriction",
							categoryLimits: {
								"4": 0.11,
							},
						},
					],
				},
			},
		},
		{
			canonicalName: "Acetal CD",
			cas: ["29895-73-6"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/acetal-cd",
						nameUsed: "Acetal CD",
						notes: ["floral", "green", "honey", "rose"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Acetal CD blends well with floral notes such as hyacinth, rose and lilac, with green accords, and with linden blossom and chypre compositions.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Acetate C9 Nonylic",
			cas: ["143-13-5"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/acetate-c9-nonylic",
						nameUsed: "Acetate C9 Nonylic",
						notes: ["fruity", "tropical"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Acetate C9 Nonylic has a fruity and tropical note with aromatic undertones.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Adoxal",
			cas: ["141-13-9"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/adoxal",
						nameUsed: "Adoxal",
						notes: [
							"marine",
							"aldehydic",
							"floral",
							"fresh",
							"powerful",
							"ozonic",
						],
						olfactiveFamily: "Marine",
						olfactiveDescription: [
							'Adoxal has a natural, ozonic aspect. It is very powerful and must be used carefully. Adoxal blends extremely well with floral notes such as muguet and cyclamen, as well as with fruity and woody compositions. It can also be seen as having a typical "fresh linen" odour which makes it very useful for detergent applications.',
						],
					},
				},
			],
		},
		{
			canonicalName: "Aldehyde C11 Undecylenic",
			cas: ["112-45-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/aldehyde-c11-undecylenic",
						nameUsed: "Aldehyde C11 Undecylenic",
						notes: [
							"aldehyde",
							"floral",
							"green",
							"rose",
							"citrus",
							"zest",
							"orange",
							"mandarin",
						],
						olfactiveFamily: "Aldehydic",
						olfactiveDescription: [
							"Aldehyde C11 Undecylenic has an aldehydic and floral note with zesty and citrus undertones, reminiscent of orange and mandarin. It is very useful in floral and spicy composition and has a good fabric substantivity.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Aldehyde Iso C11",
			cas: ["1337-83-3"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/aldehyde-iso-c-11",
						nameUsed: "Aldehyde Iso C11",
						notes: ["aldehydic", "green", "rose", "powerful"],
						olfactiveFamily: "Aldehydic",
						olfactiveDescription: [
							"Aldehyde Iso C 11 has a predominant place in the fatty aldehyde series. It is several times stronger than Aldehyde C 11 Undecylenic and has a fresher, more complex odour profile. This aldehyde is particularly effective for modern soap accords and has a good fabric substantivity.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Alicate",
			cas: ["10250-45-0"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/alicate",
						nameUsed: "Alicate",
						notes: ["fruity", "rhubarb", "aromatic", "lilac"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Alicate is a fresh herbal note with hints of rhubarb and banana and a lilac background. It gives excellent performance and stability across the range of toiletry, soaps and detergents. Alicate blends well with fruity, citrus and herbal ingredients and gives a boost to top-note freshness.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Amberketal IPM",
			cas: ["110-27-0", "57345-19-4"],
			otherNames: ["Amberketal"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/amberketal-ipm",
						nameUsed: "Amberketal IPM",
						notes: ["amber", "wood", "dry", "powerful"],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Amberketal is a powerful ambery note for use in most applications, with good stability in non aggressive media. It is effective as a modifier in association with existing woody / ambery ingredients.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Sandela™ 85%/IPM",
			cas: ["110-27-0", "3407-42-9"],
			otherNames: ["Sandela™", "Sandela"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/sandelatm-85ipm",
						nameUsed: "Sandela™ 85%/IPM",
						notes: ["wood", "sandalwood", "balsamic"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Sandela™ is a classical sandalwood note that can be used in all fragrance types.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Silvanone™ Supra",
			cas: ["110-27-0", "109-29-5", "502-72-7"],
			otherNames: ["Silvanone™", "Silvanone"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/silvanonetm-supra",
						nameUsed: "Silvanone™ Supra",
						notes: ["musk", "sweet", "powdery", "animalic"],
						olfactiveFamily: "Musky",
						olfactiveDescription: [
							"Silvanone™ Supra is a sweet powdery animalic macrocyclic musk with aspects of nitromusk. It is highly substantive and tenacious and can be used in all application areas to give a full body and long lasting effect. Silvanone™ Supra works well with woody and amber notes, adds richness to floral creations especially in the sophisticated white florals, spicy carnation and oriental accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ambermax",
			cas: ["929625-08-1", "1001252-30-7", "77-93-0"],
			otherNames: ["Ambermax™ 10%/TEC", "Ambermax 10%"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ambermaxtm-10tec",
						nameUsed: "Ambermax™ 10%/TEC",
						notes: ["amber", "wood", "cedarwood"],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Ambermax™ is a powerful, fusing and substantive rich ambery note with some woody cedarwood facets. Its outstanding fabric substantivity makes it a key building block for fabric care fragrances beating all benchmarks on dry cloth. Ambermax™ is a perfect fit to our existing range of ambery-woody notes including Okoumal™ / Amberketal / Ambrofix and can be used across all categories.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ambermax 50%/Dowanol TPM",
			cas: ["929625-08-1", "1001252-30-7", "25498-49-1"],
			otherNames: ["Ambermax™ 50%", "Ambermax 50%", "Dowanol TPM", "Dowanol"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ambermaxtm-50dowanol-tpm",
						nameUsed: "Ambermax™ 50%/Dowanol TPM",
						notes: ["amber", "wood", "cedarwood"],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Ambermax™ is a powerful, fusing and substantive rich ambery note with some woody cedarwood facets. Its outstanding fabric substantivity makes it a key building block for fabric care fragrances beating all benchmarks on dry cloth. Ambermax™ is a perfect fit to our existing range of ambery-woody notes including Okoumal™ / Amberketal / Ambrofix and can be used across all categories.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Levistamel 25%/TEC",
			cas: ["675-09-2", "77-93-0"],
			otherNames: ["Levistamel 25%"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/levistamel-25tec",
						nameUsed: "Levistamel 25%/TEC",
						notes: ["gourmand", "caramel", "liquorice", "balsamic"],
						olfactiveFamily: "Gourmand",
						olfactiveDescription: [
							"Levistamel 25%/TEC has a sweet note of caramelised sugar with a green, celery, fenugreek, balsamic and aromatic background. At levels up to 1% Levistamel 25%/TEC can add an interesting effect in…",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Laitone 10%/TEC",
			cas: ["77-93-0", "94201-19-1", "81783-01-9"],
			otherNames: ["Methyl Laitone 10%"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-laitone-10tec",
						nameUsed: "Methyl Laitone 10%/TEC",
						notes: ["fruity", "coconut milk", "lactonic", "creamy"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Methyl Laitone 10% is one of the new spiro-lactones developed and patented by Givaudan. It is extremely powerful and very effective in all accords where a creamy, fruity volume is required. Methyl Laitone 10% provides cosmetic body to white flower notes such as jasmine, gardenia, tuberose and ylang ylang, and to fruity accords like peach and osmanthus. It provides milkiness to sandalwood accords and combines nicely with coumarin and tonka notes. Good substantivity on humid and dry fabric.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Undecatriene 10%/TEC",
			cas: ["929625-08-1", "1001252-30-7", "77-93-0"],
			otherNames: ["Undecatriene 10%"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/undecatriene-10tec",
						nameUsed: "Undecatriene 10%/TEC",
						notes: ["green", "galbanum", "aromatic", "intense"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Undecatriene 10%/TEC is a very natural and vibrant metallic green galbanum note. It is used in traces to provide a natural galbanum-like effect in compositions. It rounds out the palette of available green notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Labienoxime 10%/IPM-TEC",
			cas: ["77-93-0", "110-27-0", "81783-01-9"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/labienoxime-10ipm-tec",
						nameUsed: "Labienoxime 10%/IPM-TEC",
						notes: ["fruit", "blackcurrant", "grapefruit", "green"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Labienoxime 10%/IPM-TEC surprises with its natural, fresh, cassis, sage flower character. As a modifier, it blends well with accords where a fresh fruity, green aspect is needed - for example, citrus, modern lily of the valley, lavender. Compared to other products in this olfactive area, Labienoxime is more linear and substantive on fabric.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ambrettolide",
			cas: ["28645-51-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ambrettolide",
						nameUsed: "Ambrettolide",
						notes: ["musk", "ambrette seed", "powerful", "warm", "fruit"],
						olfactiveFamily: "Musky",
						olfactiveDescription: [
							"Ambrettolide is a macrocyclic musk with an exceptional diffusion and a very fine character. Its influence in a composition can be perceived at all evaporation levels. It is a superb fixative and highly substantive, and yet exalts the top note of a fragrance in an exceptional manner.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ambrofix™",
			cas: ["6790-58-5", "3738-00-9"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ambrofix",
						nameUsed: "Ambrofix™",
						notes: ["amber", "wood", "tobacco", "dry"],
						olfactiveFamily: "Amber",
						olfactiveDescription: [
							"Ambrofix™ is a highly powerful, highly substantive and highly stable ambery note. It is the most suitable material to deliver an authentic Ambergris note. Ambrofix™ also brings a woody sensuality to the composition and can be easily overdosed. It is the most widely used and most biodegradable ambery molecule. Traditionally, Ambrofix™ can be produced from a natural starting material derived from clary sage. Givaudan has developed a completely unique multi-step bioconversion process to produce Ambrofix™ starting from sugar cane. This new process is considered as one of the most sustainable process for Ambrofix™ in the market.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Amyl Salicylate",
			cas: ["2050-08-0", "51115-63-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/amyl-salicylate",
						nameUsed: "Amyl Salicylate",
						notes: ["floral", "sweet", "aromatic", "balsamic"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Amyl Salicylate has a floral and sweet, herbaceous and balsamic character, with a green undertone. It is extensively used in florals and can be an important ingredient for fougere accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Amyl Vinyl Carbinol",
			cas: ["3391-86-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/amyl-vinyl-carbinol",
						nameUsed: "Amyl Vinyl Carbinol",
						notes: ["herbal", "lavender"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Amyl Vinyl Carbinol is an impactful herbal note with mushroom effect. It is a top note used as a modifier in agrestic-aromatic accords like lavender and fougere.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Anisyl Acetate",
			cas: ["104-21-2"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/anisyl-acetate",
						nameUsed: "Anisyl Acetate",
						notes: ["herb", "anise", "floral", "fruit"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Anisyl Acetate is a good modifier in floral, fruity, oriental and chypre fragrances where it imparts sweetness and a natural effect.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Anther",
			cas: ["56011-02-0"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/anther",
						nameUsed: "Anther",
						notes: ["green", "floral", "hyacinth", "fresh"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Anther is a powerful ingredient with a green, fruity and fresh character. It is a strong modifier of tropical notes and hyacinth freshness. Used primarily in soaps and detergents, Anther gives great power to floral and green-floral creations.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Aurantiol™ Pure",
			cas: ["89-43-0"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/aurantioltm-pure",
						nameUsed: "Aurantiol™ Pure",
						notes: [
							"floral",
							"orange blossom",
							"linden blossom",
							"tuberose",
							"oriental",
							"citrus",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Aurantiol™ Pure is perhaps the best known Schiff base and is extensively used in a large variety of floral notes such as orange-blossom, linden-blossom and tuberose. Used in citrus cologne types, it acts as an excellent fixative as well as exalting the top notes. It gives an oriental character when used in amber and chypre compositions and blends particularly well with macrocyclic musks.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Azarbre",
			cas: ["68845-36-3"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/azarbre",
						nameUsed: "Azarbre",
						notes: [
							"gourmand",
							"honey",
							"wood",
							"orris",
							"warm",
							"dried flower",
						],
						olfactiveFamily: "Gourmand",
						olfactiveDescription: [
							"Azarbre has a warm honey note with aspects of dried flowers. It will enhance the effect of ionones at 2 to 3%. When used at higher dosage up to 10% it blends the woody and floral components of a fragrance together. Particularly suited for honey-sweet florals.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Benzyl Propionate",
			cas: ["122-63-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/benzyl-propionate",
						nameUsed: "Benzyl Propionate",
						notes: ["floral", "jasmine", "fruit"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Benzyl Propionate has a floral jasmine note, distinctively more fruity than the corresponding Acetate.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Berryflor™",
			cas: ["104986-28-9"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/berryflortm",
						nameUsed: "Berryflor™",
						notes: [
							"fruit",
							"raspberry",
							"floral",
							"fresh",
							"balsam",
							"jasmine",
							"anise",
						],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Berryflor™ is a floral, fruity, raspberry-like product with jasmine, anisic and balsamic aspects. It blends well with floral, woody and musky notes, and with the Isoraldeine™s and other ionones. It enriches and softens accords in all fields of perfumery.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Bisabolene",
			cas: ["17627-44-0", "502-61-4", "18794-84-8", "495-62-5"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/bisabolene",
						nameUsed: "Bisabolene",
						notes: [
							"floral",
							"orange blossom",
							"balsam",
							"myrrh",
							"sweet",
							"warm",
							"spicy",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Bisabolene has a warm, sweet-spicy-balsamic odour very typical of opoponax and ‘oriental’ fragrance types. It finds use in reconstitutions of oils of bergamot, myrrh and lemon, and is an excellent fixative for neroli bases.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Boisiris™",
			cas: ["68845-00-1"],
			otherNames: ["Boisiris"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/boisiristm",
						nameUsed: "Boisiris™",
						notes: ["wood", "amber", "orris", "rich", "tobacco", "elegant"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Boisiris™ is a rich woody chemical with a distinct orris note. Ambery and tobacco undertones add to its elegant character. Designed for use as a heart note in fine perfumery, it gives more volume and blends well with the citrus top notes and the woody back notes of patchouli, sandalwood or vetiver oil.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Butyl Quinoline Secondary",
			cas: ["65442-31-1", "67634-06-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/butyl-quinoline-secondary",
						nameUsed: "Butyl Quinoline Secondary",
						notes: ["leather", "green", "wood", "earth", "powerful", "vetiver"],
						olfactiveFamily: "Leather - Moss",
						olfactiveDescription: [
							"Butyl Quinoline Secondary has a smooth, fine, woody-vetiver-leather character. It is used in chypre, leather, woody compositions and in masculine colognes where it imparts great diffusion and fixation.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Pyralone",
			cas: ["65442-31-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/pyralone",
						nameUsed: "Pyralone",
						notes: ["leather", "green", "wood", "powerful", "tobacco"],
						olfactiveFamily: "Leather - Moss",
						olfactiveDescription: [
							"Pyralone is finer, more aromatic and tobacco-like, and has less of a dry, earthy character than Butyl Quinoline Secondary. It is used in chypre, fougere and tobacco accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Celery Ketone",
			cas: ["3720-16-9"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/celery-ketone",
						nameUsed: "Celery Ketone",
						notes: ["herbal", "spicy", "celery"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Celery Ketone is used as a modifier of aldehydic chypres and fougeres. It blends well with basil and tarragon oils in top note compositions, and also supports jasmine complexes. Celery Ketone is very useful wherever lovage and celery notes are desired.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Cervolide",
			cas: ["6707-60-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cervolide",
						nameUsed: "Cervolide",
						notes: ["musk", "powder", "fruit", "wood"],
						olfactiveFamily: "Musky",
						olfactiveDescription: [
							"Cervolide has a fine musk note, slightly fruity with a woody background.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Cetonal™",
			cas: ["65405-84-7"],
			otherNames: ["Cetonal"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cetonaltm",
						nameUsed: "Cetonal™",
						notes: ["floral", "orris", "wood", "powerful"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Cetonal™ is an elegant ingredient used in woody, orris accords as well as with leather, tobacco and animal notes where it acts as an excellent blending agent and adds to the harmony of a fragrance.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Cetone V",
			cas: ["79-78-7"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cetone-v",
						nameUsed: "Cetone V",
						notes: ["floral", "green", "fruit", "wood", "powerful"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Cetone V has many facets to its character and thus has many uses. It blends very well with ionones, citrus notes, lavender, fruity, woody and oriental accords where it adds body and excellent diffusion.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Citrathal™ Conc S",
			cas: ["147060-73-9"],
			otherNames: [
				"Citrathal™ Conc S",
				"Citrathal™ Concentrate S TW",
				"Citrathal™ Tech",
				"Citrathal Conc S",
				"Citrathal Concentrate S TW",
				"Citrathal Tech",
			],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/citrathaltm-conc-s",
						nameUsed: "Citrathal™ Conc S",
						notes: ["citrus", "lime", "lemon", "clean", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Citrathal™ Conc S has a distinctive clean-fresh, lemon-lime character and is one of the more chemically stable citrus materials. Citrathal™ is available in three grades.",
						],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/citrathaltm-concentrate-s-tw",
						nameUsed: "Citrathal™ Concentrate S TW",
						notes: ["citrus", "lime", "lemon", "clean", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Citrathal™ Concentrate S TW has a distinctive clean-fresh, lemon-lime character and is one of the more chemically stable citrus materials. Citrathal™ is available in three grades.",
						],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/citrathaltm-tech",
						nameUsed: "Citrathal™ Tech",
						notes: ["citrus", "lime", "lemon", "clean", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Citrathal™ Tech has a distinctive clean-fresh, lemon-lime character and is one of the more chemically stable citrus materials. Citrathal™ is available in three grades.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Cumin Nitrile",
			cas: ["13816-33-6"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cumin-nitrile",
						nameUsed: "Cumin Nitrile",
						notes: ["spicy", "cumin", "green"],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Cumin Nitrile is a spicy cuminic ingredient, with a dry character and a hint of green. It is less pungent than the aldehyde but more stable and tenacious.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Cyclohexyl Salicylate",
			cas: ["25485-88-5"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/cyclohexyl-salicylate",
						nameUsed: "Cyclohexyl Salicylate",
						notes: ["floral", "balsamic", "green", "jasmine"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Cyclohexyl Salicylate has a powerful floral and balsamic note with green inflexions reminiscent of jasmine. It can be used in all type of compositions and is especially useful to create carnation, hyacinth or orchid accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Decatone",
			cas: ["34131-98-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/decatone",
						nameUsed: "Decatone",
						notes: [
							"citrus",
							"grapefruit",
							"wood",
							"fruit",
							"fresh",
							"vetiver",
							"rhubarb",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Decatone has a woody, vetiver, citrus-grapefruit and green-rhubarb character. It can be used in simple citrus accords where it produces contrast and fixation, and in sophisticated perfumes where it is an excellent blender for oakmoss, vetiver, sandalwood and quinolines. It is powerful and long lasting.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Decenal-4-Trans",
			cas: ["65405-70-1", "30390-50-2"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/decenal-4-trans",
						nameUsed: "Decenal-4-Trans",
						notes: [
							"aldehydic",
							"orange",
							"green",
							"floral",
							"powerful",
							"diffusive",
							"fresh",
							"citrus",
						],
						olfactiveFamily: "Aldehydic",
						olfactiveDescription: [
							"Decenal-4-Trans is an exceptionally powerful and diffusive chemical. Used mainly as a top note ingredient, it produces a fresh, natural, citrus-orange effect, imparting tremendous lift.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Dihydro Ambrate",
			cas: ["37172-02-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/dihydro-ambrate",
						nameUsed: "Dihydro Ambrate",
						notes: ["amber", "wood", "warm", "diffusive"],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Dihydro Ambrate gives richness and balance to compounds, strengthening them and adding warmth and fullness. It can also be used as a diffusive woody note.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Dihydro Ionone Beta",
			cas: ["17283-81-7"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/dihydro-ionone-beta",
						nameUsed: "Dihydro Ionone Beta",
						notes: ["wood", "floral", "orris", "amber", "fruit"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Dihydro Ionone Beta, a less well-known member of the ionone family, is increasingly used for its original woody and slightly ambery character. It brings a rich sophisticated volume to perfumes in combination with floral elements.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Dupical",
			cas: ["30168-23-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/dupical",
						nameUsed: "Dupical",
						notes: ["floral", "green", "muguet", "fresh", "transparent"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Dupical is a powerful, fresh, transparent aldehydic muguet. It is a wonderful modifier and enhancer of the muguet character in a fragrance. It can be used across all applications thanks to its high performance.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ebanol™",
			cas: ["67801-20-1"],
			otherNames: ["Ebanol"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ebanoltm",
						nameUsed: "Ebanol™",
						notes: ["wood", "sandalwood", "musk", "powerful"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Ebanol™ has a very rich, natural sandalwood odour. It is powerful and intense, bringing volume and elegance to woody accords and a diffusive sandalwood effect to compositions. Ebanol™ is highly substantive on all supports.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Elintaal",
			cas: ["40910-49-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/elintaal",
						nameUsed: "Elintaal",
						notes: ["floral", "green", "muguet", "fresh", "herb"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Elintaal has a natural and fresh muguet note with herbaceous undertones.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ethyl Linalool",
			cas: ["10339-55-6"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ethyl-linalool",
						nameUsed: "Ethyl Linalool",
						notes: ["floral", "fresh", "bergamot"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Ethyl Linalool has a floral, fresh, bergamot character and is sweeter and less agrestic than Linalool. As with Linalool, it is used in a wide variety of notes for floral bouquets.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ethyl Linalyl Acetate",
			cas: ["61931-80-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ethyl-linalyl-acetate",
						nameUsed: "Ethyl Linalyl Acetate",
						notes: [
							"citrus",
							"bergamot",
							"fruit",
							"pear",
							"fresh",
							"elegant",
							"floral",
							"soft",
							"elegant",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Ethyl Linalyl Acetate is softer, more floral, more bergamot and less lavender than Linalyl Acetate. It has an elegant, refreshing effect in floral bouquets.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ethyl Methyl-2-Butyrate",
			cas: ["7452-79-1"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ethyl-methyl-2-butyrate",
						nameUsed: "Ethyl Methyl-2-Butyrate",
						notes: ["fruit", "green", "apple", "pineapple skin", "diffusive"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Ethyl Methyl-2-Butyrate has a very diffusive fruity effect that serves as a modifier in floral accords or in combination with fruity esters.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Ethyl Safranate",
			cas: ["35044-59-8", "35044-57-6", "35044-58-7"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/ethyl-safranate",
						nameUsed: "Ethyl Safranate",
						notes: ["floral", "rose", "fruit", "apple", "spicy", "diffusive"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Ethyl Safranate is a complex diffusive spicy rose note with apple cider and spicy aspects. This rich and versatile ingredient is used in a wide range of fragrance types, from floral through to fruity, particularly apple. Ethyl Safranate gives body and radiance in fine fragrance and toiletries, but is also unexpectedly stable in detergents, thus broadening the possibilities for use.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Florhydral™",
			cas: ["125109-85-5"],
			otherNames: ["Florhydral"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/florhydraltm",
						nameUsed: "Florhydral™",
						notes: [
							"floral",
							"green",
							"muguet",
							"fresh",
							"powerful",
							"lily of the valley",
							"hyacinth",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Florhydral™ has a very floral, fresh, natural odour (such as lily of the valley, hyacinth...). Its great intensity and pleasant quality make it useful in all areas of perfumery. Florhydral™ is also valuable in fragrances for laundry products where a fresh residual odour is desired. Florhydral™ gives natural volume together with aldehydes in citrus accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Florocyclene",
			cas: ["68912-13-0", "17511-60-3"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/florocyclene",
						nameUsed: "Florocyclene",
						notes: [
							"floral",
							"green",
							"fruit",
							"sweet",
							"jasmine",
							"anise",
							"soft",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Florocyclene has a sweet fruity floral note with aspects of jasmine and anise. This is the propionate ester of the cyclene family, and is much softer than Jasmacyclene. It works well in combination with the other cyclenes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Florosa",
			cas: ["63500-71-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/florosa",
						nameUsed: "Florosa",
						notes: ["floral", "muguet", "sweet", "cream"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Florosa has a creamy floral muguet note. It is commonly used in combination with muguet aldehydes such as Bourgeonal and Dupical. It is a general floraliser and can be taken in a number of different odour directions from herbal through floral to citrus.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Freskomenthe™",
			cas: ["14765-30-1"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/freskomenthetm",
						nameUsed: "Freskomenthe™",
						notes: ["herbal", "mint", "fresh", "wood"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Freskomenthe™ adds an element of freshness to a wide range of accords, including lavender, citrus, aromatic, geranium and green notes. It contributes to a unique cooling effect in powder detergent, without becoming overly minty. Freskomenthe™ can be used to modify a typical mint character and suggest peppermint in a blend containing none of the natural mint. Very stable in all applications, including bleach.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Frutonile",
			cas: ["69300-15-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/frutonile",
						nameUsed: "Frutonile",
						notes: ["fruit", "peach", "lactonic", "intense"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Frutonile has an intense peach character with lactonic undertones. It is stable across the whole pH range, allowing the perfumers to create a stable fruity effect at low concentration in any applications, including bleach system.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Gardamide",
			cas: ["84434-18-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/gardamide",
						nameUsed: "Gardamide",
						notes: [
							"citrus",
							"grapefruit",
							"rhubarb",
							"zest",
							"crisp",
							"fresh",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Gardamide is a zesty grapefruit citrus heart note, with aspects of crisp rhubarb. It works well with other citrus and earthy green notes. Gardamide increases in strength over the first few hours, giving a long lasting citrus freshness to a fragrance.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Gardocyclene",
			cas: ["67634-20-2"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/gardocyclene",
						nameUsed: "Gardocyclene",
						notes: ["fruit", "green", "floral"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Gardocyclene is a fruity floral and slightly green material, less anise-like than the other cyclenes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Geranodyle",
			cas: ["42822-86-6", "50373-36-9"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/geranodyle",
						nameUsed: "Geranodyle",
						notes: [
							"floral",
							"geranium",
							"rose",
							"fruit",
							"fresh",
							"diffusive",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Geranodyle is a complex mixture with a fresh geranium odour. A top note ingredient, it has good diffusivity and increases the fruity character of compositions.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Givescone™",
			cas: ["57934-97-1", "77851-07-1"],
			otherNames: ["Givescone"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/givesconetm",
						nameUsed: "Givescone™",
						notes: ["floral", "rose", "spicy", "fruit", "wood", "herb"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Givescone™ is used where real innovation is required. It has a complex odour picture, with floral, spicy, fruity, woody and even herbaceous nuances. It blends particularly well with rose, carnation, aldehydes, chypre and fougère, and with aromatic and spicy notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Glycolierral",
			cas: ["68901-32-6", "94087-23-7"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/glycolierral",
						nameUsed: "Glycolierral",
						notes: ["floral", "green", "ivy leaves", "wood", "milk", "soft"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Glycolierral offers a soft, green, milky nuance when used as a green top note modifier. It fits very well with green floral fruity concepts and especially fig accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Gyrane",
			cas: ["24237-00-1", "24237-01-2", "24237-02-3"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/gyrane",
						nameUsed: "Gyrane",
						notes: ["floral", "geranium", "green", "spicy"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Gyrane is a radiant green floral with spicy geranium aspects. It supports the fresh green top-notes of a fragrance, and works well with materials such as Cyclal C, NeoFolione™ and cis-3 hexenol derivatives.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Herboxane",
			cas: ["54546-26-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/herboxane",
						nameUsed: "Herboxane",
						notes: [
							"herbal",
							"green",
							"spicy",
							"fresh",
							"basil",
							"sweet red pepper",
						],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Herboxane is a spicy whilst distinctively herbal note particularly basil, reminiscent of sweet red pepper. Herboxane adds a distinctive freshness to a fragrance. It is also very stable in detergent powders with bleaching system.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Hexyl Acetate",
			cas: ["142-92-7"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/hexyl-acetate",
						nameUsed: "Hexyl Acetate",
						notes: ["fruit", "green", "pear", "floral"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Hexyl Acetate has a fruity green note reminiscent of pear with floral facets. It can be used in all type of compositions and is a very useful top note in fresh and fruity accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Indolene 50%/CSO",
			cas: ["68908-82-7", "8001-79-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/indolene-50cso",
						nameUsed: "Indolene 50%/CSO",
						notes: ["floral", "animalic", "jasmine"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Indolene 50% has a floral animalic note. It is very useful to extend the natural jasmin character of a composition.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Irisone™ Alpha",
			cas: ["127-41-3", "8013-90-9"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/irisonetm-alpha",
						nameUsed: "Irisone™ Alpha",
						notes: [
							"floral",
							"orris",
							"violet",
							"wood",
							"balsam",
							"pine",
							"citrus",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Irisone™ Alpha is used widely in perfume compositions mainly in woody, floral, balsamic, piney or citrus notes for its high substantivity. It is also know to bring an interesting twist to rose accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Irisone™ Pure",
			cas: ["127-41-3", "8013-90-9", "14901-07-6"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/irisonetm-pure",
						nameUsed: "Irisone™ Pure",
						notes: [
							"floral",
							"orris",
							"violet",
							"fruit",
							"wood",
							"powerful",
							"rich",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Irisone™ Pure is of high interest for its powerful, rich, floral-violet character. It is easy to blend with many floral, woody, aldehydic, fruity and chypre accords. Sweeter than Irisone™ Alpha, this grade of ionone has an excellent price-performance ratio and an excellent substantivity in functional fragrances.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Irone Alpha",
			cas: ["79-69-6"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/irone-alpha",
						nameUsed: "Irone Alpha",
						notes: ["floral", "orris", "wood", "rich", "violet"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Irone Alpha has a rich, floral and natural character and constitutes an important element in orris and violet compositions as well as being useful when an exotic nuance is required. Irone Alpha is extremely diffusive and gives volume and tenacity to compositions",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isobutavan",
			cas: ["20665-85-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isobutavan",
						nameUsed: "Isobutavan",
						notes: [
							"gourmand",
							"vanilla",
							"sweet",
							"fruit",
							"cream",
							"white chocolate",
							"cream soda",
							"apricot",
							"soft",
						],
						olfactiveFamily: "Gourmand",
						olfactiveDescription: [
							"Isobutavan has a sweet and creamy vanillic character reminiscent of white chocolate, cream soda with a soft apricot feeling. Isobutavan is much less discolouring than vanillin or ethyl vanillin and can be used at levels up to 2% including in toilet soap fragrances before discolouration becomes a problem. It is less powdery than vanillin and has a more creamy effect.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isobutyl Quinoline-2",
			cas: ["93-19-6"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isobutyl-quinoline-2",
						nameUsed: "Isobutyl Quinoline-2",
						notes: ["leather", "wood", "powerful", "intense"],
						olfactiveFamily: "Leather - Moss",
						olfactiveDescription: [
							"Isobutyl Quinoline-2 is widely used in masculine colognes for its vibrant, intense leathery character. It combines nicely in chypre, leathery and woody accords where it is extremely powerful and long lasting.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isojasmone B 11",
			cas: ["95-41-0"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isojasmone-b-11",
						nameUsed: "Isojasmone B 11",
						notes: ["floral", "jasmine", "aromatic", "warm"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Isojasmone B 11 is widely used in jasmine and floral bouquets for its powerful and natural volume effect to top and heart notes. It also blends nicely with quinolines in chypre accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isolongifolanone",
			cas: ["23787-90-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isolongifolanone",
						nameUsed: "Isolongifolanone",
						notes: ["wood", "amber", "dry", "fresh", "diffusive"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Isolongifolanone has a fresh woody note, dry and diffusive with rich amber quality.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isomenthone DL",
			cas: ["491-07-6", "89-80-5"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isomenthone-dl",
						nameUsed: "Isomenthone DL",
						notes: [
							"herbal",
							"aromatic",
							"green",
							"mint",
							"fresh",
							"peppermint",
						],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Isomenthone DL has a a fresh and aromatic herbal note with green inflexions reminiscent of peppermint. It can be used in fresh, minty, agrestic or fougere composition as well as in lavender or geranium accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isopropyl Methyl-2-Butyrate",
			cas: ["66576-71-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isopropyl-methyl-2-butyrate",
						nameUsed: "Isopropyl Methyl-2-Butyrate",
						notes: [
							"fruit",
							"pear",
							"pineapple",
							"green",
							"diffusive",
							"apple",
						],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Isopropyl Methyl-2-Butyrate is used for green-fruity accords like pear and apple. It provides significant freshness to perfumes in combination with floral elements.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Isopropyl Quinoline",
			cas: ["135-79-5", "6457-30-3"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/isopropyl-quinoline",
						nameUsed: "Isopropyl Quinoline",
						notes: ["leather", "wood", "moss"],
						olfactiveFamily: "Leather - Moss",
						olfactiveDescription: [
							"Isopropyl Quinoline is an indispensable element in the formulation of masculine notes, where it blends very well with mossy vetiver, chypre and tobacco accords, as well as with animal and spicy types. It is a rich and vibrant material which leads to great originality in compounds. Its influence is constant throughout the evaporation of a fragrance and gives volume, strength and diffusion.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmacyclene",
			cas: ["54830-99-8", "2500-83-6", "5413-60-5"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmacyclene",
						nameUsed: "Jasmacyclene",
						notes: ["floral", "green", "fruit"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmacyclene is the acetate ester of the cyclene family with the typical fruity anisic floral note of the family. Jasmacyclene gives to floral accords an attractive green fruity volume with a sweet anise and woody background.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmatone",
			cas: ["13074-65-2"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmatone",
						nameUsed: "Jasmatone",
						notes: ["floral", "jasmine", "fruit"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmatone has a floral aromatic jasmine note, diffusive and warm with a hint of fruit. It can be considered as a very good floraliser, suitable for jasmine, floral and fruity fragrances. It has good chemical stability and is particularly effective in toilet soaps.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmone Cis",
			cas: ["488-10-8"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmone-cis",
						nameUsed: "Jasmone Cis",
						notes: ["floral", "jasmine", "green", "warm"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmone Cis is widely used in the creation of high quality florals like jasmine and tuberose. Also used in the reconstitutions of essential oils.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmonyl™ LG",
			cas: ["18871-14-2", "38285-49-3"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmonyltm-lg",
						nameUsed: "Jasmonyl™ LG",
						notes: ["floral", "jasmine", "lactonic", "mushroom", "diffusive"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmonyl LG is used in many types of compositions for its lactonic jasmine effect. It also has a mushroom-like facet that blends well with lavender. It enhances and improves the diffusion of compositions, particularly in fragrances designed for soaps.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmonyl™",
			cas: ["18871-14-2", "63270-14-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmonyltm",
						nameUsed: "Jasmonyl™",
						notes: ["floral", "jasmine", "lactonic", "mushroom", "diffusive"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmonyl™ is used in many perfume types for its lactonic jasmine effect. It also possesses a mushroom-like note that blends well with lavender. Jasmonyl™ enhances and improves the diffusion of most fragrances, particularly in perfumes designed for soap.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmopyrane Forte",
			cas: ["18871-14-2"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmopyrane-forte",
						nameUsed: "Jasmopyrane Forte",
						notes: [
							"floral",
							"jasmine",
							"aromatic",
							"sweet",
							"herb",
							"rich",
							"tea",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmopyrane Forte has a floral jasmine note with a rich sweet herbaceous character and hints of tea. Jasmopyrane Forte is a broader-cut, lower cost option that is slightly more tenacious and has a more pronounced green mushroom.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Jasmopyrane",
			cas: ["18871-14-2"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/jasmopyrane",
						nameUsed: "Jasmopyrane",
						notes: [
							"floral",
							"jasmine",
							"aromatic",
							"rich",
							"sweet",
							"herb",
							"tea",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Jasmopyrane has a floral jasmine note with a rich sweet herbaceous character and hints of tea. Jasmopyrane Forte is a broader-cut, lower cost option that is slightly more tenacious and has a more pronounced green mushroom.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Javanol™ Super",
			cas: ["198404-98-7"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/javanoltm-super",
						nameUsed: "Javanol™ Super",
						notes: [
							"wood",
							"sandalwood",
							"warm",
							"cream",
							"lactonic",
							"cedarwood",
						],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Javanol™ Super is a new quality of Javanol™. It has a rich natural sandalwood creamy note, enhancing the lactonic cedarwood facets, while Javanol™ enhance fresh rosy powdery facets. Javanol™ and Javanol™ Super have a similar richness and power, which make them ones of the most powerful Sandalwood molecules.",
						],
					},
				},
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/javanol",
						nameUsed: "Javanol™",
						notes: ["wood", "sandalwood", "cream", "rose", "powerful"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Javanol™ is the latest generation of sandalwood molecule with unprecedented power and substantivity. It has a rich, natural, creamy sandalwood note like beta santanol combined with some rosy nuances. It can also be used at very low dosage (below 0.1%) to bring richness and creaminess to all types of accords. With its exceptional low threshold, Javanol™ is approximately 8 times more effective in wash tests than the most powerful sandalwood product. Its very good stability, mainly due to the complete absence of double bond, makes it suitable for all applications except bleach.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Kephalis",
			cas: ["36306-87-3"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/kephalis",
						nameUsed: "Kephalis",
						notes: ["wood", "amber", "tobacco", "rich"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Kephalis is a very versatile and rich product, used as a long lasting heart and base notes. It blends well with floral notes (jasmine, rose, violet, lavender, etc.) as well as sophisticated ambery, woody-aldehydic, tobacco and masculine creations.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Lemonile™",
			cas: ["61792-11-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/lemoniletm",
						nameUsed: "Lemonile™",
						notes: ["citrus", "lemon", "intense", "fresh", "diffusive"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Lemonile™ is used in lemon, verbena and lime compositions where it imparts freshness and diffusion. This nitrile is an extremely powerful chemical and has excellent stability in alkaline media. More natural and long lasting than Geranitrile.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Lime Oxide",
			cas: ["73018-51-6"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/lime-oxide",
						nameUsed: "Lime Oxide",
						notes: ["citrus", "lime", "green", "aromatic", "fresh", "powerful"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Lime Oxide adds freshness and intensity to perfumes designed for functional products. It is also a powerful citrus booster with excellent stability in many applications, including bleach.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Limetol",
			cas: ["7392-19-0"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/limetol",
						nameUsed: "Limetol",
						notes: ["herbal", "camphor", "wood", "lime", "pine needle"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Limetol is used where a lemon-woody note is desired. It also offers pine needle and lime nuances.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalool Oxide",
			cas: ["1365-19-1", "60047-17-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalool-oxide",
						nameUsed: "Linalool Oxide",
						notes: ["herbal", "pine", "floral", "fresh", "sweet", "earth"],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Linalool Oxide is a fresh, sweet material which is very useful for its ability to give additional lift to floral accords. It also has a fresh earthy quality which makes it invaluable in reconstitutions of essential oils. It blends harmoniously with patchouli in chypre accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalyl Benzoate",
			cas: ["126-64-7"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalyl-benzoate",
						nameUsed: "Linalyl Benzoate",
						notes: ["floral", "tuberose", "warm", "soft"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Linalyl Benzoate has a beautiful floral, tuberose character. It blends extremely well in oriental and floral types where its use gives warmth and softness.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalyl Cinnamate",
			cas: ["78-37-5"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalyl-cinnamate",
						nameUsed: "Linalyl Cinnamate",
						notes: ["floral", "fruit", "balsamic", "sweet"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Linalyl Cinnamate gives a sweet natural effect to floral, fruity and oriental compositions. It is ideal for use in delicate floral accords where it acts as a blending agent and as a fixative.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalyl Formate",
			cas: ["115-99-1"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalyl-formate",
						nameUsed: "Linalyl Formate",
						notes: ["citrus", "bergamot", "green", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Linalyl Formate introduces freshness and lift to the top note of citrus and lavender fragrances. It helps to combine the fruity character of Linalyl Acetate with the fatty notes of the aldehydes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalyl Isobutyrate",
			cas: ["78-35-3"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalyl-isobutyrate",
						nameUsed: "Linalyl Isobutyrate",
						notes: ["fruit", "fresh", "lavender"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Linalyl Isobutyrate has a natural, fresh character which enhances the top note of many compositions, especially lavender, cologne and fruity blends. Its modifying action is also much appreciated in various floral bases such as lilac. It is also a useful component in synthetic bergamots.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Linalyl Propionate",
			cas: ["144-39-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/linalyl-propionate",
						nameUsed: "Linalyl Propionate",
						notes: [
							"herbal",
							"lavender",
							"bergamot",
							"fruit",
							"clean",
							"fresh",
						],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Linalyl Propionate falls into the category of modern bergamot-lavender notes. A pronounced fruity nuance distinguishes it from Linalyl Acetate. Its excellent stability and intensive clean, fresh character make it ideal for use in fragrances designed for functional products.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Maceal",
			cas: ["68259-31-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/maceal",
						nameUsed: "Maceal",
						notes: [
							"green",
							"fresh",
							"herbal",
							"powerful",
							"nutmeg",
							"spicy",
							"tree bark",
						],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Maceal has an intensely powerful, fresh green note, with a hint of spicy nutmeg. It is best used as a 10% dilution where its natural, green, tree bark character is highlighted. Maceal can be used at this dilution in most product types to give a powerful boost to the fresh top note, particularly in green florals.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Madrox™",
			cas: ["37514-30-0"],
			noteType: "mid(heart)",
			otherNames: ["Madrox"],
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/madroxtm",
						nameUsed: "Madrox™",
						notes: ["wood", "amber", "tobacco", "warm", "ambergris"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Madrox™ is extremely useful in woody, fougere and chypre compositions, where it imparts an interesting ambergris note. Used as a main constituent, it blends the top notes and strengthens the body of a fragrance.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Manzanate",
			cas: ["39255-32-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/manzanate",
						nameUsed: "Manzanate",
						notes: ["fruit", "apple", "pineapple", "cider", "sweet"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Manzanate has a fruity ripe apple character with aspects of cider and sweet pineapple. It brings a great impact and bloom in water-contact products.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Mefranal",
			cas: ["55066-49-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/mefranal",
						nameUsed: "Mefranal",
						notes: [
							"citrus",
							"aldehydic",
							"geranium",
							"lemon",
							"fresh",
							"floral",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Mefranal has a refreshing lemon geranium note with an aldehydic floral heart.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Anthranilate Extra",
			cas: ["134-20-3"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-anthranilate-extra",
						nameUsed: "Methyl Anthranilate Extra",
						notes: ["floral", "neroli", "sweet", "warm"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Methyl Anthranilate Extra is extensively used in many types of floral blends such as neroli and orange blossom, as well as in exotic compositions, gardenia, tuberose and jasmine, Methyl Anthranilate Extra imparts warmth, volume and sweetness and is used in all types of perfumery.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Diantilis™",
			cas: ["5595-79-9"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-diantilistm",
						nameUsed: "Methyl Diantilis™",
						notes: ["spicy", "carnation", "vanilla", "sweet", "elegant"],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Methyl Diantilis™ is an elegant, spicy, sweet ingredient with a similar olfactive profile to Isoeugenol, but with an additional powdery aspect reminiscent of carnation (Dianthus caryophyllus). Unlike Isoeugenol, it is much less susceptible to discolouration and is not restricted by IFRA.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Heptenone Pure",
			cas: ["110-93-0"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-heptenone-pure",
						nameUsed: "Methyl Heptenone Pure",
						notes: ["citrus", "lemongrass", "green", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Methyl Heptenone Pure is used to provide a natural green freshness to agrestic or hesperidic top notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Laitone 10%/DPG",
			cas: ["94201-19-1", "91069-37-3", "25265-71-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-laitone-10dpg",
						nameUsed: "Methyl Laitone 10%/DPG",
						notes: ["fruit", "coconut milk", "lactonic", "cream", "powerful"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Methyl Laitone 10% is one of the new spiro-lactones developed and patented by Givaudan. It is extremely powerful and very effective in all accords where a creamy, fruity volume is required. Methyl Laitone 10% provides cosmetic body to white flower notes such as jasmine, gardenia, tuberose and ylang ylang, and to fruity accords like peach and osmanthus. It provides milkiness to sandalwood accords and combines nicely with coumarin and tonka notes. Good substantivity on humid and dry fabric.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Pharaone™ 10%/DPG",
			cas: ["25265-71-8", "313973-37-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/pharaonetm-10dpg",
						nameUsed: "Pharaone™ 10%/DPG",
						notes: [
							"green",
							"fruit",
							"pineapple",
							"aromatic",
							"diffusive",
							"powerful",
							"fresh",
						],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Pharaone™ 10%/DPG has a new fruity green, natural aspect which adds value to both consumer products and fine fragrance creation. It is extremely powerful and diffusive. It gives freshness and lift to the top and mid notes. It is suitable in all kind of accords, especially citrus, floral, fruity, green, woody, agrestic and fougere.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Sclarene 80%/DPG",
			cas: ["94201-19-1", "91069-37-3", "25265-71-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/sclarene-80dpg",
						nameUsed: "Sclarene 80%/DPG",
						notes: [
							"wood",
							"dry",
							"amber",
							"strong",
							"warm",
							"metallic",
							"camphor",
						],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Sclarene brings a strong dry woody note with camphor and warm metallic undertones. It can be used in small quantity with musky and ambery notes such as Ambrofix to bring warm and metallic facets. Sclarene is also often considered as a musk booster as it shows interesting musky facets with good substantivity and fixative properties without being musky. Sclarene is commonly used at low dosages below 1% but can be overdosed to bring very unique signature to the fragrance.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Pamplemousse",
			cas: ["67674-46-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-pamplemousse",
						nameUsed: "Methyl Pamplemousse",
						notes: ["citrus", "grapefruit peel", "fresh", "bitter"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Methyl Pamplemousse, with its fresh bitterness, blends very well with citrus bases. It can also be used as a booster for vetiver accords. Methyl Pamplemousse is a key ingredient in modern colognes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Methyl Tuberate Pure",
			cas: ["33673-62-0", "35205-76-6"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/methyl-tuberate-pure",
						nameUsed: "Methyl Tuberate Pure",
						notes: ["floral", "tuberose", "lactonic", "powerful"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Methyl Tuberate Pure is a powerful modifier in all kinds of floral accords. The characteristic note of Methyl Tuberate Pure imparts a natural touch of white flower, such as tuberose and gardenia. It can be used effectively in combination with fruity lactones to provide lift.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Musk R1",
			cas: ["3391-83-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/musk-r1",
						nameUsed: "Musk R1",
						notes: ["musk", "powder", "sensual", "cream", "sophisticated"],
						olfactiveFamily: "Musky",
						olfactiveDescription: [
							"Musk R1 is a sensual, sophisticated, creamy, powdery macrocyclic musk. It gives an exalting effect when used in combination with other macrocyclic musks.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Nectaryl",
			cas: ["95962-14-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/nectaryl",
						nameUsed: "Nectaryl",
						notes: ["fruit", "peach", "apricot", "lactonic", "sophisticated"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Nectaryl produces a natural, fruity and sophisticated note in fine fragrance. Its stability and substantivity makes it valuable as a lactonic element in powder detergent.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Orcinyl 3",
			cas: ["3209-13-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/orcinyl-3",
						nameUsed: "Orcinyl 3",
						notes: ["leather", "oakmoss", "sweet", "phenolic"],
						olfactiveFamily: "Leather - Moss",
						olfactiveDescription: [
							"Orcinyl 3 brings a typical oakmoss note reinforcing the character of this absolute in all compounds. It can be used in combination with Evernyl as the heart of an oakmoss substitute. It blends very well with chypre, leather, woody and tobacco accords.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Oxyoctaline Formate",
			cas: ["65405-72-3"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/oxyoctaline-formate",
						nameUsed: "Oxyoctaline Formate",
						notes: ["wood", "amber", "rich", "elegant"],
						olfactiveFamily: "Woody",
						olfactiveDescription: [
							"Oxyoctaline Formate has an original, ambery and long lasting character, blending very well with most woody notes. Its richness and elegance allow perfect harmony with natural woody products bringing an interesting olibanum effect.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Paradisamide™",
			cas: ["406488-30-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/paradisamidetm",
						nameUsed: "Paradisamide™",
						notes: [
							"tropical fruit",
							"guava",
							"grapefruit",
							"rhubarb",
							"cassis",
						],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Paradisamide™ is a long lasting, fresh tropical fruit note of guava and passion fruit with nuances of grapefruit, rhubarb and cassis. Paradisamide™ can be overdosed in tropical fruit accords up to 20% or use at lower dosage to give a tropical juicy twist to other fruity notes. It is also often used to bring bloom in shampoo and shower gels.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Pelargene",
			cas: ["30310-41-9", "68039-41-8", "68039-40-7"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/pelargene",
						nameUsed: "Pelargene",
						notes: ["floral", "geranium", "crushed leaves"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Pelargene has a powerful geranium character, reminiscent of crushed leaves. It adds substantivity and body, particularly to floral fragrances, especially rose and geranium.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Petiole",
			cas: ["68039-47-4"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/petiole",
						nameUsed: "Petiole",
						notes: [
							"green",
							"floral",
							"hyacinth",
							"powerful",
							"rose",
							"watercress",
						],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Petiole is a green and powerful ingredient, with floral shades of hyacinth and rose, and a hint of watercress. It gives a natural green freshness to top notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Pivacyclene",
			cas: ["68039-44-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/pivacyclene",
						nameUsed: "Pivacyclene",
						notes: ["fruit", "peach", "green", "soft"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Pivacyclene is part of the cyclene family and offers a dry fruity peach note with a fresh green softness. It works well with the other cyclenes as a modifier around 1% in soaps and detergents. Also ideal for cosmetics and toiletries at 5% or above if fragrance character allows. It is often used in combination with gamma-lactones to soften the fatty aspects.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Pivarose",
			cas: ["67662-96-8"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/pivarose",
						nameUsed: "Pivarose",
						notes: [
							"floral",
							"rose",
							"fruit",
							"tea",
							"balsamic",
							"honey",
							"sweet",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Pivarose is a floral tea-rose note with a fruity balsamic character and a hint of honey sweetness. It is a useful modifier of the more common rose alcohols and esters.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Rhubafuran",
			cas: ["82461-14-1", "99343-91-6", "99343-90-5"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/rhubafuran",
						nameUsed: "Rhubafuran",
						notes: [
							"citrus",
							"rhubarb",
							"green",
							"fresh",
							"intense",
							"tangy",
							"eucalyptus",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Rhubafuran has an intense tangy rhubarb character, with a green eucalyptus heart very suitable in fruity and citrus accords. It can be used across all functional fragrances with good performance in air fresheners.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Rosyrane Super",
			cas: ["60335-74-2", "60335-71-9"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/rosyrane-super",
						nameUsed: "Rosyrane Super",
						notes: [
							"floral",
							"rose",
							"geranium",
							"green",
							"intense",
							"diffusive",
							"metallic",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Rosyrane Super has an intense, diffusive rose character with green, geranium and metallic notes. It is particularly suited to be the heart of a very diffusive rose or geranium complex especially in…",
						],
					},
				},
			],
		},
		{
			canonicalName: "Safraleine™",
			cas: ["54440-17-4"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/safraleinetm",
						nameUsed: "Safraleine™",
						notes: [
							"spicy",
							"leather",
							"wood",
							"warm",
							"vibrant",
							"saffron",
							"rose",
						],
						olfactiveFamily: "Spicy",
						olfactiveDescription: [
							"Safraleine™ has a very unique warm and vibrant character offering a new alternative to existing spicy ingredients. Safraleine™ exhibits warm, powerful, leathery and tobacco facets but its complexity also reveals characteristics of spices reminiscent of natural saffron, enriched by rose ketone-like floral aspects.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Spirambrene",
			cas: ["121251-68-1", "121251-67-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/spirambrene",
						nameUsed: "Spirambrene",
						notes: ["amber", "wood", "spicy", "aldehydic", "powerful"],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Spirambrene blends well with sparkling, green, spicy and aldehydic top notes. It is an interesting complement in woody accords for providing a diffusive ambery effect. Due to its high impact, it produces unique and original effects when combined with other woody elements.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Spirogalbanone™ Pure",
			cas: ["224031-70-3", "224031-71-4"],
			otherNames: ["Spirogalbanone Pure"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/spirogalbanone-pure",
						nameUsed: "Spirogalbanone™ Pure",
						notes: ["green", "galbanum", "fruit", "pineapple", "powerful"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Spirogalbanone™ Pure is a powerful, stable and highly substantive green galbanum note combined with fruity facets. Spirogalbanone™ Pure combines nicely with Pharaone™ to build a linear green galbanum effect in the fragrance working from top and heart notes with Pharaone™ down to base notes thanks to the outstanding substantivity of Spirogalbanone™.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Stemone™",
			cas: ["22457-23-4"],
			otherNames: ["Stemone"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/stemonetm",
						nameUsed: "Stemone™",
						notes: ["green", "natural", "leaf", "fresh"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Stemone™ imparts a natural and fresh nuance to fragrance notes such as lily of the valley, narcissus, mandarin, fig leaves, grapefruit, blackcurrant and tomato. It is an excellent modifier that strengthens and modernises green notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Strawberry Pure",
			cas: ["77-83-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/strawberry-pure",
						nameUsed: "Strawberry Pure",
						notes: ["fruit", "strawberry", "powerful"],
						olfactiveFamily: "Fruity",
						olfactiveDescription: [
							"Strawberry Pure is obviously used for strawberry compounds, but this product is also useful in a variety of floral compositions, such as jasmine and rose. Strawberry Pure adds warmth to a fragrance as well as reinforces top notes. It blends particularly well with ionones, hydroxycitronellal, woody notes, aldehydes and fruity lactones.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Syringa Aldehyde 50%",
			cas: ["104-09-6", "699-02-5", "60-12-8"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/syringa-aldehyde-50",
						nameUsed: "Syringa Aldehyde 50%",
						notes: ["floral", "green", "sweet", "powerful"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Syringa Aldehyde is an impactful floral-green note, used as a top note in lilac, hyacinth and rose accords but less pungent than Phenyl Acetaldehyde.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Tangerinol",
			cas: ["3239-35-8", "3239-37-0", "91482-37-0"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/tangerinol",
						nameUsed: "Tangerinol",
						notes: ["citrus", "bitter", "fruit", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Tangerinol blends well with fresh and sparkling compounds thanks to its fresh hesperidic character. Mixed with aldehydes and fruity notes, it gives more natural volume. Tangerinol is also effective as a sandalwood booster in soap.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Tetrahydro Citral",
			cas: ["5988-91-0"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/tetrahydro-citral",
						nameUsed: "Tetrahydro Citral",
						notes: ["citrus", "aldehydic", "sweet", "fresh"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Tetrahydro Citral enhances the citrus effect in colognes. It can partially replace Citral in soap and detergent formulations thanks to its better stability.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Toscanol™",
			cas: ["16510-27-3"],
			otherNames: ["Toscanol"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/toscanoltm",
						nameUsed: "Toscanol™",
						notes: [
							"herbal",
							"anise",
							"green",
							"sweet",
							"spicy",
							"liquorice",
							"sassafras",
							"saffron",
							"myrtle",
							"opoponax",
							"carvi",
						],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Toscanol™ has a powerful and linear anisic, sweet-spicy note of estragole (methyl chavicol), liquorice and sassafras oil character with a touch of saffron, myrtle, opoponax and carvi seeds. Toscanol™ can be used in all kind of accords to add anisic agrestic and aromatic character. Useful in Fine Fragrance and in Consumer Products as a substitute for basil oil, tarragon oil, synthetic estragole (methyl chavicol) and safrole.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Tridecene-2-Nitrile",
			cas: ["22629-49-8"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/tridecene-2-nitrile",
						nameUsed: "Tridecene-2-Nitrile",
						notes: ["citrus", "tangerine", "aldehydic", "powerful"],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Tridecene-2-Nitrile has a powerful citrus, tangerine note with an aldehydic character and a hint of fresh coriander.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Undecavertol",
			cas: ["81782-77-6"],
			noteType: "mid(heart)",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/undecavertol",
						nameUsed: "Undecavertol",
						notes: [
							"floral",
							"violet",
							"green",
							"fresh",
							"lily of the valley",
							"linden blossom",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Undecavertol was developed in connection with structural elucidation work on unknown trace components of lily of the valley. It has a powerful green-floral character, somewhat related to lily-of-the-valley, with natural, fresh, fruity violet leaf and linden-blossom aspects. Undecavertol can be used successfully in rose and fruity pear accords. Although easy to use in most perfumery types, Undecavertol requires careful dosage and blending due to its exceptional strength.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Velvione™",
			cas: ["37609-25-9"],
			otherNames: ["Velvione"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/velvionetm",
						nameUsed: "Velvione™",
						notes: ["musk", "powder", "animalic", "soft"],
						olfactiveFamily: "Musky",
						olfactiveDescription: [
							"Velvione™ is powerful powdery macrocyclic musk with some nitro-musk aspects. It is highly substantive and stable, as well as biodegradable It is excellent in fine fragrance where it adds a powdery volume and musky softness, and in laundry care, where its high substantivity and clean musky note are highly valued.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Verdantiol",
			cas: ["91-51-0"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/verdantiol",
						nameUsed: "Verdantiol",
						notes: ["floral", "linden blossom", "orange blossom", "intense"],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Verdantiol offers an intense floral note to delicate flower type creations, such as neroli, orange blossom, narcissus and frangipani. It provides excellent fixative value on all supports.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Verdoracine",
			cas: ["14374-92-6"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/verdoracine",
						nameUsed: "Verdoracine",
						notes: ["green", "galbanum", "carrot", "earth"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"Verdoracine has a green note with aspects of freshly peeled carrots and dry earthy qualities of galbanum. It can be used in detergents up to 3% to support the green galbanum heart of a fragrance. It can also be used in toiletries and fine fragrances as a 10% dilution at 1% to support earthy, herbaceous notes.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Vernaldehyde™",
			cas: ["66327-54-6", "693252-50-5"],
			otherNames: ["Vernaldehyde"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/vernaldehydetm",
						nameUsed: "Vernaldehyde™",
						notes: [
							"herbal",
							"natural",
							"green",
							"aldehydic",
							"fresh",
							"mountain air",
						],
						olfactiveFamily: "Herbal - Agrestic",
						olfactiveDescription: [
							"Vernaldehyde™ has a fresh, green, mountain air character and blends very well with aldehydic citrus and woody notes. Vernaldehyde™ adds originality to a fragrance and imparts a natural aura. Its unique freshness and diffusion are demonstrated when incorporated into floral blends such as lily of the valley and lilac.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Neobergamate Forte",
			cas: ["69103-01-1"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/neobergamate-forte",
						nameUsed: "Neobergamate Forte",
						notes: [
							"citrus",
							"bergamot",
							"agrestic",
							"fresh",
							"floral",
							"herb",
						],
						olfactiveFamily: "Citrus",
						olfactiveDescription: [
							"Neobergamate Forte has a powerful and fresh citrus bergamot top note combined with a floral, herbaceous heart. It is excellent for adding a fresh citrus lime effect.",
						],
					},
				},
			],
		},
		{
			canonicalName: "NeoFolione™",
			cas: ["111-79-5", "14952-06-8"],
			otherNames: ["NeoFolione"],
			noteType: "high",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/neofolionetm",
						nameUsed: "NeoFolione™",
						notes: ["green", "floral", "fresh", "powerful", "diffusive"],
						olfactiveFamily: "Green",
						olfactiveDescription: [
							"NeoFolione™ blends very well with most floral notes, especially violet, where it is particularly useful in replacing Folione™. It imparts freshness and diffusion and has good stability.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Nympheal™",
			cas: ["1637294-12-2"],
			otherNames: ["Nympheal"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/nympheal",
						nameUsed: "Nympheal™",
						notes: [
							"floral",
							"muguet",
							"cyclamen",
							"diffusive",
							"green",
							"water",
							"linden blossom",
							"white flowers",
							"cream",
						],
						olfactiveFamily: "Floral",
						olfactiveDescription: [
							"Nympheal™ is a diffusive floral cyclamen muguet note with green, watery and linden blossom facets. Nympheal™ imparts white floral watery density and brings a floral creaminess to the composition and high diffusivity.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Okoumal™",
			cas: ["131812-67-4", "131812-52-7", "131812-51-6"],
			otherNames: ["Okoumal"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/fragrance-molecules/okoumaltm",
						nameUsed: "Okoumal™",
						notes: [
							"amber",
							"wood",
							"tobacco",
							"musk",
							"elegant",
							"rich",
							"warm",
						],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Okoumal™ brings an attractive and elegant woody-ambery effect. It gives significant volume, richness and warmth to fragrance compositions and combines well with cedar derivatives, patchouli oil and sandalwood products like Ebanol™. With its low vapour pressure and high MW, Okoumal™ is a heart note and is extremely long lasting and substantive on every support as well as stable in major applications.",
						],
					},
				},
			],
		},
		{
			canonicalName: "Benzoin Powder Resinoid Laos™",
			cas: ["9000-72-0"],
			otherNames: ["Benzoin Powder Resinoid Laos"],
			noteType: "base",
			sources: [
				{
					sourceName: "Givaudan",
					data: {
						url: "https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/benzoin-powder-resinoid-laos",
						nameUsed: "Benzoin Powder Resinoid Laos",
						notes: [
							"balsam",
							"vanilla",
							"resin",
							"wood",
							"sweet",
							"cream",
							"caramel",
							"cinnamon",
							"oriental",
						],
						olfactiveFamily: "Ambery",
						olfactiveDescription: [
							"Benzoin resinoid is woody, vanilla-like, sweet and creamy, it smells sort of like caramel when it starts to set. In the dry down, benzoin resinoid develops interesting cinnamic notes that can last a long time.",
							"Benzoin is used in oriental accords or with floral raw materials such as rose or frangipani. Its cinnamic facet works well with raw materials with animalic and smoky notes, such as those of a tobacco accord.",
						],
					},
				},
			],
		},
	],
};
