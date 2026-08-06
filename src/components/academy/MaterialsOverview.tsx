import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";
import pickStyles from "./LessonPickGrid.module.css";
import shared from "./shared.module.css";
import {
	getMaterialDisplayNames,
	getMaterialProducerSources,
	getMasteryValue,
	getSourceCardKey,
	getSourceLink,
	MASTERY_TARGET,
	normalizeMaterialKey,
	type MaterialMasteryMap,
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

type MaterialsOverviewProps = {
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	seenMaterialKeys: ReadonlySet<string>;
	materialMastery: MaterialMasteryMap;
	onBack: () => void;
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

function getExpandedTarget(): FloatRect {
	const pad = 16;
	const isMobile = window.matchMedia("(max-width: 768px)").matches;
	const vw = window.innerWidth;
	const vh = window.innerHeight;

	if (isMobile) {
		const top = 96;
		const width = Math.min(21 * 16, Math.max(0, vw - pad * 2));
		const height = Math.min(32 * 16, Math.max(0, vh - top - pad));
		return {
			width,
			height,
			left: (vw - width) / 2,
			top,
		};
	}

	const width = Math.min(40 * 16, Math.max(0, vw - pad * 2));
	const height = Math.min(32 * 16, Math.max(0, vh - pad * 2));
	return {
		width,
		height,
		left: (vw - width) / 2,
		top: Math.max(pad, (vh - height) / 2),
	};
}

function getCategoryProgress(
	materials: MaterialRecord[],
	learnedKeys: ReadonlySet<string>,
) {
	const map = new Map<string, { known: number; total: number }>();

	for (const material of materials) {
		const family = material.olfactiveFamily?.[0]?.trim().toLowerCase();
		if (!family) continue;
		const entry = map.get(family) ?? { known: 0, total: 0 };
		entry.total += 1;
		if (learnedKeys.has(normalizeMaterialKey(material))) entry.known += 1;
		map.set(family, entry);
	}

	return [...map.entries()]
		.map(([family, { known, total }]) => ({
			family,
			label: toTitleCaseWords(family),
			known,
			total,
			color: resolveCategoryColor(family),
		}))
		.sort((a, b) => a.family.localeCompare(b.family));
}

function materialsInFamily(
	materials: MaterialRecord[],
	family: string,
): MaterialRecord[] {
	return materials
		.filter(
			(material) =>
				material.olfactiveFamily?.[0]?.trim().toLowerCase() === family,
		)
		.sort((a, b) =>
			a.canonicalName.localeCompare(b.canonicalName, undefined, {
				sensitivity: "base",
			}),
		);
}

function MasteryBar({ progress, color }: { progress: number; color: string }) {
	return (
		<div className={styles.materialMasteryTrack}>
			<div className={styles.materialMasteryTrackInner}>
				{Array.from({ length: MASTERY_TARGET }, (_, index) => (
					<span key={index} className={styles.materialMasterySegment} />
				))}
				<span
					className={styles.materialMasteryFill}
					style={{
						transform: `scaleX(${progress})`,
						transitionDuration: "0ms",
						background: hexToRgba(color, 0.85),
					}}
				/>
			</div>
		</div>
	);
}

/** Unseen — static "?" card, no flip. */
function HiddenMasteryCard({ color }: { color: string }) {
	return (
		<div
			className={styles.materialMasteryCard}
			data-seen="false"
			style={{
				background: `linear-gradient(${hexToRgba(color, 0.4)}, ${hexToRgba(color, 0.4)}), #0b172d`,
				borderColor: hexToRgba(color, 0.55),
			}}
		>
			<div className={styles.materialMasteryHeader}>
				<span className={styles.materialMasteryLabel}>?</span>
			</div>
			<MasteryBar progress={0} color={color} />
		</div>
	);
}

/** Seen — expand + flip like lesson pick cards. */
function SeenMasteryCard({
	material,
	targetValue,
	expanded,
	onToggle,
}: {
	material: MaterialRecord;
	targetValue: number;
	expanded: boolean;
	onToggle: () => void;
}) {
	const cardRef = useRef<HTMLButtonElement>(null);
	const collapsingRef = useRef(false);
	const [floating, setFloating] = useState(false);
	const [flipped, setFlipped] = useState(false);
	const [flipping, setFlipping] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [rect, setRect] = useState<FloatRect | null>(null);

	const familyParent = material.olfactiveFamily?.[0];
	const familyLabel = familyParent ? toTitleCaseWords(familyParent) : "—";
	const color = familyParent
		? resolveCategoryColor(familyParent)
		: NEUTRAL_CATEGORY_COLOR;
	const displayNames = getMaterialDisplayNames(material);
	const sources = getMaterialProducerSources(material);
	const progress = Math.min(1, targetValue / MASTERY_TARGET);
	const name = capitalizeWordStartsIfLower(
		displayNames[0] ?? material.canonicalName,
	);
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
					setRect(getExpandedTarget());
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
		<div
			className={`${pickStyles.pickSlot} ${styles.overviewFlipSlot}`}
			data-expanded={expanded || floating}
		>
			<button
				ref={cardRef}
				type="button"
				className={`${pickStyles.pickCard} ${
					targetValue >= MASTERY_TARGET ? styles.materialMasteryComplete : ""
				}`}
				data-picked="true"
				data-floating={floating}
				data-animate={animate}
				data-flipping={flipping}
				style={floatStyle}
				onClick={onToggle}
				aria-expanded={expanded}
				aria-label={expanded ? `Collapse ${name}` : `Expand ${name}`}
			>
				<div className={pickStyles.pickFlipInner} data-flipped={flipped}>
					<div
						className={`${pickStyles.pickFaceFront} ${styles.overviewFlipFront}`}
						style={faceStyle}
					>
						<div className={styles.materialMasteryHeader}>
							<span className={styles.materialMasteryLabel}>{name}</span>
						</div>
						<MasteryBar progress={progress} color={color} />
					</div>

					<div className={pickStyles.pickFaceBack} style={faceStyle}>
						{familyLabel !== "—" ? (
							<p
								className={pickStyles.pickFamilyPill}
								style={{
									background: hexToRgba(color, 0.25),
									borderColor: hexToRgba(color, 0.55),
								}}
							>
								{familyLabel}
							</p>
						) : null}

						<div className={pickStyles.pickBackScroll}>
							<div className={shared.materialNameLine}>
								{displayNames.map((displayName) => (
									<h2
										key={displayName}
										className={`${shared.materialName} ${pickStyles.pickMaterialName}`}
									>
										{capitalizeWordStartsIfLower(displayName)}
									</h2>
								))}
							</div>
							<p className={shared.materialCas}>
								CAS: {material.cas?.join(" ∙ ") ?? "—"}
							</p>

							<div
								className={`${shared.revealCards} ${pickStyles.pickRevealCards}`}
							>
								{sources.map((source) => {
									const notes = source.data.notes ?? [];

									return (
										<div
											key={getSourceCardKey(source)}
											className={`${shared.revealCard} ${pickStyles.pickRevealCard}`}
										>
											<p
												className={`${shared.revealLabel} ${pickStyles.pickRememberLabel}`}
											>
												Notes
											</p>
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
										</div>
									);
								})}
							</div>

							{sources.length > 0 ? (
								<div className={pickStyles.pickFamilyRow}>
									<div className={pickStyles.pickFamilyLogos}>
										{sources.map((source) => {
											const href = getSourceLink(source.data);
											if (!href) return null;
											return (
												<div
													key={getSourceCardKey(source)}
													className={pickStyles.pickFamilySourceItem}
												>
													<span className={pickStyles.pickFamilySourceLabel}>
														Manufacturer:
													</span>
													<a
														href={href}
														target="_blank"
														rel="noopener noreferrer"
														className={pickStyles.pickFamilyLogoLink}
														onClick={(event) => event.stopPropagation()}
														aria-label={source.sourceName}
													>
														<span className={shared.producerLogos}>
															<ProducerLogo sourceName={source.sourceName} />
														</span>
													</a>
												</div>
											);
										})}
									</div>
								</div>
							) : null}
						</div>

						<p className={pickStyles.pickBackHint}>
							<FlipIcon />
							<span>Click to Shrink Back</span>
						</p>
					</div>
				</div>
			</button>
		</div>
	);
}

export default function MaterialsOverview({
	materials,
	learnedMaterialKeys,
	seenMaterialKeys,
	materialMastery,
	onBack,
}: MaterialsOverviewProps) {
	const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
	const [expandedKey, setExpandedKey] = useState<string | null>(null);
	const categories = getCategoryProgress(materials, learnedMaterialKeys);
	const known = learnedMaterialKeys.size;

	if (selectedFamily) {
		const familyMaterials = materialsInFamily(materials, selectedFamily);
		const label = toTitleCaseWords(selectedFamily);
		const count = familyMaterials.length;

		return (
			<div className={styles.lessonCompleteCard}>
				<p className={styles.overviewFamilyTitle}>{label}</p>
				<p className={styles.lessonCompleteKnownSubLabel}>
					{
						familyMaterials.filter(
							(m) =>
								getMasteryValue(materialMastery, normalizeMaterialKey(m)) > 0,
						).length
					}
					/{count} known
				</p>

				{expandedKey ? (
					<button
						type="button"
						className={pickStyles.pickBackdrop}
						aria-label="Collapse card"
						onClick={() => setExpandedKey(null)}
					/>
				) : null}

				<div className={styles.overviewMaterialsList}>
					{familyMaterials.map((material) => {
						const key = normalizeMaterialKey(material);
						const seen = seenMaterialKeys.has(key);
						const familyParent = material.olfactiveFamily?.[0];
						const color = familyParent
							? resolveCategoryColor(familyParent)
							: NEUTRAL_CATEGORY_COLOR;

						if (!seen) {
							return <HiddenMasteryCard key={key} color={color} />;
						}

						return (
							<SeenMasteryCard
								key={key}
								material={material}
								targetValue={getMasteryValue(materialMastery, key)}
								expanded={expandedKey === key}
								onToggle={() =>
									setExpandedKey((current) => (current === key ? null : key))
								}
							/>
						);
					})}
				</div>

				<div className={shared.gameActions}>
					<button
						type="button"
						className={formStyles.formSubmitButton}
						onClick={() => {
							setExpandedKey(null);
							setSelectedFamily(null);
						}}
					>
						Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.lessonCompleteCard}>
			<div className={styles.lessonCompleteKnownCountContainer}>
				<p className={styles.lessonCompleteKnownLabel}>You know</p>
				<p className={styles.lessonCompleteKnownCount}>
					<span className={styles.lessonStreakAchieved}>{known}</span>/
					{materials.length}
				</p>
				<p className={styles.lessonCompleteKnownSubLabel}>materials</p>
			</div>

			<div className={styles.categoryProgressGrid}>
				{categories.map((cat) => {
					const canOpen = cat.known > 0;

					return (
						<button
							key={cat.family}
							type="button"
							className={`${styles.categoryProgressCard} ${styles.overviewFamilyCard}`}
							data-updated={canOpen}
							disabled={!canOpen}
							style={{
								background: `linear-gradient(${hexToRgba(cat.color, 0.4)}, ${hexToRgba(cat.color, 0.4)}), #0b172d`,
								borderColor: hexToRgba(cat.color, 0.55),
							}}
							title={cat.label}
							aria-label={`${cat.label}: ${cat.known} of ${cat.total}`}
							onClick={() => {
								if (canOpen) setSelectedFamily(cat.family);
							}}
						>
							<span className={styles.categoryProgressCount}>
								{cat.known}/{cat.total}
							</span>
							<span className={styles.categoryProgressLabel}>{cat.label}</span>
						</button>
					);
				})}
			</div>

			<div className={shared.gameActions}>
				<button
					type="button"
					className={formStyles.formSubmitButton}
					onClick={onBack}
				>
					Back
				</button>
			</div>
		</div>
	);
}
