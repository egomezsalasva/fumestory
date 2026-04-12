import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "../../auth";
import { useEffect } from "react";
import MarketingHomePage from "@/components/home-page/MarketingHomePage";

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
		}
	}, [data, navigate]);

	return <MarketingHomePage />;
}
