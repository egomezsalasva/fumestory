import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthView } from "@neondatabase/neon-js/auth/react/ui";
import { authClient } from "../../auth";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/$pathname")({
	component: Auth,
});

function Auth() {
	const { pathname } = Route.useParams();
	const { data } = authClient.useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (data?.session) {
			navigate({ to: "/inventory", replace: true });
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
			<AuthView pathname={pathname} />
		</div>
	);
}
