import { Link } from "@tanstack/react-router";
import { useState } from "react";

type MarketingHeaderSectionProps = {
	isLoggedIn: boolean;
	styles: Record<string, string>;
};

type OpenMenu = "product" | "resources" | null;
type OpenMobileMenu = "product" | "resources" | null;

const MarketingHeaderSection = ({
	isLoggedIn,
	styles,
}: MarketingHeaderSectionProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasMenuInteracted, setHasMenuInteracted] = useState(false);
	const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
	const [openMobileMenu, setOpenMobileMenu] = useState<OpenMobileMenu>(null);

	const handleMenuToggle = () => {
		setHasMenuInteracted(true);
		setIsMenuOpen((prev) => !prev);
	};

	const handleMenuClose = () => {
		setHasMenuInteracted(true);
		setIsMenuOpen(false);
		setOpenMenu(null);
		setOpenMobileMenu(null);
	};

	const closeDesktopMenu = () => setOpenMenu(null);
	const openProductMenu = () => setOpenMenu("product");
	const openResourcesMenu = () => setOpenMenu("resources");

	const toggleMobileMenu = (menu: OpenMobileMenu) => {
		setOpenMobileMenu((prev) => (prev === menu ? null : menu));
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
				<div
					className={`${styles.headerLinks_desktop} ${styles.glassFigma} ${
						openMenu ? styles.headerLinks_desktop_expanded : ""
					}`}
					onMouseLeave={closeDesktopMenu}
				>
					<div className={styles.headerNavPrimary}>
						<div className={styles.productMenu} onMouseEnter={openProductMenu}>
							<span className={styles.link}>Product</span>
						</div>
						<Link
							to="/pricing"
							className={styles.link}
							onMouseEnter={closeDesktopMenu}
						>
							Pricing
						</Link>
						<div
							className={styles.productMenu}
							onMouseEnter={openResourcesMenu}
						>
							<span className={styles.link}>Resources</span>
						</div>
						{isLoggedIn ? (
							<Link
								to="/inventory"
								className={styles.linkButton}
								onMouseEnter={closeDesktopMenu}
							>
								Dashboard
							</Link>
						) : (
							<Link
								to="/auth/$pathname"
								params={{ pathname: "sign-in" }}
								className={styles.linkButton}
								onMouseEnter={closeDesktopMenu}
							>
								Login
							</Link>
						)}
					</div>
					<div
						className={styles.headerNavSecondary}
						onMouseEnter={() => {
							if (openMenu === "product") openProductMenu();
							if (openMenu === "resources") openResourcesMenu();
						}}
					>
						{openMenu === "product" ? (
							<>
								<Link to="/features" className={styles.linkSub}>
									Features
								</Link>
								<Link to="/download-releases" className={styles.linkSub}>
									Releases
								</Link>
							</>
						) : null}
						{openMenu === "resources" ? (
							<Link to="/try-academy" className={styles.linkSub}>
								Academy
							</Link>
						) : null}
					</div>
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
				<button
					type="button"
					className={styles.link}
					onClick={() => toggleMobileMenu("product")}
				>
					Product
				</button>
				{openMobileMenu === "product" ? (
					<>
						<Link
							to="/features"
							className={styles.linkSubMobile}
							onClick={handleMenuClose}
						>
							Features
						</Link>
						<Link
							to="/download-releases"
							className={styles.linkSubMobile}
							onClick={handleMenuClose}
						>
							Releases
						</Link>
					</>
				) : null}
				<Link to="/pricing" className={styles.link} onClick={handleMenuClose}>
					Pricing
				</Link>
				<button
					type="button"
					className={styles.link}
					onClick={() => toggleMobileMenu("resources")}
				>
					Resources
				</button>
				{openMobileMenu === "resources" ? (
					<Link
						to="/try-academy"
						className={styles.linkSubMobile}
						onClick={handleMenuClose}
					>
						Academy
					</Link>
				) : null}
			</div>
		</>
	);
};

export default MarketingHeaderSection;
