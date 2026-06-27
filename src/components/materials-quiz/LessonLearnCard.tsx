import type { MaterialRecord } from "@/curation/materials/types";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialDisplayNames,
	getMaterialProducerSources,
	getSourceLink,
} from "@/components/materials-quiz/utils";
import { getNoteDotStyle } from "@/components/materials-quiz/utils/note-dot-styles";
import {
	capitalizeWordStartsIfLower,
	toTitleCaseWords,
} from "@/utils/display-names";
import ProducerLogo from "@/components/svgs/ProducerLogo";

type LessonLearnCardProps = {
	material: MaterialRecord;
	cardIndex: number;
	totalCards: number;
};

export default function LessonLearnCard({
	material,
	cardIndex,
	totalCards,
}: LessonLearnCardProps) {
	const displayNames = getMaterialDisplayNames(material);
	const sources = getMaterialProducerSources(material);

	return (
		<>
			<p className={quizStyles.learnProgress}>
				Material {cardIndex + 1} of {totalCards}
			</p>
			<p className={quizStyles.learnHint}>Remember The Notes</p>

			<div className={quizStyles.quizMaterialSection}>
				<div className={quizStyles.materialNameLine}>
					{displayNames.map((name) => (
						<h2 key={name} className={quizStyles.materialName}>
							{capitalizeWordStartsIfLower(name)}
						</h2>
					))}
					{/* {sources.length > 0 && (
						<div className={quizStyles.producerLogos}>
							{sources.map((source) => (
								<ProducerLogo
									key={source.sourceName}
									sourceName={source.sourceName}
								/>
							))}
						</div>
					)} */}
				</div>
				<p className={quizStyles.materialCas}>
					CAS: {material.cas?.join(", ") ?? "—"}
				</p>
			</div>

			<div className={quizStyles.revealCards}>
				{sources.map((source) => {
					const href = getSourceLink(source.data);
					const notes = source.data.notes ?? [];

					return (
						<div
							key={`${source.sourceName}-${source.data.nameUsed ?? source.data.url ?? source.data.pdfUrl}`}
							className={quizStyles.revealCard}
						>
							<p className={quizStyles.revealLabel}>Source</p>
							<div
								className={`${quizStyles.producerLogos} ${quizStyles.producerLogosReveal}`}
							>
								<ProducerLogo sourceName={source.sourceName} />
							</div>

							{source.data.nameUsed && (
								<p className={quizStyles.revealTradeName}>
									{capitalizeWordStartsIfLower(source.data.nameUsed)}
								</p>
							)}

							<p className={quizStyles.revealLabel}>Notes</p>
							<ul className={quizStyles.revealNotes}>
								{notes.map((note) => {
									const dotStyle = getNoteDotStyle(note);

									return (
										<li key={note} className={quizStyles.revealNoteChip}>
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

							{href && (
								<a
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className={quizStyles.revealSourceLink}
								>
									View source
								</a>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
}
