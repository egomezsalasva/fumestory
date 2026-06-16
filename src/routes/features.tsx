import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import { FEATURE_SECTIONS } from "@/components/all-features/features-data";
import { FeatureBlock } from "@/components/all-features/FeatureBlock";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import styles from "../components/all-features/all-features.module.css";

export const Route = createFileRoute("/features")({
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
				<div className={styles.stickyNavWrap}>
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
							style={{ scrollMarginTop: "8rem" }}
						>
							<h2 className={styles.featureSectionTitle}>{section.title}</h2>
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
