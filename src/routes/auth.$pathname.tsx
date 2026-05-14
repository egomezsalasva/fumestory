import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthView } from "@neondatabase/neon-js/auth/react/ui";
import { authClient } from "../../auth";
import { useEffect } from "react";

function authHeadMeta(pathname: string) {
	switch (pathname) {
		case "sign-in":
			return {
				title: "Fumestory | Sign In",
				description:
					"Sign in to Fumestory to manage raw materials, dilutions, and perfume formulas in one workspace.",
			};
		case "sign-up":
			return {
				title: "Fumestory | Create Your Account",
				description:
					"Create a Fumestory account to organize materials, track dilutions, and document formulas as your perfumery work grows.",
			};
		default: {
			const label = pathname
				.split("-")
				.filter(Boolean)
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
			return {
				title: label ? `Fumestory | ${label}` : "Fumestory | Account ",
				description:
					"Access your Fumestory account to continue organizing raw materials, dilutions, and formulas.",
			};
		}
	}
}

export const Route = createFileRoute("/auth/$pathname")({
	head: ({ params }) => {
		const { title, description } = authHeadMeta(params.pathname);
		return {
			meta: [{ title }, { name: "description", content: description }],
		};
	},
	component: Auth,
});

function Auth() {
	const { pathname } = Route.useParams();
	const { data } = authClient.useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (data?.session) {
			navigate({ to: "/compositions", replace: true });
		}
	}, [data?.session, navigate]);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				padding: "2rem",
			}}
		>
			<AuthView pathname={pathname} redirectTo="/compositions" />
		</div>
	);
}
