import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import {
	SignedIn,
	RedirectToSignIn,
} from "@neondatabase/neon-js/auth/react/ui";
import { authClient } from "../../auth";
import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

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

	// Public pages: login/index and all /auth/* routes
	const isPublic =
		path === "/" || path.startsWith("/auth/") || path.startsWith("/features");

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
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
				<Scripts />
			</body>
		</html>
	);
}
