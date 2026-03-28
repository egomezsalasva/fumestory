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
import Header from "@/components/Header";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Perfumery Organizer" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
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
					{/* Hide header when signed out */}
					<SignedIn>
						<Header />
					</SignedIn>

					{isPublic ? (
						children
					) : (
						<>
							<SignedIn>{children}</SignedIn>
							<RedirectToSignIn />
						</>
					)}
				</NeonAuthUIProvider>
				<Scripts />
			</body>
		</html>
	);
}
