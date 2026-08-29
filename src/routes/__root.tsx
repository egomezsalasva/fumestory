import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import {
	RedirectToSignIn,
	SignedIn,
} from "@neondatabase/neon-js/auth/react/ui";
import { PostHogProvider } from "posthog-js/react";
import type { QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { authClient } from "../../auth";
import { getOfflineInstallId } from "@/offline/db";
import { isOffline } from "@/runtime";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const posthogOptions = {
	api_host: import.meta.env.VITE_POSTHOG_HOST,
	defaults: "2026-01-30",
	capture_pageview: "history_change",
	autocapture: true,
} as const;

const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Fumestory",
	url: "https://fumestory.com",
	logo: "https://fumestory.com/favicon.svg",
	description:
		"Perfumery software for organizing raw materials, dilutions, formulas, and compositions.",
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Fumestory | Perfumery software for formulas & raw materials" },
			{
				name: "description",
				content:
					"Fumestory helps niche perfumers and anyone serious about scent organize raw materials, dilutions, and formulas — clear workflows for newcomers and experienced blenders alike.",
			},
			{ name: "robots", content: "index,follow" },
			{
				property: "og:title",
				content: "Fumestory | Perfumery software for formulas & raw materials",
			},
			{
				property: "og:description",
				content:
					"Organize raw materials, dilutions, and formulas in one perfumery software workflow.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://fumestory.com/" },
			{ property: "og:site_name", content: "Fumestory" },
			{ property: "og:locale", content: "en_US" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Fumestory | Perfumery software for formulas & raw materials",
			},
			{
				name: "twitter:description",
				content:
					"Organize raw materials, dilutions, and formulas in one perfumery software workflow.",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(organizationJsonLd),
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { location } = useRouterState();
	const path = location.pathname;
	const offline = isOffline();
	const [offlineDbError, setOfflineDbError] = useState<string | null>(null);

	useEffect(() => {
		if (!offline) return;
		void getOfflineInstallId()
			.then(() => {
				setOfflineDbError(null);
			})
			.catch((err: unknown) => {
				const message =
					err instanceof Error
						? err.message
						: typeof err === "string"
							? err
							: "Failed to open the local database.";
				setOfflineDbError(message);
			});
	}, [offline]);

	// Public pages: login/index and all /auth/* routes
	const isPublic =
		path === "/" ||
		path.startsWith("/auth/") ||
		path.startsWith("/features") ||
		path.startsWith("/download-releases") ||
		path.startsWith("/pricing") ||
		path.startsWith("/try-academy");

	const offlineDbBanner =
		offline && offlineDbError ? (
			<div
				role="alert"
				className="fixed inset-x-0 top-0 z-100 border-b border-red-500/50 bg-red-950 px-4 py-3 text-sm text-red-100"
			>
				<div className="mx-auto flex max-w-3xl items-start justify-between gap-3">
					<p>
						<span className="font-medium">Database update problem. </span>
						{offlineDbError}
					</p>
					<button
						type="button"
						onClick={() => setOfflineDbError(null)}
						className="shrink-0 rounded border border-red-400/40 px-2 py-0.5 text-xs text-red-100 hover:bg-red-900/60"
					>
						Dismiss
					</button>
				</div>
			</div>
		) : null;

	const appShell = (
		<div
			style={{
				position: "fixed",
				inset: 0,
				overflow: "hidden",
			}}
		>
			{offlineDbBanner}
			<main id="main-content">{children}</main>
		</div>
	);

	return (
		<html lang="en" className={offline ? "dark" : undefined}>
			<head>
				<HeadContent />
			</head>
			<body>
				<PostHogProvider
					apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
					options={posthogOptions}
				>
					{offline ? (
						isPublic ? (
							<>
								{offlineDbBanner}
								<main id="main-content">{children}</main>
							</>
						) : (
							appShell
						)
					) : (
						<NeonAuthUIProvider authClient={authClient}>
							{isPublic ? (
								<main id="main-content">{children}</main>
							) : (
								<div
									style={{
										position: "fixed",
										inset: 0,
										overflow: "hidden",
									}}
								>
									<SignedIn>
										<main id="main-content">{children}</main>
									</SignedIn>
									<RedirectToSignIn />
								</div>
							)}
						</NeonAuthUIProvider>
					)}
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}
