import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import styles from "@/components/download-releases/download-releases.module.css";

type Release = {
	version: string;
	date: string | null;
	notes: string[];
	url: string;
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
		url: "https://github.com/egomezsalasva/fumestory/releases/tag/v0.1.0",
		downloads: {
			macos:
				"https://github.com/egomezsalasva/fumestory/releases/download/v0.1.0/fumestory-mac-v0.1.0.dmg",
			windows:
				"https://github.com/egomezsalasva/fumestory/releases/download/v0.1.0/fumestory-windows-v0.1.0.exe",
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

function AppleIcon() {
	return (
		<svg
			width="18"
			height="22"
			viewBox="0 0 650 803"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M218.1 802.5C153.1 802.5 108.1 745 75.6 695C-6.9 567.5 -24.4 407.5 35.6 315C75.6 252.5 140.6 215 203.1 215C235.6 215 263.1 225 285.6 232.5C303.1 240 320.6 245 338.1 245C353.1 245 365.6 240 383.1 232.5C405.6 225 433.1 215 470.6 215C525.6 215 583.1 245 623.1 295C628.1 300 630.6 307.5 628.1 315C625.6 322.5 623.1 327.5 615.6 332.5C570.6 357.5 545.6 402.5 550.6 452.5C553.1 505 585.6 547.5 633.1 565C640.6 567.5 645.6 572.5 648.1 580C650.6 587.5 650.6 592.5 648.1 600C630.6 637.5 623.1 655 600.6 687.5C563.1 742.5 518.1 800 458.1 800C430.6 800 413.1 792.5 398.1 785C383.1 777.5 368.1 770 338.1 770C310.6 770 295.6 777.5 278.1 785C263.1 795 245.6 802.5 218.1 802.5Z"
				fill="currentColor"
			/>
			<path
				d="M318.1 220C315.6 220 315.6 220 313.1 220C300.6 220 290.6 210 288.1 200C280.6 157.5 295.6 107.5 328.1 67.5C358.1 30 408.1 5 453.1 0C465.6 0 478.1 7.5 480.6 22.5C488.1 67.5 473.1 115 440.6 155C413.1 195 363.1 220 318.1 220Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function WindowsIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 800 800"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M365.835 417.363C366.035 497.319 366.276 633.168 366.476 738.75C511.038 758.299 655.599 778.452 799.92 800C799.92 673.949 800.08 548.45 799.92 428.516C655.238 428.516 510.596 417.363 365.835 417.363ZM0 417.402V688.867C109.033 703.579 218.065 717.64 326.897 733.711C327.098 628.689 326.817 523.636 326.817 418.613C217.865 418.813 108.952 417.043 0 417.402ZM0 113.73V384.434C109.033 384.714 218.065 383.064 327.098 383.184C327.018 278.401 327.018 173.747 326.897 68.9648C217.784 82.5972 108.672 97.0197 0 113.73ZM800 378.867C655.519 379.427 511.038 381.63 366.476 382.07C366.396 275.569 366.396 169.195 366.476 62.7734C510.757 40.7454 655.358 20.0288 799.92 0C800 126.33 799.92 252.537 800 378.867Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ExternalLinkIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 567 567"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M200.007 66.6654H140.007C102.67 66.6654 83.988 66.6654 69.7273 73.9317C57.183 80.323 46.9916 90.5144 40.6003 103.059C33.334 117.319 33.334 136.002 33.334 173.339V426.672C33.334 464.009 33.334 482.669 40.6003 496.929C46.9916 509.472 57.183 519.682 69.7273 526.072C83.974 533.332 102.634 533.332 139.898 533.332H393.437C430.701 533.332 449.334 533.332 463.581 526.072C476.124 519.682 486.351 509.462 492.741 496.919C500.001 482.672 500.001 464.032 500.001 426.769V366.665M366.667 33.332H533.334V199.999M533.334 33.332L300.001 266.665"
				stroke="currentColor"
				strokeWidth="66.6667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function DownloadButton({
	href,
	label,
	icon,
}: {
	href: string | null;
	label: string;
	icon?: ReactNode;
}) {
	const content = (
		<>
			{icon}
			{label}
		</>
	);

	if (href) {
		return (
			<a href={href} className={styles.downloadButton}>
				{content}
			</a>
		);
	}

	return (
		<span className={styles.downloadButtonDisabled} aria-disabled="true">
			{content}
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
				<div className={styles.hero}>
					<h1>Download Fumestory</h1>
					<p>
						Download Fumestory desktop app for full privacy and to work offline.
						<br />
						Data will be stored locally on your machine.
					</p>
				</div>

				{latest ? (
					<section className={styles.latest}>
						<div className={styles.card}>
							<div className={styles.cardBody}>
								<h3>Latest - v{latest.version}</h3>
								{latest.notes.map((note) => (
									<p key={note}>{note}</p>
								))}
								<div className={styles.platforms}>
									<DownloadButton
										href={latest.downloads.macos}
										label="macOS"
										icon={<AppleIcon />}
									/>
									<DownloadButton
										href={latest.downloads.windows}
										label="Windows"
										icon={<WindowsIcon />}
									/>
								</div>
							</div>
						</div>
					</section>
				) : null}

				<section className={styles.history}>
					<h2 className={styles.historyTitle}>Release History</h2>
					<div className={styles.releases}>
						{RELEASES.map((release) => (
							<article key={release.version} className={styles.releaseItem}>
								<div className={styles.releaseContent}>
									<h3>v{release.version}</h3>
									{release.date ? (
										<p className={styles.releaseMeta}>{release.date}</p>
									) : null}
									<ul className={styles.notes}>
										{release.notes.map((note) => (
											<li key={note}>{note}</li>
										))}
									</ul>
								</div>
								<a
									href={release.url}
									className={styles.releaseLink}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Open release v${release.version}`}
								>
									<ExternalLinkIcon />
								</a>
							</article>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
