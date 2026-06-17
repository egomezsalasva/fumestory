import { Link } from "@tanstack/react-router";

type MarketingHeaderSectionProps = {
	isLoggedIn: boolean;
	styles: Record<string, string>;
};

const MarketingHeaderSection = ({
	isLoggedIn,
	styles,
}: MarketingHeaderSectionProps) => {
	return (
		<header className={styles.header}>
			<Link to="/" className={styles.logoLink}>
				<div className={`${styles.logo} ${styles.glassFigma}`}>Fumestory</div>
			</Link>
			<div className={`${styles.headerLinks_desktop} ${styles.glassFigma}`}>
				<Link to="/features" className={styles.link}>
					Features
				</Link>
				<Link to="/" hash="roadmap" className={styles.link}>
					Roadmap
				</Link>
				{isLoggedIn ? (
					<Link to="/inventory" className={styles.linkButton}>
						Dashboard
					</Link>
				) : (
					<Link
						to="/auth/$pathname"
						params={{ pathname: "sign-in" }}
						className={styles.linkButton}
					>
						Login
					</Link>
				)}
			</div>
		</header>
	);
};

export default MarketingHeaderSection;
