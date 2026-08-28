import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import styles from "@/components/all-features/all-features.module.css";

type Release = {
	version: string;
	date: string | null;
	notes: string[];
	downloads: {
		macos: string | null;
		windows: string | null;
	};
};

const RELEASES: Release[] = [
	{
		version: "0.1.0",
		date: null,
		notes: ["Initial offline desktop release."],
		downloads: {
			macos:
				"https://github.com/egomezsalasva/fumestory/releases/download/v0.1.0/Fumestory-mac.zip",
			windows: null,
		},
	},
];

const downloadReleasesJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Fumestory Download & Releases",
	url: "https://fumestory.com/download-releases",
	description:
		"Download Fumestory offline for macOS and Windows, and browse release history.",
};

export const Route = createFileRoute("/download-releases")({
	head: () => ({
		meta: [
			{
				title: "Fumestory Download & Releases | Offline Desktop App",
			},
			{
				name: "description",
				content:
					"Download the Fumestory offline desktop app for macOS and Windows, and browse release notes.",
			},
			{ name: "robots", content: "index,follow" },
			{
				property: "og:title",
				content: "Fumestory Download & Releases | Offline Desktop App",
			},
			{
				property: "og:description",
				content:
					"Download Fumestory offline for macOS and Windows and browse release history.",
			},
			{ property: "og:type", content: "website" },
			{
				property: "og:url",
				content: "https://fumestory.com/download-releases",
			},
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Fumestory Download & Releases | Offline Desktop App",
			},
			{
				name: "twitter:description",
				content:
					"Download Fumestory offline for macOS and Windows and browse release history.",
			},
		],
		links: [
			{
				rel: "canonical",
				href: "https://fumestory.com/download-releases",
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(downloadReleasesJsonLd),
			},
		],
	}),
	component: DownloadReleasesPage,
});

function DownloadButton({
	href,
	label,
}: {
	href: string | null;
	label: string;
}) {
	if (href) {
		return (
			<a
				href={href}
				className={homeStyles.buttonSecondaryHero}
				style={{ display: "inline-block", textDecoration: "none" }}
			>
				{label}
			</a>
		);
	}

	return (
		<span
			className={homeStyles.buttonSecondaryHero}
			style={{
				display: "inline-block",
				opacity: 0.45,
				cursor: "not-allowed",
			}}
			aria-disabled="true"
		>
			{label} — coming soon
		</span>
	);
}

function DownloadReleasesPage() {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;
	const latest = RELEASES[0];

	return (
		<div className={homeStyles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<div className={styles.heroContainer}>
					<h1>Download Fumestory Offline</h1>
					<p>
						Run Fumestory on your desktop without an account. Works fully
						offline — redeem capacity packs when you&apos;re online.
					</p>
				</div>

				{latest ? (
					<section
						style={{
							maxWidth: "48rem",
							margin: "0 auto 4rem",
							padding: "0 1.5rem",
						}}
					>
						<div className={styles.featureImage}>
							<div className={styles.featureContent}>
								<h3>Latest — v{latest.version}</h3>
								<p>macOS is available now. Windows installer coming soon.</p>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "0.75rem",
										marginTop: "1.25rem",
									}}
								>
									<DownloadButton href={latest.downloads.macos} label="macOS" />
									<DownloadButton
										href={latest.downloads.windows}
										label="Windows"
									/>
								</div>
							</div>
						</div>
					</section>
				) : null}

				<section
					style={{
						maxWidth: "48rem",
						margin: "0 auto 6rem",
						padding: "0 1.5rem",
					}}
				>
					<h2
						className={styles.featureSectionTitle}
						style={{ marginBottom: "1.5rem" }}
					>
						Release history
					</h2>
					<div style={{ display: "grid", gap: "1.5rem" }}>
						{RELEASES.map((release) => (
							<article key={release.version} className={styles.featureImage}>
								<div className={styles.featureContent}>
									<h3>v{release.version}</h3>
									{release.date ? (
										<p style={{ opacity: 0.75 }}>{release.date}</p>
									) : null}
									<ul
										style={{
											margin: "0.75rem 0 0",
											paddingLeft: "1.25rem",
										}}
									>
										{release.notes.map((note) => (
											<li key={note}>{note}</li>
										))}
									</ul>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
