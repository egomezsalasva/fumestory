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
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { location } = useRouterState();
	const path = location.pathname;

	// Public pages: login/index and all /auth/* routes
	const isPublic = path === "/" || path.startsWith("/auth/");

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<NeonAuthUIProvider authClient={authClient}>
					{isPublic ? (
						children
					) : (
						<div
							style={{
								position: "fixed",
								inset: 0,
								overflow: "hidden",
							}}
						>
							<SignedIn>{children}</SignedIn>
							<RedirectToSignIn />
						</div>
					)}
				</NeonAuthUIProvider>
				<Scripts />
			</body>
		</html>
	);
}
