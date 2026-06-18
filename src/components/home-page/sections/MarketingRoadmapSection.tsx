import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { authedFetch } from "@/utils/authed-fetch";
import type {
	RoadmapItem,
	RoadmapGetResponse,
	RoadmapToggleResponse,
} from "@/routes/api.roadmap";

type MarketingRoadmapSectionProps = {
	styles: Record<string, string>;
	isLoggedIn: boolean;
};

const RoadmapFeature = ({
	title,
	upvotes,
	hasUpvoted,
	disabled,
	isPending,
	onToggle,
	styles,
}: {
	title: string;
	upvotes: number;
	hasUpvoted: boolean;
	disabled: boolean;
	isPending: boolean;
	onToggle: () => void;
	styles: Record<string, string>;
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
					data-upvoted={hasUpvoted ? "true" : "false"}
					className={styles.voteButton}
					style={{ borderColor: hasUpvoted ? "#0CCE6B" : "#F5F7FA" }}
					aria-label={
						hasUpvoted ? `Remove upvote for ${title}` : `Upvote ${title}`
					}
					aria-pressed={hasUpvoted}
					aria-busy={isPending}
				>
					{isPending ? (
						<svg
							className={styles.roadmapSpinner}
							viewBox="0 0 24 24"
							aria-hidden="true"
							focusable="false"
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
						<>
							<span className={styles.iconArrow}>
								<svg
									width="18"
									height="10"
									viewBox="0 0 18 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									focusable="false"
								>
									<path
										d="M1 8.9895L7.50518 1.67117C8.30076 0.776143 9.69924 0.776143 10.4948 1.67117L17 8.9895"
										stroke={hasUpvoted ? "#0CCE6B" : "#F5F7FA"}
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</span>

							<span className={styles.iconRemove}>
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									focusable="false"
								>
									<path
										d="M3 3L11 11M11 3L3 11"
										stroke="#0CCE6B"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
};

const MarketingRoadmapSection = ({
	styles,
	isLoggedIn,
}: MarketingRoadmapSectionProps) => {
	const [roadmapFeatures, setRoadmapFeatures] = useState<RoadmapItem[]>([]);
	const [roadmapLoading, setRoadmapLoading] = useState(true);
	const [pendingFeatureId, setPendingFeatureId] = useState<number | null>(null);
	const [showLoginModal, setShowLoginModal] = useState(false);

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
		let isCancelled = false;
		void loadRoadmap(() => isCancelled);
		return () => {
			isCancelled = true;
		};
	}, [isLoggedIn]);

	useEffect(() => {
		if (!showLoginModal) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [showLoginModal]);

	const handleToggleUpvote = async (featureId: number) => {
		if (!isLoggedIn) {
			setShowLoginModal(true);
			return;
		}

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
		<div className={styles.roadmapContainer} id="roadmap">
			<h2>Roadmap</h2>
			<div className={styles.roadmapDescriptionContainer}>
				<p className={styles.roadmapDescription}>
					We want to make sure Fumestory helps you in your journey to create
					incredible aromas and perfumes. For this reason we are very glad to
					listen to any feedback you might have to improve this experience. Feel
					free to drop a feature request or improvement suggestion. Here is a
					list of features on the roadmap, you can upvote the ones you would
					like to see soonest.
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
							disabled={pendingFeatureId === feature.id}
							isPending={pendingFeatureId === feature.id}
							onToggle={() => handleToggleUpvote(feature.id)}
							styles={styles}
						/>
					))
				)}
			</div>
			{showLoginModal && (
				<div
					className={styles.loginModalOverlay}
					onClick={() => setShowLoginModal(false)}
				>
					<div
						className={styles.loginModal}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="login-required-title"
					>
						<h3 id="login-required-title">You must be logged in to upvote</h3>

						<Link
							to="/auth/$pathname"
							params={{ pathname: "sign-in" }}
							className={`${styles.loginModalButton} ${styles.linkButton}`}
							onClick={() => setShowLoginModal(false)}
						>
							Login
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default MarketingRoadmapSection;
