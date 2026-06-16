import { Link } from "@tanstack/react-router";
import { featuresById, type FeatureId } from "./features-data";
import styles from "./all-features.module.css";

type FeatureRelatedLinksProps = {
	relatedFeatureIds: FeatureId[];
};

export function FeatureRelatedLinks({
	relatedFeatureIds,
}: FeatureRelatedLinksProps) {
	const relatedFeatures = relatedFeatureIds
		.map((id) => featuresById[id])
		.filter(Boolean);

	if (relatedFeatures.length === 0) return null;

	return (
		<div className={styles.relatedFeatures}>
			<p>Related features:</p>
			<ul>
				{relatedFeatures.map((related) => (
					<li key={related.id}>
						<Link to="/features" hash={related.id}>
							{related.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
