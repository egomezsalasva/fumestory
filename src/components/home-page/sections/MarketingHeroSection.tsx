import { Link } from "@tanstack/react-router";

type MarketingHeroSectionProps = {
	isLoggedIn: boolean;
	styles: Record<string, string>;
};

const MarketingHeroSection = ({
	isLoggedIn,
	styles,
}: MarketingHeroSectionProps) => {
	return (
		<div className={styles.contentHero}>
			<h1>
				Fumestory, Your
				<br />
				Perfume Creation Journey
				<br />
				Organized
			</h1>
			<div className={styles.buttonContainer}>
				<div className={styles.buttonColumn}>
					{isLoggedIn ? (
						<Link to="/inventory" className={styles.buttonHero}>
							Dashboard
						</Link>
					) : (
						<Link
							to="/auth/$pathname"
							params={{ pathname: "sign-up" }}
							className={styles.buttonHero}
						>
							Get Started
						</Link>
					)}
					<span className={styles.buttonLabel}>multi-device, AI agents</span>
				</div>
				<div className={styles.buttonColumn}>
					<Link to="/download-releases" className={styles.buttonSecondaryHero}>
						Download
					</Link>
					<span className={styles.buttonLabel}>offline, no AI agents</span>
				</div>
			</div>
		</div>
	);
};

export default MarketingHeroSection;
