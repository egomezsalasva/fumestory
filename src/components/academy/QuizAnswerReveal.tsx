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
	correctNote: string;
};

export default function QuizAnswerReveal({
	material,
	correctNote,
}: QuizAnswerRevealProps) {
	const sources = getMaterialProducerSources(material);

	return (
		<div className={shared.revealCards}>
			{sources.map((source) => {
				const notes = source.data.notes ?? [];

				return (
					<div key={getSourceCardKey(source)} className={shared.revealCard}>
						<p className={shared.revealLabel}>Correct Notes</p>
						<ul
							className={shared.revealNotes}
							style={{ marginBottom: "0.5rem" }}
						>
							{notes.map((note) => {
								const isCorrect =
									note.toLowerCase() === correctNote.toLowerCase();
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
