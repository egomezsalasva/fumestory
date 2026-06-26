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
import StarIcon from "./svgs/StarIcon";
import UpcomingFeaturesIcon from "./svgs/UpcomingFeaturesIcon";
import { useState, useEffect, useCallback } from "react";
import { USER_SETTINGS_UPDATED_EVENT } from "@/utils/user-settings";
import {
	loadNavEligibility,
	NAV_ELIGIBILITY_UPDATED_EVENT,
	type NavEligibility,
	type NavEligibilityPatch,
} from "@/utils/nav-eligibility";
import LockIcon from "./svgs/LockIcon";
import EyeIcon from "./svgs/EyeIcon";
import PercentageIcon from "./svgs/PercentageIcon";

const NavBodySectionItem: React.FC<{
	icon: React.ReactNode;
	to: string;
	hash?: string;
	title: string;
	addOnPill?: boolean;
	disabled?: boolean;
	disabledTooltip?: string;
}> = ({
	icon,
	to,
	hash,
	title,
	addOnPill = false,
	disabled = false,
	disabledTooltip,
}) => {
	const matchRoute = useMatchRoute();
	const { location } = useRouterState();

	const [toPath] = to.split("#");
	const hashNorm = (h: string | undefined) => (h ?? "").replace(/^#/, "");
	const targetHashKey = hashNorm(hash);
	const pathMatches = !!matchRoute({ to, fuzzy: false });
	const currentHash = hashNorm(location.hash);
	const active = targetHashKey
		? pathMatches &&
			(currentHash === targetHashKey ||
				(targetHashKey === "project-settings" && !currentHash))
		: pathMatches && !currentHash;

	if (disabled) {
		return (
			<div className={styles.navItemTooltipWrap}>
				{disabledTooltip && (
					<div className={styles.navItemTooltip} role="tooltip">
						<LockIcon />
						<span>{disabledTooltip}</span>
					</div>
				)}
				<div
					className={`${styles.navBodySectionItem} ${styles.navBodySectionItem_disabled}`}
					aria-disabled="true"
				>
					{icon}
					<span className={styles.navBodySectionItemTitle}>{title}</span>
					{addOnPill && <span className={styles.addOnPill}>Add-on</span>}
				</div>
			</div>
		);
	}

	return (
		<Link
			to={toPath}
			hash={targetHashKey || undefined}
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
	const [eligibility, setEligibility] = useState<NavEligibility | null>(null);

	const refreshEligibility = useCallback(async () => {
		setEligibility(await loadNavEligibility());
	}, []);

	useEffect(() => {
		void refreshEligibility();
	}, [refreshEligibility]);

	useEffect(() => {
		const handler = () => {
			void refreshEligibility();
		};
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, handler);
		return () => {
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, handler);
		};
	}, [refreshEligibility]);

	useEffect(() => {
		const handler = (e: Event) => {
			const patch = (e as CustomEvent<NavEligibilityPatch>).detail;
			setEligibility((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					...(patch.hasRawMaterials && { hasRawMaterials: true }),
					...(patch.hasDilutions && { hasDilutions: true }),
					...(patch.hasCompositions && { hasCompositions: true }),
					...(patch.hasScentTests && { hasScentTests: true }),
				};
			});
		};
		window.addEventListener(NAV_ELIGIBILITY_UPDATED_EVENT, handler);
		return () => {
			window.removeEventListener(NAV_ELIGIBILITY_UPDATED_EVENT, handler);
		};
	}, []);

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

	const showLearningSection =
		eligibility?.materialsQuizEnabled === true ||
		eligibility?.scentBlindTestEnabled === true;

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
								disabled={!eligibility?.hasCompositions}
								disabledTooltip="Add a Composition to view"
							/>
							<NavBodySectionItem
								icon={<CompositionIcon />}
								to="/add-composition"
								title="Add Composition"
								disabled={!eligibility?.hasDilutions}
								disabledTooltip="Add a Dilution to view"
							/>
						</div>
					</div>
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>INVENTORY</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<TableIcon />}
								to="/inventory"
								title="Raw Materials"
								disabled={!eligibility?.hasRawMaterials}
								disabledTooltip="Add a Raw Material to view"
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
								disabled={!eligibility?.hasRawMaterials}
								disabledTooltip="Add a Raw Material to view"
							/>
							{eligibility?.guestFeedbackEnabled === true && (
								<NavBodySectionItem
									icon={<CupIcon />}
									to="/add-feedback"
									title="Guest Feedback"
									addOnPill
									disabled={!eligibility.hasDilutions}
									disabledTooltip="Add a Dilution to view"
								/>
							)}
						</div>
					</div>
					{showLearningSection && (
						<div className={styles.navBodySection}>
							<div className={styles.navBodySectionTitle}>LEARNING</div>
							<div className={styles.navBodySectionItems}>
								{eligibility?.materialsQuizEnabled === true && (
									<NavBodySectionItem
										icon={<BoxIcon />}
										to="/materials-quiz"
										title="Materials Quiz"
										addOnPill
									/>
								)}
								{eligibility?.scentBlindTestEnabled === true && (
									<>
										<NavBodySectionItem
											icon={<PercentageIcon />}
											to="/scent-knowledge"
											title="Scent Knowledge"
											addOnPill
											disabled={!eligibility.hasScentTests}
											disabledTooltip="Add a Scent Blind Test to view"
										/>
										<NavBodySectionItem
											icon={<EyeIcon />}
											to="/scent-blind-test"
											title="Scent Blind Test"
											addOnPill
											disabled={!eligibility.hasDilutions}
											disabledTooltip="Add a Dilution to view"
										/>
									</>
								)}
							</div>
						</div>
					)}
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>PROJECT</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<CogIcon />}
								to="/project-settings"
								hash="#project-settings"
								title="Settings"
							/>
							<NavBodySectionItem
								icon={<StarIcon />}
								to="/project-settings"
								hash="#add-on-features"
								title="Add-on Features"
							/>
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
