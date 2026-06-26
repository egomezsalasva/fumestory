import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialDisplayNames,
	getMaterialProducerSources,
	getSourceLink,
} from "@/components/materials-quiz/utils";
import { toTitleCaseWords } from "@/utils/display-names";

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
				<div className={quizStyles.materialNames}>
					{displayNames.map((name) => (
						<h2 key={name} className={quizStyles.materialName}>
							{toTitleCaseWords(name)}
						</h2>
					))}
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
							<p className={quizStyles.revealSourceName}>{source.sourceName}</p>

							{source.data.nameUsed && (
								<p className={quizStyles.revealTradeName}>
									Trade name: {source.data.nameUsed}
								</p>
							)}

							<p className={quizStyles.revealLabel}>Notes</p>
							<ul className={quizStyles.revealNotes}>
								{notes.map((note) => (
									<li key={note} className={quizStyles.revealNoteChip}>
										{toTitleCaseWords(note)}
									</li>
								))}
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
