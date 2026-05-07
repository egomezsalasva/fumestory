import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "../../../auth";
import { authedFetch } from "@/utils/authed-fetch";
import type {
	RoadmapItem,
	RoadmapGetResponse,
	RoadmapToggleResponse,
} from "@/routes/api.roadmap";
import styles from "./MarketingHomePage.module.css";

type InterfaceTab = {
	title: string;
	image: string;
};

const INTERFACE_TABS: InterfaceTab[] = [
	{ title: "Inventory", image: "/inventory.png" },
	{ title: "Add Raw Material", image: "/add-raw-material.png" },
	{ title: "Add Dilution", image: "/add-dilution.png" },
	{ title: "Compositions", image: "/formulas.png" },
	{ title: "Formulas", image: "/formulas.png" },
];

const InterfaceItem = ({
	title,
	isActive,
	progressPercent = 0,
	onClick,
}: {
	title: string;
	isActive: boolean;
	progressPercent: number;
	onClick: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={`${styles.interfaceItem} ${isActive ? styles.interfaceItem_active : ""}`}
		>
			{isActive && (
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					xmlns="http://www.w3.org/2000/svg"
					className={styles.interfaceItemIcon_left}
				>
					<path d="M8 8H0C4.41828 8 8 4.41828 8 0V8Z" />
				</svg>
			)}
			{title}
			{isActive && (
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					xmlns="http://www.w3.org/2000/svg"
					className={styles.interfaceItemIcon_right}
				>
					<path d="M8 8H0C4.41828 8 8 4.41828 8 0V8Z" />
				</svg>
			)}
			<div className={styles.progressBar}>
				<div
					className={styles.progressBarFill}
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
};

const FeatureItem = ({
	title,
	image,
	children,
}: {
	title: string;
	image?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={styles.featureItem}>
			<div
				className={`${styles.featureItemContent} ${image ? styles.featureItemContent_image : ""}`}
			>
				<h3>{title}</h3>
				{children}
			</div>
			{image && (
				<div className={styles.featureItemImage}>
					<img src={image} alt={title} />
				</div>
			)}
		</div>
	);
};

const RoadmapFeature = ({
	title,
	upvotes,
	hasUpvoted,
	disabled,
	isPending,
	onToggle,
}: {
	title: string;
	upvotes: number;
	hasUpvoted: boolean;
	disabled: boolean;
	isPending: boolean;
	onToggle: () => void;
}) => {
	return (
		<div className={styles.roadmapFeatureItem}>
			<h3>{title}</h3>
			<div className={styles.roadmapFeatureUpvotes}>
				<p
					className={styles.roadmapFeatureUpvotesCount}
					style={{ color: hasUpvoted ? "#0CCE6B" : "#F5F7FA" }}
				>
					{upvotes}
				</p>
				<button
					type="button"
					onClick={onToggle}
					disabled={disabled}
					style={{ borderColor: hasUpvoted ? "#0CCE6B" : "#F5F7FA" }}
				>
					{isPending ? (
						<svg
							className={styles.roadmapSpinner}
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								className={styles.roadmapSpinnerTrack}
							/>
							<path
								d="M22 12a10 10 0 0 1-10 10"
								className={styles.roadmapSpinnerHead}
							/>
						</svg>
					) : (
						<svg
							width="18"
							height="10"
							viewBox="0 0 18 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1 8.9895L7.50518 1.67117C8.30076 0.776143 9.69924 0.776143 10.4948 1.67117L17 8.9895"
								stroke={hasUpvoted ? "#0CCE6B" : "#F5F7FA"}
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};

const MarketingHomePage = () => {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;
	const [activeIndex, setActiveIndex] = useState(0);
	const activeTab = INTERFACE_TABS[activeIndex];
	const [slideProgress, setSlideProgress] = useState(0);
	const slideStartRef = useRef<number>(performance.now());

	const [roadmapFeatures, setRoadmapFeatures] = useState<RoadmapItem[]>([]);
	const [roadmapLoading, setRoadmapLoading] = useState(true);
	const [pendingFeatureId, setPendingFeatureId] = useState<number | null>(null);

	const loadRoadmap = async (cancelled?: () => boolean) => {
		try {
			setRoadmapLoading(true);
			const response = isLoggedIn
				? await authedFetch("/api/roadmap")
				: await fetch("/api/roadmap");
			if (!response.ok) return;
			const json = (await response.json()) as RoadmapGetResponse;
			if (json.success && !(cancelled?.() ?? false)) {
				setRoadmapFeatures(json.data);
			}
		} catch (error) {
			console.error("Failed to load roadmap", error);
		} finally {
			if (!(cancelled?.() ?? false)) {
				setRoadmapLoading(false);
			}
		}
	};

	useEffect(() => {
		let raf = 0;
		const ms = 10_000;
		const tick = (now: number) => {
			const elapsed = now - slideStartRef.current;
			if (elapsed >= ms) {
				setActiveIndex((i) => (i + 1) % INTERFACE_TABS.length);
				slideStartRef.current = now;
				setSlideProgress(0);
			} else {
				setSlideProgress((elapsed / ms) * 100);
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);

	useEffect(() => {
		let isCancelled = false;
		void loadRoadmap(() => isCancelled);
		return () => {
			isCancelled = true;
		};
	}, [isLoggedIn]);

	const handleTabClick = (index: number) => {
		setActiveIndex(index);
		slideStartRef.current = performance.now();
		setSlideProgress(0);
	};

	const handleToggleUpvote = async (featureId: number) => {
		if (!isLoggedIn) return;

		setPendingFeatureId(featureId);
		try {
			const response = await authedFetch("/api/roadmap", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ featureId }),
			});
			if (!response.ok) throw new Error("Toggle failed");

			(await response.json()) as RoadmapToggleResponse;

			// Refresh values from server truth, but keep current visible order.
			const refreshResponse = await authedFetch("/api/roadmap");
			if (!refreshResponse.ok) throw new Error("Refresh failed");

			const refreshJson = (await refreshResponse.json()) as RoadmapGetResponse;
			if (refreshJson.success) {
				setRoadmapFeatures((prev) => {
					const byId = new Map(refreshJson.data.map((item) => [item.id, item]));
					return prev.map((item) => byId.get(item.id) ?? item);
				});
			}
		} catch (error) {
			console.error("Failed to toggle roadmap upvote", error);
		} finally {
			setPendingFeatureId(null);
		}
	};

	return (
		<div className={styles.container}>
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

			<div className={styles.content}>
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

				<div className={styles.interfaceContainer}>
					<div className={styles.interfaceList}>
						{INTERFACE_TABS.map((tab, index) => (
							<InterfaceItem
								key={tab.title}
								title={tab.title}
								isActive={index === activeIndex}
								progressPercent={index === activeIndex ? slideProgress : 0}
								onClick={() => handleTabClick(index)}
							/>
						))}
					</div>
					<div className={styles.interfaceImage}>
						<div className={styles.interfaceImageContent}>
							<img src={activeTab.image} alt={activeTab.title} />
						</div>
					</div>
				</div>

				<div className={styles.featuresContainer} id="features">
					<h2>How Fumestory Can Help You</h2>
					<div className={styles.featuresGrid}>
						<FeatureItem title="Raw Material Inventory" image="/inventory.png">
							<p>
								A overview table to view all your raw material information. This
								information includes custom labels for your materials, the
								material name, if its a natural of synthetic material, material
								category, if the material is for a base, mid or top note, the
								list of notes the material has and how many dilutions are
								available. You can sort and filter any of these properties.
							</p>
							<p>Easily add new entries with help of the inventory AI agent.</p>
						</FeatureItem>

						<FeatureItem title="Track Your Dilutions">
							<p>
								Add dilutions of the raw materials so you can easily track when
								you are running low when creating formulas.
							</p>
							<p>
								Turn off availability when you run out. Formula creations will
								automatically update the dilutions total discounting how much
								was used from the dilution.
							</p>
						</FeatureItem>

						<FeatureItem title="Inventory Agent">
							<p>
								The Inventory Agent is a AI assistant that helps with adding new
								raw materials to the inventory. It will fetch the needed
								information from the AI model and format it so you can
								autocomplete the form in seconds.
							</p>
							<p>This significantly speeds up the data entry process.</p>
						</FeatureItem>

						<FeatureItem title="Formulas Agent" image="/formulas.png">
							<p>
								The Formulas Agent is a AI assistant that helps with creating
								compositions and formulas. You can let the agent know what your
								idea is or you can give it a reference of a perfume you like and
								it will suggest you a formula to start with. You can let the
								agent know if you want to exclusively use raw materials from
								your inventory or if you want the agent to suggest additional
								materials.
							</p>
							<p>
								Once you have a starting point, the agent will keep on helping
								you with iterations to fine-tune the formula to your liking.
							</p>
						</FeatureItem>

						<FeatureItem title="From Idea To Formula" image="/formulas.png">
							<p>
								Keep your composition ideas organized. Pick the composition
								type, be it a perfume, and accord or just a trial. In each
								composition you will have the history of the formulas to keep
								track of the evolution of the composition.
							</p>
							<p>
								The formulas keep track of the weights and ratios so you can
								easily calculate the total weight of each raw material. This
								also helps you scale up the total weight of the composition once
								you have a formula you like.
							</p>
						</FeatureItem>

						<FeatureItem title="Add-On Features">
							<p>
								Fumestory dashboard is customizable and lets you pick additional
								features to be displayed.
							</p>
							<p>
								Currently there is a guest feedback feature that allows you to
								add feedback from friends or coworkers to get direct feedback on
								the dilution scents. There is also a feature to do blind tests
								to test your knowledge of your raw materials.
							</p>
						</FeatureItem>
					</div>
				</div>

				<div className={styles.roadmapContainer} id="roadmap">
					<h2>Roadmap</h2>
					<div className={styles.roadmapDescriptionContainer}>
						<p className={styles.roadmapDescription}>
							We want to make sure Fumestory helps you in your journey to create
							incredible aromas and perfumes. For this reason we are very glad
							to listen to any feedback you might have to improve this
							experience. Feel free to drop a feature request or improvement
							suggestion. Here is a list of features on the roadmap, you can
							upvote the ones you would like to see soonest.
						</p>
					</div>

					<div className={styles.roadmapFeatures}>
						{roadmapLoading ? (
							<p>Loading roadmap...</p>
						) : (
							roadmapFeatures.map((feature) => (
								<RoadmapFeature
									key={feature.id}
									title={feature.title}
									upvotes={feature.upvotes}
									hasUpvoted={feature.has_upvoted}
									disabled={!isLoggedIn || pendingFeatureId === feature.id}
									isPending={pendingFeatureId === feature.id}
									onToggle={() => handleToggleUpvote(feature.id)}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MarketingHomePage;
