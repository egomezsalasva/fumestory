import { useEffect, useRef, useState } from "react";
import type { Note } from "@/routes/api.notes";
import styles from "./Form.module.css";
import { toTitleCaseWords } from "@/utils/display-names";
import { authedFetch } from "@/utils/authed-fetch";
import { NEUTRAL_CATEGORY_COLOR } from "@/utils/curated-category-colors";

export type SelectedNote = {
	name: string;
	kind: "curated" | "other";
	color: string | null;
	isNew?: boolean;
};

type NotesAutocompleteProps = {
	label: string;
	selectedNotes: SelectedNote[];
	onNotesChange: (notes: SelectedNote[]) => void;
	/** When false (feedback), custom notes need no color picker */
	requireColorForCustom?: boolean;
};

export function NotesAutocomplete({
	label,
	selectedNotes,
	onNotesChange,
	requireColorForCustom = true,
}: NotesAutocompleteProps) {
	const [availableNotes, setAvailableNotes] = useState<Note[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [draftColor, setDraftColor] = useState(NEUTRAL_CATEGORY_COLOR);
	const colorInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		authedFetch("/api/notes")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setAvailableNotes(data.data);
				}
			})
			.catch((err) => console.error("Failed to fetch notes:", err));
	}, []);

	const normalizedInput = inputValue.trim().toLowerCase();

	const filteredNotes = availableNotes.filter(
		(note) =>
			note.name.toLowerCase().includes(normalizedInput) &&
			!selectedNotes.some(
				(selected) => selected.name.toLowerCase() === note.name.toLowerCase(),
			),
	);

	const exactMatch = availableNotes.find(
		(note) => note.name.toLowerCase() === normalizedInput,
	);

	const isNewName =
		normalizedInput.length > 0 &&
		!exactMatch &&
		!selectedNotes.some((s) => s.name.toLowerCase() === normalizedInput);

	const addExisting = (note: Note) => {
		if (
			selectedNotes.some(
				(s) => s.name.toLowerCase() === note.name.toLowerCase(),
			)
		) {
			return;
		}
		onNotesChange([
			...selectedNotes,
			{
				name: note.name,
				kind: note.kind,
				color: note.color,
				isNew: false,
			},
		]);
		setInputValue("");
		setShowDropdown(false);
		setDraftColor(NEUTRAL_CATEGORY_COLOR);
	};

	const addNewOther = () => {
		if (!isNewName) return;
		onNotesChange([
			...selectedNotes,
			{
				name: normalizedInput,
				kind: "other",
				color: requireColorForCustom ? draftColor : null,
				isNew: true,
			},
		]);
		setInputValue("");
		setShowDropdown(false);
		setDraftColor(NEUTRAL_CATEGORY_COLOR);
	};

	const handleAddFromInput = () => {
		if (!normalizedInput) return;
		if (exactMatch) {
			addExisting(exactMatch);
			return;
		}
		if (isNewName) {
			addNewOther();
		}
	};

	const handleRemoveNote = (noteName: string) => {
		onNotesChange(selectedNotes.filter((n) => n.name !== noteName));
	};

	return (
		<div>
			{label ? <label className={styles.formLabel}>{label}</label> : null}

			{selectedNotes.length > 0 && (
				<div className={styles.noteChipContainer}>
					{selectedNotes.map((note) => (
						<button
							key={note.name}
							type="button"
							onClick={() => handleRemoveNote(note.name)}
							className={styles.noteChip}
							aria-label={`Remove ${toTitleCaseWords(note.name)}`}
						>
							{note.color ? (
								<span
									className="encyclopedia-note-dot shrink-0"
									style={{ background: note.color }}
									aria-hidden="true"
								/>
							) : null}
							<span>{toTitleCaseWords(note.name)}</span>
							<span aria-hidden className={styles.noteChipRemove}>
								×
							</span>
						</button>
					))}
				</div>
			)}

			<div className="flex gap-2 items-center">
				<div className="relative flex-1">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
							setShowDropdown(true);
						}}
						onFocus={() => setShowDropdown(true)}
						onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								if (filteredNotes.length > 0 && !isNewName) {
									addExisting(filteredNotes[0]);
								} else {
									handleAddFromInput();
								}
							}
						}}
						placeholder="Type to search or add new note..."
						className={styles.formInput}
					/>

					{showDropdown && normalizedInput && filteredNotes.length > 0 && (
						<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
							{filteredNotes.map((note) => (
								<button
									key={note.id}
									type="button"
									onClick={() => addExisting(note)}
									className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white flex items-center gap-2"
								>
									{note.color ? (
										<span
											className="encyclopedia-note-dot shrink-0"
											style={{ background: note.color }}
											aria-hidden="true"
										/>
									) : null}
									<span>{toTitleCaseWords(note.name)}</span>
									{note.kind === "other" ? (
										<span className="text-slate-400 text-xs">custom</span>
									) : null}
								</button>
							))}
						</div>
					)}
				</div>

				{isNewName && requireColorForCustom ? (
					<>
						<button
							type="button"
							title="Pick note color"
							aria-label="Pick note color"
							onClick={() => colorInputRef.current?.click()}
							className="shrink-0 w-10 h-10 rounded-[0.25rem] cursor-pointer"
							style={{
								background: draftColor,
								border: "1px solid #464859",
							}}
						/>
						<input
							ref={colorInputRef}
							type="color"
							value={
								draftColor.startsWith("#") && draftColor.length === 7
									? draftColor
									: NEUTRAL_CATEGORY_COLOR
							}
							onChange={(e) => setDraftColor(e.target.value)}
							className="sr-only"
							tabIndex={-1}
						/>
					</>
				) : null}

				<button
					type="button"
					onClick={handleAddFromInput}
					disabled={
						!normalizedInput ||
						(isNewName && requireColorForCustom && !draftColor)
					}
					className={styles.formAddCircleButton}
				>
					+
				</button>
			</div>

			{isNewName && requireColorForCustom ? (
				<p className="mt-1 text-xs text-slate-400">
					Custom note — pick a color, then press + to add the tag.
				</p>
			) : null}
		</div>
	);
}
