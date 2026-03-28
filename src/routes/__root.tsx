import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
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
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Perfumery Organizer",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<NeonAuthUIProvider authClient={authClient}>
					<Header />
					{children}
				</NeonAuthUIProvider>
				<Scripts />
			</body>
		</html>
	);
}
