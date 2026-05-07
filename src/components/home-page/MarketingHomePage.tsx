import { authClient } from "../../../auth";
import MarketingHeaderSection from "./sections/MarketingHeaderSection";
import MarketingHeroSection from "./sections/MarketingHeroSection";
import MarketingInterfaceSection from "./sections/MarketingInterfaceSection";
import MarketingFeaturesSection from "./sections/MarketingFeaturesSection";
import MarketingRoadmapSection from "./sections/MarketingRoadmapSection";
import styles from "./MarketingHomePage.module.css";

const MarketingHomePage = () => {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;

	return (
		<div className={styles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={styles} />
			<div className={styles.content}>
				<MarketingHeroSection isLoggedIn={isLoggedIn} styles={styles} />
				<MarketingInterfaceSection styles={styles} />
				<MarketingFeaturesSection styles={styles} />
				<MarketingRoadmapSection styles={styles} isLoggedIn={isLoggedIn} />
			</div>
		</div>
	);
};

export default MarketingHomePage;
