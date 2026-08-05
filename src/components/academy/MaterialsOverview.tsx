import { useState } from "react";
import type { MaterialRecord } from "@/curation/materials/types";
import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";
import shared from "./shared.module.css";
import {
	getMaterialDisplayNames,
	getMasteryValue,
	MASTERY_TARGET,
	normalizeMaterialKey,
	type MaterialMasteryMap,
} from "@/components/academy/utils";
import {
	capitalizeWordStartsIfLower,
	toTitleCaseWords,
} from "@/utils/display-names";
import {
	hexToRgba,
	NEUTRAL_CATEGORY_COLOR,
	resolveCategoryColor,
} from "@/utils/curated-category-colors";

type MaterialsOverviewProps = {
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	seenMaterialKeys: ReadonlySet<string>;
	materialMastery: MaterialMasteryMap;
	onBack: () => void;
};

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

function MaterialMasteryCard({
	material,
	targetValue,
	seen,
}: {
	material: MaterialRecord;
	targetValue: number;
	seen: boolean;
}) {
	const displayNames = getMaterialDisplayNames(material);
	const familyParent = material.olfactiveFamily?.[0];
	const color = familyParent
		? resolveCategoryColor(familyParent)
		: NEUTRAL_CATEGORY_COLOR;
	const progress = seen ? Math.min(1, targetValue / MASTERY_TARGET) : 0;

	return (
		<div
			className={`${styles.materialMasteryCard}${
				targetValue >= MASTERY_TARGET
					? ` ${styles.materialMasteryComplete}`
					: ""
			}`}
			data-seen={seen}
			style={{
				background: `linear-gradient(${hexToRgba(color, 0.4)}, ${hexToRgba(color, 0.4)}), #0b172d`,
				borderColor: hexToRgba(color, 0.55),
			}}
		>
			<div className={styles.materialMasteryHeader}>
				<span className={styles.materialMasteryLabel}>
					{seen
						? capitalizeWordStartsIfLower(
								displayNames[0] ?? material.canonicalName,
							)
						: "?"}
				</span>
			</div>
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

				<div
					className={styles.lessonCompleteMaterialsList}
					data-count={count >= 4 ? 4 : 3}
				>
					{familyMaterials.map((material) => {
						const key = normalizeMaterialKey(material);
						return (
							<MaterialMasteryCard
								key={key}
								material={material}
								targetValue={getMasteryValue(materialMastery, key)}
								seen={seenMaterialKeys.has(key)}
							/>
						);
					})}
				</div>

				<div className={shared.gameActions}>
					<button
						type="button"
						className={formStyles.formSubmitButton}
						onClick={() => setSelectedFamily(null)}
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
