export function toTitleCaseWords(text: string): string {
	return text
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

export function nameFromAgentProposal(nameAsEntered: string): string {
	const raw = nameAsEntered.trim();
	if (!raw) return "";
	return raw === raw.toLowerCase() ? toTitleCaseWords(raw) : raw;
}

export function capitalizeWordStartsIfLower(text: string): string {
	return text
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => {
			const first = word.charAt(0);
			if (first >= "a" && first <= "z") {
				return first.toUpperCase() + word.slice(1);
			}
			return word;
		})
		.join(" ");
}
