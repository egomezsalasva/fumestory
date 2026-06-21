// src/curation/materials/types.ts

export type distributorId = "olfatorium" | "fraterworks";

export type ProducerId =
	| "IFF"
	| "Firmenich"
	| "Givaudan"
	| "Symrise"
	| "Mane"
	| "Takasago"
	| "Robertet"
	| (string & {});

export type IfraStatus = "restriction" | "prohibition" | "specification";

export type IfraRule = {
	status: IfraStatus;
	categoryLimits?: Record<string, number | null>;
	matchNames?: string[];
	notes?: string[];
};

export type IfraEntry = {
	pdfUrl?: string;
	rules: IfraRule[];
};

export type IfraGroup = {
	id: string;
	label: string;
	memberCas: string[];
	materialCanonicalNames?: string[];
	categoryLimits: Record<string, number | null>;
	rule: "sum";
	notes?: string[];
	pdfUrl?: string;
};

export type SourceEntry = {
	distributorId: distributorId;
	notes: string[];
	producers?: ProducerId[];
	url?: string;
	description?: string;
	extractedAt?: string; // ISO datetime
};

export type MaterialRecord = {
	canonicalName: string;
	cas?: string[];
	otherNames: string[];
	sources?: SourceEntry[];
	regulatory?: {
		ifra?: IfraEntry;
	};
	assets?: {
		moleculeSvg?: string;
	};
};

export type CuratedMaterialsDatasetMeta = {
	version: string; // dataset version, e.g. "2026-06-20"
	createdAt?: string; // ISO datetime
	updatedAt?: string; // ISO datetime
};

export type CuratedMaterialsDataset = {
	meta: CuratedMaterialsDatasetMeta;
	materials: MaterialRecord[];
};
