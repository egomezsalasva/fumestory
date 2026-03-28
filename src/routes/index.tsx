import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "../../auth";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { data } = authClient.useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (data === undefined) return;

		if (data?.session) {
			navigate({ to: "/inventory", replace: true });
		} else {
			navigate({
				to: "/auth/$pathname",
				params: { pathname: "sign-in" },
				replace: true,
			});
		}
	}, [data, navigate]);

	return null;
}
