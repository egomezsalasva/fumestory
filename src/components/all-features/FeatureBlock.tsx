import type { FeatureDefinition } from "./features-data";
import styles from "./all-features.module.css";
import { FeatureRelatedLinks } from "./FeatureRelatedLinks";

type FeatureBlockProps = {
	feature: FeatureDefinition;
};

function hashString(s: string) {
	let h = 2166136261;
	for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	return h >>> 0;
}

function blobStyleForFeature(id: string): React.CSSProperties {
	const h = hashString(id);
	const pick = (shift: number, min: number, max: number) =>
		min + ((h >> shift) % (max - min + 1));

	return {
		"--b1-x": `${pick(0, 5, 90)}%`,
		"--b1-y": `${pick(4, 5, 85)}%`,
		"--b1-w": `${pick(8, 45, 85)}%`,
		"--b1-h": `${pick(12, 40, 90)}%`,
		"--b2-x": `${pick(16, 5, 90)}%`,
		"--b2-y": `${pick(20, 5, 85)}%`,
		"--b2-w": `${pick(24, 40, 90)}%`,
		"--b2-h": `${pick(28, 35, 95)}%`,
		"--b3-x": `${pick(1, 10, 90)}%`,
		"--b3-y": `${pick(5, 20, 95)}%`,
		"--b4-x": `${pick(9, 5, 90)}%`,
		"--b4-y": `${pick(13, 10, 80)}%`,
		"--b3-w": `${pick(1, 60, 95)}%`,
		"--b3-h": `${pick(5, 45, 85)}%`,
		"--b4-w": `${pick(9, 40, 80)}%`,
		"--b4-h": `${pick(13, 35, 90)}%`,
	} as React.CSSProperties;
}

export function FeatureBlock({ feature }: FeatureBlockProps) {
	return (
		<article id={feature.id} className={styles.featureBlock}>
			<div className={styles.featureContent}>
				<h3>{feature.title}</h3>
				{feature.descriptions.map((text) => (
					<p key={text}>{text}</p>
				))}
				{feature.relatedFeatureIds && (
					<FeatureRelatedLinks relatedFeatureIds={feature.relatedFeatureIds} />
				)}
			</div>
			{feature.image && (
				<div
					className={styles.featureImage}
					style={blobStyleForFeature(feature.id)}
				>
					<div className={styles.featureImageInner}>
						<img src={feature.image} alt={feature.title} />
					</div>
				</div>
			)}
		</article>
	);
}
