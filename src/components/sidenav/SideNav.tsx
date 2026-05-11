import {
	Link,
	useMatchRoute,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { authClient } from "../../../auth";
import styles from "./SideNav.module.css";
import ProfileIcon from "./svgs/ProfileIcon";
import TableIcon from "./svgs/TableIcon";
import CompositionIcon from "./svgs/CompositionIcon";
import BoxIcon from "./svgs/BoxIcon";
import LayersIcon from "./svgs/LayersIcon";
import CupIcon from "./svgs/CupIcon";
import CogIcon from "../svgs/CogIcon";
// import StarIcon from "./svgs/StarIcon";
import UpcomingFeaturesIcon from "./svgs/UpcomingFeaturesIcon";
import { useState } from "react";

const NavBodySectionItem: React.FC<{
	icon: React.ReactNode;
	to: string;
	hash?: string;
	title: string;
	addOnPill?: boolean;
}> = ({ icon, to, hash, title, addOnPill = false }) => {
	const matchRoute = useMatchRoute();
	const { location } = useRouterState();

	const [toPath] = to.split("#");
	const targetHash = hash ?? "";
	const pathMatches = !!matchRoute({ to, fuzzy: false });
	const active = targetHash
		? pathMatches && location.hash === targetHash
		: pathMatches && !location.hash;

	return (
		<Link
			to={toPath}
			hash={targetHash ? targetHash.replace(/^#/, "") : undefined}
			className={`${styles.navBodySectionItem} ${active ? styles.navBodySectionItem_active : ""}`}
		>
			{icon}
			<span className={styles.navBodySectionItemTitle}>{title}</span>
			{addOnPill && <span className={styles.addOnPill}>Add-on</span>}
		</Link>
	);
};

const SideNav = () => {
	const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
	const navigate = useNavigate();
	const handleSignOut = async () => {
		await authClient.signOut();
		navigate({ to: "/", replace: true });
	};
	const handleAccountMenuOpen = () => {
		setIsAccountMenuOpen(true);
	};

	const handleAccountMenuClose = () => {
		setIsAccountMenuOpen(false);
	};
	return (
		<header className={styles.container}>
			<nav>
				<div className={styles.navHeader}>
					<div className={styles.logo}>FUMESTORY</div>
					<div className={styles.accountIcon} onClick={handleAccountMenuOpen}>
						<ProfileIcon />
					</div>

					{isAccountMenuOpen && (
						<div className={styles.accountMenu}>
							<div className={styles.accountMenuSpace} />
							<Link
								to="/account/$pathname"
								params={{ pathname: "profile" }}
								className={styles.accountMenuItem}
								onClick={handleAccountMenuClose}
							>
								Account Settings
							</Link>
							<div className={styles.accountMenuItemSeparator}>
								<div className={styles.accountMenuItemSeparatorLine} />
							</div>
							<div className={styles.accountMenuItem} onClick={handleSignOut}>
								Logout
							</div>
							<div className={styles.accountMenuSpace} />
						</div>
					)}
				</div>
				{isAccountMenuOpen && (
					<div
						className={styles.accountMenuOverlay}
						onClick={handleAccountMenuClose}
					/>
				)}
				<div className={styles.navBody}>
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>COMPOSITIONS</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<TableIcon />}
								to="/compositions"
								title="Compositions"
							/>
							<NavBodySectionItem
								icon={<CompositionIcon />}
								to="/add-composition"
								title="Add Composition"
							/>
							{/* <NavBodySectionItem
								icon={<TableIcon />}
								to="/compositions"
								title="Add Formula"
							/> */}
						</div>
					</div>
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>INVENTORY</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<TableIcon />}
								to="/inventory"
								title="Raw Materials"
							/>
							<NavBodySectionItem
								icon={<BoxIcon />}
								to="/add-raw-material"
								title="Add Raw Material"
							/>
							<NavBodySectionItem
								icon={<LayersIcon />}
								to="/add-dilution"
								title="Add Dilution"
							/>
							<NavBodySectionItem
								icon={<CupIcon />}
								to="/add-feedback"
								title="Guest Feedback"
								addOnPill
							/>
						</div>
					</div>
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>PROJECT</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<CogIcon />}
								to="/project-settings"
								title="Settings"
							/>
							{/* <NavBodySectionItem
								icon={<StarIcon />}
								to="/project-settings"
								hash="#add-on-features"
								title="Add-on Features"
							/> */}
						</div>
					</div>
				</div>
			</nav>
			<div className={styles.navFooter}>
				<div className={styles.navFooterSection}>
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionItems}>
							{/* <NavBodySectionItem
								icon={<SendFeedbackIcon />}
								to="/"
								title="Send Feedback"
							/> */}
							<NavBodySectionItem
								icon={<UpcomingFeaturesIcon />}
								to="/"
								hash="#roadmap"
								title="Upcoming Features"
							/>
						</div>
					</div>
				</div>
				<div className={styles.navFooterSectionCollapse}>
					{/* <div className={styles.collapseButton}>
						<CollapseMenuIcon />
						<span>Collapse Menu</span>
					</div> */}
				</div>
			</div>
		</header>
	);
};

export default SideNav;
