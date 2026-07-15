import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// assumes you run command from repo root
const repoRoot = process.cwd();

const noteStylesPath = path.join(__dirname, "note-dot-styles.ts");
const dataFilePath = path.join(repoRoot, "src/curation/materials/data/data.ts");

if (!fs.existsSync(dataFilePath)) {
	throw new Error(`Data file not found: ${dataFilePath}`);
}

const noteModule = await import(pathToFileURL(noteStylesPath).href);
const dataModule = await import(pathToFileURL(dataFilePath).href);

const NOTE_DOT_STYLES = noteModule.NOTE_DOT_STYLES as Record<string, string>;
const normalizeNoteLabel = (
	typeof noteModule.normalizeNoteLabel === "function"
		? noteModule.normalizeNoteLabel
		: (note: string) => note.trim().toLowerCase().replace(/\s+/g, " ")
) as (note: string) => string;

const curatedMaterialsData = dataModule.curatedMaterialsData as {
	materials?: Array<{
		sources?: Array<{
			data?: { notes?: string[] };
		}>;
	}>;
};

const mappedKeySet = new Set(
	Object.keys(NOTE_DOT_STYLES).map((k) => normalizeNoteLabel(k)),
);

const dataNoteSet = new Set<string>();

for (const material of curatedMaterialsData.materials ?? []) {
	for (const source of material.sources ?? []) {
		for (const note of source.data?.notes ?? []) {
			dataNoteSet.add(normalizeNoteLabel(String(note)));
		}
	}
}

const mapped = [...mappedKeySet].sort((a, b) => a.localeCompare(b));
const missing = [...dataNoteSet]
	.filter((note) => !mappedKeySet.has(note))
	.sort((a, b) => a.localeCompare(b));
const unused = [...mappedKeySet]
	.filter((key) => !dataNoteSet.has(key))
	.sort((a, b) => a.localeCompare(b));

function printList(title: string, list: string[]) {
	console.log(`\n${title} (${list.length})`);
	if (list.length === 0) {
		console.log("- none");
		return;
	}
	for (const item of list) console.log(`- ${item}`);
}

console.log(`Using data file: ${path.basename(dataFilePath)}`);
console.log(`Mapped keys: ${mapped.length}`);
console.log(`Unique notes in data: ${dataNoteSet.size}`);
console.log(`Missing: ${missing.length}`);
console.log(`Unused mapped keys: ${unused.length}`);

printList("Mapped keys", mapped);
printList("Missing keys (in data, not mapped)", missing);
printList("Unused mapped keys (mapped, not in data)", unused);

// Optional: sort NOTE_DOT_STYLES in-place
if (process.argv.includes("--write")) {
	const src = fs.readFileSync(noteStylesPath, "utf8");

	const sortedEntries = Object.entries(NOTE_DOT_STYLES).sort(([a], [b]) =>
		normalizeNoteLabel(a).localeCompare(normalizeNoteLabel(b)),
	);

	const formatKey = (key: string) =>
		/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);

	const sortedBlock = [
		"export const NOTE_DOT_STYLES: Record<string, string> = {",
		...sortedEntries.map(
			([key, value]) => `\t${formatKey(key)}: ${JSON.stringify(value)},`,
		),
		"};",
	].join("\n");

	const pattern =
		/export const NOTE_DOT_STYLES: Record<string, string> = \{[\s\S]*?\n\};/;

	if (!pattern.test(src)) {
		throw new Error(
			"Could not find NOTE_DOT_STYLES block to replace in note-dot-styles.ts",
		);
	}

	const next = src.replace(pattern, sortedBlock);
	fs.writeFileSync(noteStylesPath, next, "utf8");
	console.log("\nSorted NOTE_DOT_STYLES alphabetically and wrote file.");
}
