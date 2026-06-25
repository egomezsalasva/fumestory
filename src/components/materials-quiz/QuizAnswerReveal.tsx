import type { MaterialRecord } from "@/curation/materials/types";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialProducerSources,
	getSourceLink,
} from "@/components/materials-quiz/utils/materialSources";

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
							{notes.map((note) => {
								const isCorrect =
									note.toLowerCase() === correctNote.toLowerCase();

								return (
									<li
										key={note}
										className={
											isCorrect
												? `${quizStyles.revealNoteChip} ${quizStyles.revealNoteChipCorrect}`
												: quizStyles.revealNoteChip
										}
									>
										{note}
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
	);
}
