import { useEffect, useState } from "react";
import type { Note } from "@/routes/api.notes";

type NotesAutocompleteProps = {
	label: string;
	selectedNotes: string[];
	onNotesChange: (notes: string[]) => void;
};

export function NotesAutocomplete({
	label,
	selectedNotes,
	onNotesChange,
}: NotesAutocompleteProps) {
	const [availableNotes, setAvailableNotes] = useState<Note[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	// Fetch available notes
	useEffect(() => {
		fetch("/api/notes")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setAvailableNotes(data.data);
				}
			})
			.catch((err) => console.error("Failed to fetch notes:", err));
	}, []);

	// Filter notes based on input
	const filteredNotes = availableNotes.filter(
		(note) =>
			note.name.toLowerCase().includes(inputValue.toLowerCase()) &&
			!selectedNotes.includes(note.name),
	);

	const handleAddNote = (noteName: string) => {
		const trimmed = noteName.trim();
		if (trimmed && !selectedNotes.includes(trimmed)) {
			onNotesChange([...selectedNotes, trimmed]);
			setInputValue("");
			setShowDropdown(false);
		}
	};

	const handleRemoveNote = (noteName: string) => {
		onNotesChange(selectedNotes.filter((n) => n !== noteName));
	};

	return (
		<div>
			<label className="block text-sm font-medium text-slate-200 mb-2">
				{label}
			</label>

			{/* Selected notes as tags */}
			{selectedNotes.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-2">
					{selectedNotes.map((note) => (
						<span
							key={note}
							className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
						>
							{note}
							<button
								type="button"
								onClick={() => handleRemoveNote(note)}
								className="hover:text-red-300 font-bold"
							>
								×
							</button>
						</span>
					))}
				</div>
			)}

			{/* Input with autocomplete and Add button */}
			<div className="flex gap-2">
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
								if (filteredNotes.length > 0) {
									handleAddNote(filteredNotes[0].name);
								} else if (inputValue.trim()) {
									handleAddNote(inputValue);
								}
							}
						}}
						placeholder="Type to search or add new note..."
						className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
					/>

					{/* Dropdown - only shows when there are filtered results */}
					{showDropdown && inputValue && filteredNotes.length > 0 && (
						<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
							{filteredNotes.map((note) => (
								<button
									key={note.id}
									type="button"
									onClick={() => handleAddNote(note.name)}
									className="w-full text-left px-4 py-2 hover:bg-slate-600 text-white"
								>
									{note.name}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Add button on the side */}
				<button
					type="button"
					onClick={() => {
						if (inputValue.trim()) {
							handleAddNote(inputValue);
						}
					}}
					disabled={!inputValue.trim()}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
				>
					Add
				</button>
			</div>
		</div>
	);
}
