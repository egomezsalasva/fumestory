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
			<div className={`${styles.logo} ${styles.glassFigma}`}>Fumestory</div>
			<div className={`${styles.headerLinks} ${styles.glassFigma}`}>
				<a href="#features" className={styles.link}>
					Features
				</a>
				<a href="#roadmap" className={styles.link}>
					Roadmap
				</a>
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
