import type { MaterialRecord } from "@/curation/materials/types";
import shared from "./shared.module.css";
import {
	getMaterialProducerSources,
	getSourceCardKey,
} from "@/components/academy/utils";
import { getNoteDotStyle } from "@/components/academy/utils/note-dot-styles";
import { toTitleCaseWords } from "@/utils/display-names";

type QuizAnswerRevealProps = {
	material: MaterialRecord;
	correctNotes: string[];
};

export default function QuizAnswerReveal({
	material,
	correctNotes,
}: QuizAnswerRevealProps) {
	const sources = getMaterialProducerSources(material);
	const correctKeys = new Set(correctNotes.map((note) => note.toLowerCase()));

	return (
		<div className={shared.revealCards}>
			{sources.map((source) => {
				const notes = source.data.notes ?? [];

				return (
					<div key={getSourceCardKey(source)} className={shared.revealCard}>
						<p className={shared.revealLabel}>Correct Notes</p>
						<ul className={shared.revealNotes}>
							{notes.map((note) => {
								const isCorrect = correctKeys.has(note.toLowerCase());
								const dotStyle = getNoteDotStyle(note);

								return (
									<li
										key={note}
										className={
											isCorrect
												? `${shared.revealNoteChip} ${shared.revealNoteChipCorrect}`
												: shared.revealNoteChip
										}
									>
										{dotStyle ? (
											<span
												className={shared.revealNoteDot}
												style={{ background: dotStyle }}
												aria-hidden="true"
											/>
										) : null}
										<span>{toTitleCaseWords(note)}</span>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
}
