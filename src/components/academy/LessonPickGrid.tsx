import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import styles from "./LessonPickGrid.module.css";
import shared from "./shared.module.css";
import {
	getMaterialDisplayNames,
	getMaterialProducerSources,
	getSourceCardKey,
	getSourceLink,
	getSourceNameUsed,
	isManufacturerSource,
	normalizeMaterialKey,
} from "@/components/academy/utils";
import { getNoteDotStyle } from "@/components/academy/utils/note-dot-styles";
import {
	capitalizeWordStartsIfLower,
	toTitleCaseWords,
} from "@/utils/display-names";
import {
	hexToRgba,
	NEUTRAL_CATEGORY_COLOR,
	resolveCategoryColor,
} from "@/utils/curated-category-colors";
import ProducerLogo from "@/components/svgs/ProducerLogo";

const FLIP_MS = 550;

type LessonPickGridProps = {
	materials: MaterialRecord[];
	pickedKeys: string[];
	expandedKey: string | null;
	onToggle: (material: MaterialRecord) => void;
};

type FloatRect = {
	top: number;
	left: number;
	width: number;
	height: number;
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

function getExpandBounds(from: HTMLElement): DOMRect {
	// section.quizSection → .body → .innerContainer
	const section = from.closest("section");
	const body = section?.parentElement;
	const inner = body?.parentElement;
	const el =
		inner instanceof HTMLElement
			? inner
			: body instanceof HTMLElement
				? body
				: document.documentElement;
	return el.getBoundingClientRect();
}

function getExpandedTarget(bounds: DOMRect): FloatRect {
	const pad = 16;
	const width = Math.min(40 * 16, Math.max(0, bounds.width - pad * 2));
	const height = Math.min(32 * 16, Math.max(0, bounds.height - pad * 2));
	return {
		width,
		height,
		left: bounds.left + (bounds.width - width) / 2,
		top: bounds.top + (bounds.height - height) / 2,
	};
}

type PickCardProps = {
	material: MaterialRecord;
	picked: boolean;
	expanded: boolean;
	lockedOut: boolean;
	onToggle: () => void;
};

function PickCard({
	material,
	picked,
	expanded,
	lockedOut,
	onToggle,
}: PickCardProps) {
	const cardRef = useRef<HTMLButtonElement>(null);
	const collapsingRef = useRef(false);
	const [floating, setFloating] = useState(false);
	const [flipped, setFlipped] = useState(false);
	const [flipping, setFlipping] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [rect, setRect] = useState<FloatRect | null>(null);

	const familyParent = material.olfactiveFamily?.[0];
	const familyLabel = familyParent ? toTitleCaseWords(familyParent) : "—";
	const familyPathLabel = material.olfactiveFamily
		?.map(toTitleCaseWords)
		.join(" · ");
	const color = familyParent
		? resolveCategoryColor(familyParent)
		: NEUTRAL_CATEGORY_COLOR;
	const displayNames = getMaterialDisplayNames(material);
	const sources = getMaterialProducerSources(material);
	const faceStyle = {
		background: `linear-gradient(${hexToRgba(color, 0.4)}, ${hexToRgba(color, 0.4)}), #0b172d`,
		borderColor: hexToRgba(color, 0.55),
	};

	useLayoutEffect(() => {
		const el = cardRef.current;
		if (!el) return;

		if (expanded && !floating) {
			collapsingRef.current = false;
			const r = el.getBoundingClientRect();
			setRect({
				top: r.top,
				left: r.left,
				width: r.width,
				height: r.height,
			});
			setFloating(true);
			setFlipped(false);
			setAnimate(false);
			setFlipping(false);

			let flipTimeout: number | undefined;

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setRect(getExpandedTarget(getExpandBounds(el)));
					setFlipped(true);
					setAnimate(true);
					setFlipping(true);
					flipTimeout = window.setTimeout(
						() => setFlipping(false),
						FLIP_MS - 80,
					);
				});
			});

			return () => {
				if (flipTimeout !== undefined) window.clearTimeout(flipTimeout);
			};
		}

		if (!expanded && floating && !collapsingRef.current) {
			collapsingRef.current = true;
			const slot = el.parentElement?.getBoundingClientRect();
			if (!slot) {
				setFloating(false);
				setFlipped(false);
				setFlipping(false);
				setAnimate(false);
				setRect(null);
				collapsingRef.current = false;
				return;
			}

			setAnimate(true);
			setFlipped(false);
			setFlipping(true);
			setRect({
				top: slot.top,
				left: slot.left,
				width: slot.width,
				height: slot.height,
			});

			const timeout = window.setTimeout(() => {
				setFloating(false);
				setAnimate(false);
				setFlipping(false);
				setRect(null);
				collapsingRef.current = false;
			}, FLIP_MS);

			return () => window.clearTimeout(timeout);
		}
	}, [expanded, floating]);

	const floatStyle: CSSProperties | undefined =
		floating && rect
			? {
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				}
			: undefined;

	return (
		<div className={styles.pickSlot} data-expanded={expanded || floating}>
			<button
				ref={cardRef}
				type="button"
				className={styles.pickCard}
				data-picked={picked}
				data-locked={lockedOut}
				data-floating={floating}
				data-animate={animate}
				data-flipping={flipping}
				disabled={lockedOut}
				style={floatStyle}
				onClick={onToggle}
				aria-expanded={expanded}
				aria-label={
					expanded
						? `Collapse ${displayNames[0] ?? familyLabel}`
						: picked
							? `${displayNames[0] ?? familyLabel}, studied. Expand`
							: `${familyLabel}, unknown. Expand`
				}
			>
				<div className={styles.pickFlipInner} data-flipped={flipped}>
					<div
						className={styles.pickFaceFront}
						style={lockedOut ? undefined : faceStyle}
					>
						<span className={styles.pickFamily}>
							{picked && !floating
								? capitalizeWordStartsIfLower(displayNames[0] ?? familyLabel)
								: familyLabel}
						</span>
						<span className={styles.pickStatus} aria-hidden="true">
							{picked ? "✓" : "?"}
						</span>
					</div>
					<div className={styles.pickFaceBack} style={faceStyle}>
						<div className={styles.pickBackScroll}>
							<div className={shared.materialNameLine}>
								{displayNames.map((name) => (
									<h2
										key={name}
										className={`${shared.materialName} ${styles.pickMaterialName}`}
									>
										{capitalizeWordStartsIfLower(name)}
									</h2>
								))}
							</div>
							<p className={shared.materialCas}>
								CAS: {material.cas?.join(" ∙ ") ?? "—"}
							</p>
							{familyPathLabel ? (
								<p className={shared.materialFamily}>{familyPathLabel}</p>
							) : null}

							<div
								className={`${shared.revealCards} ${styles.pickRevealCards}`}
							>
								{sources.map((source) => {
									const href = getSourceLink(source.data);
									const notes = source.data.notes ?? [];
									const nameUsed = getSourceNameUsed(source.data);

									return (
										<div
											key={getSourceCardKey(source)}
											className={`${shared.revealCard} ${styles.pickRevealCard}`}
										>
											<p className={shared.revealLabel}>Notes</p>
											<ul className={shared.revealNotes}>
												{notes.map((note) => {
													const dotStyle = getNoteDotStyle(note);
													return (
														<li key={note} className={shared.revealNoteChip}>
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
												{href ? (
													<a
														href={href}
														target="_blank"
														rel="noopener noreferrer"
														className={shared.revealSourceLink}
														onClick={(event) => event.stopPropagation()}
													>
														<div
															className={`${shared.producerLogos} ${shared.producerLogosReveal}`}
														>
															<ProducerLogo sourceName={source.sourceName} />
														</div>
														{nameUsed ? (
															<p className={shared.revealTradeName}>
																{capitalizeWordStartsIfLower(nameUsed)}
															</p>
														) : null}
													</a>
												) : null}
											</div>
										</div>
									);
								})}
							</div>
						</div>
						<p className={styles.pickBackPrompt}>Remember The Notes</p>
						<p className={styles.pickBackHint}>
							<FlipIcon />
							<span>Click to Shrink Back</span>
						</p>
					</div>
				</div>
			</button>
		</div>
	);
}

export default function LessonPickGrid({
	materials,
	pickedKeys,
	expandedKey,
	onToggle,
}: LessonPickGridProps) {
	const picksFull = pickedKeys.length >= 3;
	const pickedSet = new Set(pickedKeys);

	return (
		<>
			{expandedKey ? (
				<button
					type="button"
					className={styles.pickBackdrop}
					aria-label="Collapse card"
					onClick={() => {
						const material = materials.find(
							(item) => normalizeMaterialKey(item) === expandedKey,
						);
						if (material) onToggle(material);
					}}
				/>
			) : null}

			<div className={styles.pickGrid}>
				{materials.map((material) => {
					const key = normalizeMaterialKey(material);
					const picked = pickedSet.has(key);
					const expanded = expandedKey === key;
					const lockedOut = picksFull && !picked && !expanded;

					return (
						<PickCard
							key={key}
							material={material}
							picked={picked}
							expanded={expanded}
							lockedOut={lockedOut}
							onToggle={() => onToggle(material)}
						/>
					);
				})}
			</div>
		</>
	);
}
