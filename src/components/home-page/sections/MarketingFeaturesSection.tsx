import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type MarketingFeaturesSectionProps = {
	styles: Record<string, string>;
};

const FeatureItem = ({
	title,
	image,
	children,
	styles,
}: {
	title: string;
	image?: string;
	children: ReactNode;
	styles: Record<string, string>;
}) => {
	return (
		<div className={styles.featureItem}>
			<div
				className={`${styles.featureItemContent} ${image ? styles.featureItemContent_image : ""}`}
			>
				<h3>{title}</h3>
				{children}
			</div>
			{image && (
				<div className={styles.featureItemImage}>
					<img src={image} alt={title} />
				</div>
			)}
		</div>
	);
};

const MarketingFeaturesSection = ({
	styles,
}: MarketingFeaturesSectionProps) => {
	return (
		<div className={styles.featuresContainer} id="features">
			<h2>How Fumestory Can Help You</h2>
			<div className={styles.featuresGrid}>
				<FeatureItem
					title="Raw Material Inventory"
					image="/inventory.webp"
					styles={styles}
				>
					<p>
						A overview table to view all your raw material information. This
						information includes custom labels for your materials, the material
						name, if its a natural of synthetic material, material category, if
						the material is for a base, mid or top note, the list of notes the
						material has and how many dilutions are available. You can sort and
						filter any of these properties.
					</p>
					<p>Easily add new entries with help of the inventory AI agent.</p>
				</FeatureItem>

				<FeatureItem title="Track Your Dilutions" styles={styles}>
					<p>
						Add dilutions of the raw materials so you can easily track when you
						are running low when creating formulas.
					</p>
					<p>
						Turn off availability when you run out. Formula creations will
						automatically update the dilutions total discounting how much was
						used from the dilution.
					</p>
				</FeatureItem>

				<FeatureItem title="IFRA Compliance" styles={styles}>
					<p>
						When adding a raw material name or CAS number, you will get IFRA
						Standard Category 4 warnings including prohibition, restriction, or
						specification details.
					</p>
					<p>
						If enabled, you will get restrictions warnings on formulas when
						going over the allowed percentage.
					</p>
				</FeatureItem>

				<FeatureItem title="Agents" image="/formulas.webp" styles={styles}>
					<p>
						Fumestory has three agents to assist you. The Raw Materials Agent
						helps with data entry. The Compositions Agent helps you create a
						starter formula. The Formula Mod Agent helps you modify and improve
						the composition you are working on.
					</p>
					<p>
						You can easily disable agents if you prefer to work without AI
						assistance and it will save in your settings and not show up again
						unless you re-enable them.
					</p>
				</FeatureItem>

				<FeatureItem
					title="From Idea To Formula"
					image="/compositions-formula.webp"
					styles={styles}
				>
					<p>
						Keep your composition ideas organized. Pick the composition type, be
						it a perfume, and accord or just a trial. In each composition you
						will have the history of the formulas to keep track of the evolution
						of the composition.
					</p>
					<p>
						The formulas keep track of the weights and ratios so you can easily
						calculate the total weight of each raw material. This also helps you
						scale up the total weight of the composition once you have a formula
						you like.
					</p>
				</FeatureItem>

				<FeatureItem title="Add-On Features" styles={styles}>
					<p>
						Fumestory dashboard is customizable and lets you pick additional
						features to be displayed.
					</p>
					<p>
						Currently there is a guest feedback feature that allows you to add
						feedback from friends or coworkers to get direct feedback on the
						dilution scents. There is also a feature to do blind tests to test
						your knowledge of your raw materials.
					</p>
				</FeatureItem>
			</div>
			<Link to="/features" resetScroll className={styles.buttonSecondaryHero}>
				View All Features
			</Link>
		</div>
	);
};

export default MarketingFeaturesSection;
