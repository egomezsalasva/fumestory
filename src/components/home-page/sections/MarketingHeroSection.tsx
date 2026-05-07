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
				<a href="#features" className={styles.buttonSecondaryHero}>
					See Features
				</a>
			</div>
		</div>
	);
};

export default MarketingHeroSection;
