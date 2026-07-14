import { useEffect, useState } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import quizStyles from "./MaterialsQuiz.module.css";
import {
	getMaterialDisplayNames,
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

type LessonLearnCardProps = {
	material: MaterialRecord;
	cardIndex: number;
	totalCards: number;
};

function FlipIcon() {
	return (
		<svg
			width="21"
			height="23"
			viewBox="0 0 21 23"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M15.125 1.125L19.125 5.125M19.125 5.125L15.125 9.125M19.125 5.125H5.125C4.06413 5.125 3.04672 5.54643 2.29657 6.29657C1.54643 7.04672 1.125 8.06413 1.125 9.125V10.125M5.125 21.125L1.125 17.125M1.125 17.125L5.125 13.125M1.125 17.125H15.125C16.1859 17.125 17.2033 16.7036 17.9534 15.9534C18.7036 15.2033 19.125 14.1859 19.125 13.125V12.125"
				stroke="currentColor"
				strokeWidth="2.25"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function LessonLearnCard({
	material,
	cardIndex,
	totalCards,
}: LessonLearnCardProps) {
	const [isRevealed, setIsRevealed] = useState(false);
	const displayNames = getMaterialDisplayNames(material);
	const sources = getMaterialProducerSources(material);

	useEffect(() => {
		setIsRevealed(false);
	}, [material]);

	return (
		<>
			<p className={quizStyles.learnProgress}>
				Material {cardIndex + 1} of {totalCards}
			</p>

			<button
				type="button"
				className={quizStyles.flipCard}
				data-revealed={isRevealed}
				onClick={() => setIsRevealed((current) => !current)}
				aria-pressed={isRevealed}
				aria-label={
					isRevealed ? "Show material name" : "Reveal notes for this material"
				}
			>
				<div className={quizStyles.flipFront}>
					<div className={quizStyles.flipContent}>
						<p className={quizStyles.learnHint}>Remember The Material</p>

						<div className={quizStyles.quizMaterialSection}>
							<div className={quizStyles.materialNameLine}>
								{displayNames.map((name) => (
									<h2 key={name} className={quizStyles.materialName}>
										{capitalizeWordStartsIfLower(name)}
									</h2>
								))}
							</div>
							<p className={quizStyles.materialCas}>
								CAS: {material.cas?.join(" ∙ ") ?? "—"}
							</p>
						</div>
					</div>

					<div className={quizStyles.flipFooter}>
						<div className={quizStyles.flipRevealBtn}>
							<FlipIcon />
							<span>Click to reveal notes</span>
						</div>
					</div>
				</div>

				<div className={quizStyles.flipBack}>
					<div className={quizStyles.flipContent}>
						<p className={quizStyles.learnHint}>Remember The Notes</p>
						<div className={quizStyles.revealCards}>
							{sources.map((source) => {
								const href = getSourceLink(source.data);
								const notes = source.data.notes ?? [];
								const nameUsed = getSourceNameUsed(source.data);

								return (
									<div
										key={getSourceCardKey(source)}
										className={quizStyles.revealCard}
									>
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
													onClick={(event) => event.stopPropagation()}
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
					</div>

					<div className={quizStyles.flipFooter}>
						<div className={quizStyles.flipRevealBtn}>
							<FlipIcon />
							<span>Click to show material</span>
						</div>
					</div>
				</div>
			</button>
		</>
	);
}
