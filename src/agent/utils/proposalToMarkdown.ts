import type { RawMaterialProposal } from "@/agent/schemas/rawMaterialProposal";
import { nameFromAgentProposal, toTitleCaseWords } from "@/utils/display-names";

export function proposalToMarkdown(proposal: RawMaterialProposal): string {
	const notesBlock =
		proposal.notes.length > 0
			? proposal.notes.map((n) => `- ${toTitleCaseWords(n)}`).join("\n")
			: "- _none_";

	const additionalParagraphs = proposal.additionalInformation
		.trim()
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.join("\n\n");

	const formSection = [
		`**Suggested label:** ${proposal.suggestedLabel}`,
		"",
		`**Name:** ${nameFromAgentProposal(proposal.nameAsEntered)}`,
		"",
		`**CAS number:** ${proposal.casNumber ?? "_none_"}`,
		"",
		`**Material nature:** ${proposal.materialNature}`,
		"",
		`**Suggested category:** ${toTitleCaseWords(proposal.suggestedCategory)}`,
		"",
		`**Note type:** \`${proposal.noteType}\``,
		"",
		"**Notes:**",
		"",
		notesBlock,
	].join("\n");

	return [
		formSection,
		"",
		"---",
		"",
		"### Additional information",
		"",
		additionalParagraphs,
	].join("\n");
}
