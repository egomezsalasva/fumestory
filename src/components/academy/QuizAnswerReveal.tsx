import type { MaterialRecord } from "@/curation/materials/types";
import shared from "./shared.module.css";
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
		<div className={shared.revealCards}>
			{sources.map((source) => {
				const href = getSourceLink(source.data);
				const notes = source.data.notes ?? [];
				const nameUsed = getSourceNameUsed(source.data);

				return (
					<div key={getSourceCardKey(source)} className={shared.revealCard}>
						<p className={shared.revealLabel}>Notes</p>
						<ul className={shared.revealNotes}>
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

						<p className={shared.revealLabel}>
							Source
							{isManufacturerSource(source) ? " / Manufacturer" : ""}
						</p>

						<div className={shared.revealSource}>
							{href && (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={shared.revealSourceLink}
								>
									<div
										className={`${shared.producerLogos} ${shared.producerLogosReveal}`}
									>
										<ProducerLogo sourceName={source.sourceName} />
									</div>

									{nameUsed && (
										<p className={shared.revealTradeName}>
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
