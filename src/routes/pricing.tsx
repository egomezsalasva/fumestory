import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import styles from "@/components/pricing/PricingPage.module.css";

const pricingJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Fumestory Pricing",
	url: "https://fumestory.com/pricing",
	description:
		"Pay as you go pricing for Fumestory. Free credits to start, then buy capacity packs when you need more.",
};

const FREE_CREDITS = [
	{ amount: "50", label: "Raw Materials", badge: "FREE" },
	{ amount: "100", label: "Dilutions", badge: "FREE" },
	{ amount: "50", label: "Compositions", badge: "FREE" },
	{ amount: "100", label: "Formula Mods", badge: "FREE" },
] as const;

const CREDIT_PACKS = [
	{
		id: "raw-materials-dilutions",
		lines: ["50 Raw Materials", "+", "50 Dilutions"],
		price: "10€",
	},
	{
		id: "dilutions",
		lines: ["100 Dilutions"],
		price: "10€",
	},
	{
		id: "compositions-mods",
		lines: ["50 Compositions", "+", "50 Formula Mods"],
		price: "10€",
	},
	{
		id: "formula-mods",
		lines: ["100 Formula Mods"],
		price: "10€",
	},
] as const;

export const Route = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Fumestory Pricing | Pay as you go" },
			{
				name: "description",
				content:
					"Not another subscription. Pay as you go for Fumestory — free credits to start, then buy capacity packs when you need more.",
			},
			{ name: "robots", content: "index,follow" },
			{
				property: "og:title",
				content: "Fumestory Pricing | Pay as you go",
			},
			{
				property: "og:description",
				content:
					"Not another subscription. Pay as you go for Fumestory — free credits to start, then buy capacity packs when you need more.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://fumestory.com/pricing" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Fumestory Pricing | Pay as you go",
			},
			{
				name: "twitter:description",
				content:
					"Not another subscription. Pay as you go for Fumestory — free credits to start, then buy capacity packs when you need more.",
			},
		],
		links: [{ rel: "canonical", href: "https://fumestory.com/pricing" }],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(pricingJsonLd),
			},
		],
	}),
	component: PricingPage,
});

function PricingPage() {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;

	return (
		<div className={homeStyles.container} id="pricing">
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<section className={styles.hero}>
					<h1>Not Another Subscription</h1>
					<p className={styles.subhead}>Pay As You Go, Use Whenever</p>
					<p className={styles.lede}>
						Fumestory is pay as you go. Buy credits for the space you need. No
						monthly bill.
					</p>
				</section>

				<section className={styles.section}>
					<div className={styles.freeGrid}>
						{FREE_CREDITS.map((item) => (
							<div key={item.label} className={styles.freeTile}>
								<span className={styles.freeAmount}>{item.amount}</span>
								<span className={styles.freeLabel}>{item.label}</span>
								<span className={styles.freeBadge}>{item.badge}</span>
							</div>
						))}
					</div>
					<p className={styles.note}>
						These free credits let you try Fumestory. Need to onboard an
						existing inventory? <br />
						Reach out to{" "}
						<a href="mailto:info@fumestory.com">info@fumestory.com</a> to redeem
						more onboarding credits for free.
					</p>
				</section>

				<section className={styles.section}>
					<div className={styles.packsGrid}>
						{CREDIT_PACKS.map((pack) => (
							<article key={pack.id} className={styles.packCard}>
								<div className={styles.packLines}>
									{pack.lines.map((line) => (
										<span key={line}>{line}</span>
									))}
								</div>
								<hr className={styles.packDivider} />
								<p className={styles.packPrice}>{pack.price}</p>
								{isLoggedIn ? (
									<Link to="/usage" className={styles.buyButton}>
										Buy Credits
									</Link>
								) : (
									<Link
										to="/auth/$pathname"
										params={{ pathname: "sign-up" }}
										className={styles.buyButton}
									>
										Buy Credits
									</Link>
								)}
							</article>
						))}
					</div>
					<p className={styles.note}>
						Instead of a recurring subscription, Fumestory lets you pay once for
						credits and use them at your own pace.
					</p>
				</section>
			</div>
		</div>
	);
}
