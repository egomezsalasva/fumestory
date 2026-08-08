import formStyles from "@/components/Form.module.css";
import styles from "../Academy.module.css";
import { OPTION_LETTERS } from "./constants";

export function getOptionLetter(index: number): string {
	return OPTION_LETTERS[index] ?? String.fromCharCode(97 + index);
}

export function noteKey(note: string): string {
	return note.toLowerCase();
}

export function isSelectionCorrect(
	selected: string[],
	correctNotes: string[],
): boolean {
	if (selected.length !== correctNotes.length) return false;
	const correctKeys = new Set(correctNotes.map(noteKey));
	return selected.every((note) => correctKeys.has(noteKey(note)));
}

export function optionClass(
	option: string,
	selected: string[],
	correctNotes: string[],
	locked: boolean,
): string {
	const base = `${formStyles.feedbackNoRatingButton} ${styles.optionButton}`;
	const isPicked = selected.some((note) => noteKey(note) === noteKey(option));
	const isCorrectOption = correctNotes.some(
		(note) => noteKey(note) === noteKey(option),
	);

	if (!locked) {
		if (isPicked) {
			return `${base} ${formStyles.feedbackNoRatingButtonActive}`;
		}
		return `${base} ${formStyles.feedbackNoRatingButtonInactive}`;
	}

	if (isCorrectOption) {
		return `${base} ${styles.optionCorrect}`;
	}

	if (isPicked && !isCorrectOption) {
		return `${base} ${styles.optionWrong}`;
	}

	return `${base} ${formStyles.feedbackNoRatingButtonInactive} ${styles.optionDimmed}`;
}
