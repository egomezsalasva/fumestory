import type { MaterialRecord } from "@/curation/materials/types";
import academyStyles from "./Academy.module.css";
import {
	getMaterialProducerSources,
	getSourceCardKey,
	getSourceLink,
	getSourceNameUsed,
	isManufacturerSource,
} from "@/components/academy/utils";
import { getNoteDotStyle } from "@/components/academy/utils/note-dot-styles";
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
		<div className={academyStyles.revealCards}>
			{sources.map((source) => {
				const href = getSourceLink(source.data);
				const notes = source.data.notes ?? [];
				const nameUsed = getSourceNameUsed(source.data);

				return (
					<div
						key={getSourceCardKey(source)}
						className={academyStyles.revealCard}
					>
						<p className={academyStyles.revealLabel}>Notes</p>
						<ul className={academyStyles.revealNotes}>
							{notes.map((note) => {
								const isCorrect =
									note.toLowerCase() === correctNote.toLowerCase();
								const dotStyle = getNoteDotStyle(note);

								return (
									<li
										key={note}
										className={
											isCorrect
												? `${academyStyles.revealNoteChip} ${academyStyles.revealNoteChipCorrect}`
												: academyStyles.revealNoteChip
										}
									>
										{dotStyle ? (
											<span
												className={academyStyles.revealNoteDot}
												style={{ background: dotStyle }}
												aria-hidden="true"
											/>
										) : null}
										<span>{toTitleCaseWords(note)}</span>
									</li>
								);
							})}
						</ul>

						<p className={academyStyles.revealLabel}>
							Source
							{isManufacturerSource(source) ? " / Manufacturer" : ""}
						</p>

						<div className={academyStyles.revealSource}>
							{href && (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={academyStyles.revealSourceLink}
								>
									<div
										className={`${academyStyles.producerLogos} ${academyStyles.producerLogosReveal}`}
									>
										<ProducerLogo sourceName={source.sourceName} />
									</div>

									{nameUsed && (
										<p className={academyStyles.revealTradeName}>
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
