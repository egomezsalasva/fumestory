import { Link } from "@tanstack/react-router";
import { useState } from "react";

type MarketingHeaderSectionProps = {
	isLoggedIn: boolean;
	styles: Record<string, string>;
};

const MarketingHeaderSection = ({
	isLoggedIn,
	styles,
}: MarketingHeaderSectionProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasMenuInteracted, setHasMenuInteracted] = useState(false);

	const handleMenuToggle = () => {
		setHasMenuInteracted(true);
		setIsMenuOpen((prev) => !prev);
	};

	const handleMenuClose = () => {
		setHasMenuInteracted(true);
		setIsMenuOpen(false);
	};

	const menuIconStateClass = hasMenuInteracted
		? isMenuOpen
			? styles.headerMenuIcon_mobile_open
			: styles.headerMenuIcon_mobile_closed
		: "";
	const menuPanelStateClass = hasMenuInteracted
		? isMenuOpen
			? styles.headerLinks_mobile_open
			: styles.headerLinks_mobile_closed
		: "";

	return (
		<>
			<header className={styles.header}>
				<Link to="/" className={styles.logoLink} onClick={handleMenuClose}>
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
				<div
					className={`${styles.headerMenuButton_mobile} ${styles.glassFigma}`}
					onClick={handleMenuToggle}
				>
					<div
						className={`${styles.headerMenuIcon_mobile} ${menuIconStateClass}`}
					>
						<div
							className={`${styles.headerMenuIconLine_mobile} ${styles.headerMenuIconLine_mobile_top}`}
						/>
						<div
							className={`${styles.headerMenuIconLine_mobile} ${styles.headerMenuIconLine_mobile_middle}`}
						/>
						<div
							className={`${styles.headerMenuIconLine_mobile} ${styles.headerMenuIconLine_mobile_bottom}`}
						/>
					</div>
				</div>
			</header>
			<div
				className={`${styles.headerLinks_mobile} ${menuPanelStateClass} ${styles.glassFigma}`}
			>
				<Link to="/features" className={styles.link} onClick={handleMenuClose}>
					Features
				</Link>
				<Link
					to="/"
					hash="roadmap"
					className={styles.link}
					onClick={handleMenuClose}
				>
					Roadmap
				</Link>
			</div>
		</>
	);
};

export default MarketingHeaderSection;
