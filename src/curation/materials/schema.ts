import { z } from "zod";

const casRegex = /^\d{2,7}-\d{2}-\d$/;
const isoDateTimeSchema = z.string().datetime({ offset: true });

export const distributorIdSchema = z.enum(["olfatorium", "fraterworks"]);

export const producerIdSchema = z.string().min(1);

export const ifraStatusSchema = z.enum([
	"restriction",
	"prohibition",
	"specification",
]);

export const sourceEntrySchema = z.object({
	distributorId: distributorIdSchema,
	notes: z.array(z.string().min(1)),
	producers: z.array(producerIdSchema).optional(),
	url: z.string().url().optional(),
	description: z.string().min(1).optional(),
	extractedAt: isoDateTimeSchema.optional(),
});

export const ifraRuleSchema = z.object({
	status: ifraStatusSchema,
	categoryLimits: z.record(z.string(), z.number().min(0).nullable()).optional(),
	matchNames: z.array(z.string().min(1)).optional(),
	notes: z.array(z.string().min(1)).optional(),
});

export const ifraEntrySchema = z.object({
	pdfUrl: z.string().url().optional(),
	rules: z.array(ifraRuleSchema).min(1),
});

export const ifraGroupSchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
	memberCas: z.array(z.string().regex(casRegex)).min(1),
	materialCanonicalNames: z.array(z.string().min(1)).optional(),
	categoryLimits: z.record(z.string(), z.number().min(0).nullable()),
	rule: z.literal("sum"),
	notes: z.array(z.string().min(1)).optional(),
	pdfUrl: z.string().url().optional(),
});

export const ifraGroupsSchema = z.array(ifraGroupSchema);

export const materialRecordSchema = z.object({
	canonicalName: z.string().min(1),
	cas: z.array(z.string().regex(casRegex)).optional(),
	otherNames: z.array(z.string().min(1)).optional(),
	sources: z.array(sourceEntrySchema).optional(),
	regulatory: z
		.object({
			ifra: ifraEntrySchema.optional(),
		})
		.optional(),
	assets: z
		.object({
			moleculeSvg: z.string().min(1).optional(),
		})
		.optional(),
});

export const curatedMaterialsDatasetMetaSchema = z.object({
	version: z.string().min(1),
	createdAt: isoDateTimeSchema.optional(),
	updatedAt: isoDateTimeSchema.optional(),
});

export const curatedMaterialsDatasetSchema = z.object({
	meta: curatedMaterialsDatasetMetaSchema,
	materials: z.array(materialRecordSchema),
});

export type SourceEntry = z.infer<typeof sourceEntrySchema>;
export type IfraRule = z.infer<typeof ifraRuleSchema>;
export type IfraEntry = z.infer<typeof ifraEntrySchema>;
export type IfraGroup = z.infer<typeof ifraGroupSchema>;
export type MaterialRecord = z.infer<typeof materialRecordSchema>;
export type CuratedMaterialsDatasetMeta = z.infer<
	typeof curatedMaterialsDatasetMetaSchema
>;
export type CuratedMaterialsDataset = z.infer<
	typeof curatedMaterialsDatasetSchema
>;
