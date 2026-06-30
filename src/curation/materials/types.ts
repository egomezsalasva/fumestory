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
	| "Bedoukian"
	| "IFF";

export type ProducerId =
	| "IFF"
	| "Firmenich"
	| "Bedoukian"
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

type CommonSourceData = {
	notes: string[];
};

type SourceDataByName = {
	"Google AI": CommonSourceData;
	Symrise: CommonSourceData & {
		pdfUrl: string;
		nameUsed: string;
	};
	Givaudan: CommonSourceData & {
		url: string;
		nameUsed: string;
	};
	Firmenich: CommonSourceData & {
		url: string;
		nameUsed: string;
	};
	IFF: CommonSourceData & {
		url: string;
		nameUsed: string;
	};
	Fraterworks: CommonSourceData & {
		url: string;
		type?: string;
		featured_image?: string;
		vendor?: string;
	};
	"Scent VN": CommonSourceData & {
		url: string;
		nameUsed: string;
	};
	Bedoukian: CommonSourceData & {
		pdfUrl: string;
		nameUsed: string;
	};
};

export type SourceEntry = {
	// distributorId: distributorId;
	// notes: string[];
	// producers?: ProducerId[];
	// url?: string;
	// description?: string;
	// extractedAt?: string; // ISO datetime
	[K in SourceName]: {
		sourceName: K;
		data: SourceDataByName[K];
	};
}[SourceName];

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
