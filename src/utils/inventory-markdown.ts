import type { RawMaterial } from "@/routes/api.raw-materials";
import { toTitleCaseWords } from "@/utils/display-names";

export type InventoryCopyOptions = {
	showCas: boolean;
	showMaterialNature: boolean;
	showNoteType: boolean;
	showCategory: boolean;
	showNotes: boolean;
	showDilutions: boolean;
	includeGuestFeedbackInNotes: boolean;
};

function formatNotes(m: RawMaterial, includeGuest: boolean): string {
	if (!includeGuest) {
		const list = [...(m.notes ?? [])].sort((a, b) => a.localeCompare(b));
		return list.length ? list.map(toTitleCaseWords).join(", ") : "—";
	}

	const noteCounts = m.aggregated_note_counts ?? {};
	const original = [...(m.notes ?? [])].sort((a, b) => {
		const ca = Number(noteCounts[a] ?? 1);
		const cb = Number(noteCounts[b] ?? 1);
		return cb - ca || a.localeCompare(b);
	});
	const originLower = new Set(original.map((n) => n.toLowerCase()));
	const guest = Object.entries(noteCounts)
		.filter(([note]) => !originLower.has(note.toLowerCase()))
		.sort(
			([nameA, a], [nameB, b]) =>
				Number(b) - Number(a) || nameA.localeCompare(nameB),
		);

	const fmt = (note: string, count?: number) =>
		`${toTitleCaseWords(note)}${count != null && count > 1 ? ` [x${count}]` : ""}`;

	const parts = [
		...original.map((n) => fmt(n, noteCounts[n] ?? 1)),
		...(guest.length
			? [`Guest Feedback: ${guest.map(([n, c]) => fmt(n, c)).join(", ")}`]
			: []),
	];
	return parts.length ? parts.join("; ") : "—";
}

export function buildInventoryMarkdown(
	rows: RawMaterial[],
	opts: InventoryCopyOptions,
): string {
	const blocks = rows.map((m) => {
		const lines: string[] = [`### ${m.name?.trim() || "Untitled"}`];

		if (opts.showCas) {
			lines.push(`- CAS: ${m.cas_number?.trim() || "—"}`);
		}
		if (opts.showMaterialNature) {
			lines.push(`- Material Nature: ${m.material_nature?.trim() || "—"}`);
		}
		if (opts.showNoteType) {
			lines.push(`- Note Type: ${m.note_type?.trim() || "—"}`);
		}
		if (opts.showCategory) {
			lines.push(
				`- Category: ${
					m.category_name ? toTitleCaseWords(m.category_name) : "—"
				}`,
			);
		}
		if (opts.showNotes) {
			lines.push(
				`- Notes: ${formatNotes(m, opts.includeGuestFeedbackInNotes)}`,
			);
		}
		if (opts.showDilutions) {
			const d = m.available_dilutions ?? [];
			lines.push(
				`- Available Dilutions: ${
					d.length ? d.map((v) => `${v}%`).join(", ") : "—"
				}`,
			);
		}

		return lines.join("\n");
	});

	return ["# Raw materials inventory", "", ...blocks].join("\n\n");
}
