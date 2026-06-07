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
import { authedFetch } from "@/utils/authed-fetch";
import type { DilutionBlindTestStats } from "@/routes/api.scent-blind-tests";
import {
	USER_SETTINGS_UPDATED_EVENT,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import {
	NAV_ELIGIBILITY_UPDATED_EVENT,
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
	const active = targetHashKey
		? pathMatches && hashNorm(location.hash) === targetHashKey
		: pathMatches && !hashNorm(location.hash);

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
	const [guestFeedbackEnabled, setGuestFeedbackEnabled] = useState<
		boolean | null
	>(null);
	const [scentBlindTestEnabled, setScentBlindTestEnabled] = useState<
		boolean | null
	>(null);
	const [hasScentTests, setHasScentTests] = useState(false);
	const [hasRawMaterials, setHasRawMaterials] = useState(false);
	const [hasDilutions, setHasDilutions] = useState(false);
	const [hasCompositions, setHasCompositions] = useState(false);

	const loadGuestFeedbackSetting = useCallback(async () => {
		try {
			const [res, materialsRes, dilutionsRes, compositionsRes] =
				await Promise.all([
					authedFetch("/api/user-settings"),
					authedFetch("/api/raw-materials"),
					authedFetch("/api/dilutions"),
					authedFetch("/api/compositions"),
				]);
			const json = (await res.json()) as {
				data?: UserSettingsEffective;
			};
			const materialsJson = (await materialsRes.json()) as {
				data?: unknown[];
			};
			const dilutionsJson = (await dilutionsRes.json()) as {
				data?: unknown[];
			};
			const compositionsJson = (await compositionsRes.json()) as {
				data?: unknown[];
			};

			setHasRawMaterials(
				materialsRes.ok &&
					Array.isArray(materialsJson.data) &&
					materialsJson.data.length > 0,
			);
			setHasDilutions(
				dilutionsRes.ok &&
					Array.isArray(dilutionsJson.data) &&
					dilutionsJson.data.length > 0,
			);
			setHasCompositions(
				compositionsRes.ok &&
					Array.isArray(compositionsJson.data) &&
					compositionsJson.data.length > 0,
			);

			if (res.ok && json.data) {
				setGuestFeedbackEnabled(json.data.guest_feedback_enabled);
				setScentBlindTestEnabled(json.data.scent_blind_test_enabled);

				if (json.data.scent_blind_test_enabled) {
					const testRes = await authedFetch("/api/scent-blind-tests");
					const testJson = (await testRes.json()) as {
						data?: DilutionBlindTestStats[];
					};
					setHasScentTests(
						testRes.ok &&
							Array.isArray(testJson.data) &&
							testJson.data.length > 0,
					);
				} else {
					setHasScentTests(false);
				}
			} else {
				setGuestFeedbackEnabled(false);
				setScentBlindTestEnabled(false);
				setHasScentTests(false);
			}
		} catch {
			setGuestFeedbackEnabled(false);
			setScentBlindTestEnabled(false);
			setHasScentTests(false);
			setHasRawMaterials(false);
			setHasDilutions(false);
			setHasCompositions(false);
		}
	}, []);

	useEffect(() => {
		void loadGuestFeedbackSetting();
	}, [loadGuestFeedbackSetting]);

	useEffect(() => {
		const handler = () => {
			void loadGuestFeedbackSetting();
		};
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, handler);
		return () => {
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, handler);
		};
	}, [loadGuestFeedbackSetting]);

	useEffect(() => {
		const handler = (e: Event) => {
			const patch = (e as CustomEvent<NavEligibilityPatch>).detail;
			if (patch.hasRawMaterials) setHasRawMaterials(true);
			if (patch.hasDilutions) setHasDilutions(true);
			if (patch.hasCompositions) setHasCompositions(true);
			if (patch.hasScentTests) setHasScentTests(true);
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
								disabled={!hasCompositions}
								disabledTooltip="Add a Composition first"
							/>
							<NavBodySectionItem
								icon={<CompositionIcon />}
								to="/add-composition"
								title="Add Composition"
								disabled={!hasDilutions}
								disabledTooltip="Add a Dilution first"
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
								disabled={!hasRawMaterials}
								disabledTooltip="Add a Raw Material first"
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
								disabled={!hasRawMaterials}
								disabledTooltip="Add a Raw Material first"
							/>
							{guestFeedbackEnabled === true && (
								<NavBodySectionItem
									icon={<CupIcon />}
									to="/add-feedback"
									title="Guest Feedback"
									addOnPill
									disabled={!hasDilutions}
									disabledTooltip="Add a Dilution first"
								/>
							)}
						</div>
					</div>
					{scentBlindTestEnabled === true && (
						<div className={styles.navBodySection}>
							<div className={styles.navBodySectionTitle}>LEARNING</div>
							<div className={styles.navBodySectionItems}>
								<NavBodySectionItem
									icon={<PercentageIcon />}
									to="/scent-knowledge"
									title="Scent Knowledge"
									addOnPill
									disabled={!hasScentTests}
									disabledTooltip="Add a Scent Blind Test to view"
								/>
								<NavBodySectionItem
									icon={<EyeIcon />}
									to="/scent-blind-test"
									title="Scent Blind Test"
									addOnPill
									disabled={!hasDilutions}
									disabledTooltip="Add a Dilution first"
								/>
							</div>
						</div>
					)}
					<div className={styles.navBodySection}>
						<div className={styles.navBodySectionTitle}>PROJECT</div>
						<div className={styles.navBodySectionItems}>
							<NavBodySectionItem
								icon={<CogIcon />}
								to="/project-settings"
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
