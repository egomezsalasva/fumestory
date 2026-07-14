import type { MaterialRecord } from "@/curation/materials/types";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialProducerSources,
	getSourceCardKey,
	getSourceLink,
	getSourceNameUsed,
	isManufacturerSource,
} from "@/components/materials-quiz/utils";
import { getNoteDotStyle } from "@/components/materials-quiz/utils/note-dot-styles";
import {
	capitalizeWordStartsIfLower,
	toTitleCaseWords,
} from "@/utils/display-names";
import ProducerLogo from "@/components/svgs/ProducerLogo";

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
		<div className={quizStyles.revealCards}>
			{sources.map((source) => {
				const href = getSourceLink(source.data);
				const notes = source.data.notes ?? [];
				const nameUsed = getSourceNameUsed(source.data);

				return (
					<div key={getSourceCardKey(source)} className={quizStyles.revealCard}>
						<p className={quizStyles.revealLabel}>Notes</p>
						<ul className={quizStyles.revealNotes}>
							{notes.map((note) => {
								const isCorrect =
									note.toLowerCase() === correctNote.toLowerCase();
								const dotStyle = getNoteDotStyle(note);

								return (
									<li
										key={note}
										className={
											isCorrect
												? `${quizStyles.revealNoteChip} ${quizStyles.revealNoteChipCorrect}`
												: quizStyles.revealNoteChip
										}
									>
										{dotStyle ? (
											<span
												className={quizStyles.revealNoteDot}
												style={{ background: dotStyle }}
												aria-hidden="true"
											/>
										) : null}
										<span>{toTitleCaseWords(note)}</span>
									</li>
								);
							})}
						</ul>

						<p className={quizStyles.revealLabel}>
							Source
							{isManufacturerSource(source) ? " / Manufacturer" : ""}
						</p>

						<div className={quizStyles.revealSource}>
							{href && (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={quizStyles.revealSourceLink}
								>
									<div
										className={`${quizStyles.producerLogos} ${quizStyles.producerLogosReveal}`}
									>
										<ProducerLogo sourceName={source.sourceName} />
									</div>

									{nameUsed && (
										<p className={quizStyles.revealTradeName}>
											{capitalizeWordStartsIfLower(nameUsed)}
										</p>
									)}
								</a>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
