import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import { FEATURE_SECTIONS } from "@/components/all-features/features-data";
import { FeatureBlock } from "@/components/all-features/FeatureBlock";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import styles from "../components/all-features/all-features.module.css";

const featuresItemListJsonLd = {
	"@context": "https://schema.org",
	"@type": "ItemList",
	name: "Fumestory Features",
	url: "https://fumestory.com/features",
	itemListElement: [
		{
			"@type": "ListItem",
			position: 1,
			name: "Inventory",
			url: "https://fumestory.com/features#inventory",
		},
		{
			"@type": "ListItem",
			position: 2,
			name: "Compositions",
			url: "https://fumestory.com/features#compositions",
		},
		{
			"@type": "ListItem",
			position: 3,
			name: "Settings",
			url: "https://fumestory.com/features#settings",
		},
		{
			"@type": "ListItem",
			position: 4,
			name: "Add-On Features",
			url: "https://fumestory.com/features#addons",
		},
	],
};

export const Route = createFileRoute("/features")({
	head: () => ({
		meta: [
			{ title: "Fumestory Features | Perfumery Software" },
			{
				name: "description",
				content:
					"Explore Fumestory's perfumery software features for raw materials, dilutions, formulas, compositions, and workflow customization.",
			},
			{ name: "robots", content: "index,follow" },
			{
				property: "og:title",
				content: "Fumestory Features | Perfumery Software",
			},
			{
				property: "og:description",
				content:
					"Explore perfumery software features in Fumestory for raw materials, dilutions, formulas, compositions, and scent workflow tools.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://fumestory.com/features" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Fumestory Features | Perfumery Software",
			},
			{
				name: "twitter:description",
				content:
					"Fumestory is perfumery software for organizing raw materials, formulas, and compositions in one workflow.",
			},
		],
		links: [{ rel: "canonical", href: "https://fumestory.com/features" }],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(featuresItemListJsonLd),
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;
	return (
		<div className={homeStyles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<div className={styles.heroContainer}>
					<h1>Fumestory Features</h1>
					<p>
						Here you can explore all features included in Fumestory.
						<br />
						It starts with minimal setup, but offers deep customization to
						support different workflows.
					</p>
				</div>
				<div className={styles.stickyNavWrap_desktop}>
					<div className={`${styles.stickyNav} ${styles.stickyNavGlass}`}>
						<a href="#inventory" className={styles.stickyNavLink}>
							Inventory
						</a>
						<a href="#compositions" className={styles.stickyNavLink}>
							Compositions
						</a>
						<a href="#settings" className={styles.stickyNavLink}>
							Settings
						</a>
						<a href="#addons" className={styles.stickyNavLink}>
							Add-On Features
						</a>
					</div>
				</div>
				{FEATURE_SECTIONS.filter((s) => s.features.length > 0).map(
					(section) => (
						<div
							key={section.title}
							id={section.id}
							style={{ scrollMarginTop: "10rem" }}
						>
							<h2
								className={`${styles.featureSectionTitle} ${styles.stickyNavWrapGlass_mobile}`}
							>
								{section.title}
							</h2>
							{section.features.map((feature) => (
								<FeatureBlock key={feature.id} feature={feature} />
							))}
						</div>
					),
				)}
			</div>
		</div>
	);
}
