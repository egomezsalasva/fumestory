// src/curation/materials/types.ts

export type distributorId = "olfatorium" | "fraterworks";

export type NoteType = "base" | "mid(heart)" | "high";

export type SourceName =
	| "Google AI"
	| "Symrise"
	| "Fraterworks"
	| "Scent VN"
	| "Givaudan"
	| "Firmenich"
	| "IFF";

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

export type SourceData = {
	notes: string[];
	nameUsed?: string;
	url?: string;
	pdfUrl?: string;
	type?: string;
	featured_image?: string;
	vendor?: string;
};

export type SourceEntry = {
	// distributorId: distributorId;
	// notes: string[];
	// producers?: ProducerId[];
	// url?: string;
	// description?: string;
	// extractedAt?: string; // ISO datetime
	sourceName: SourceName;
	data: SourceData;
};

export type MaterialRecord = {
	canonicalName: string;
	cas?: string[];
	otherNames: string[];
	noteType: NoteType;
	sources: SourceEntry[];
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
