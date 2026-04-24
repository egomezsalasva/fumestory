import { createFileRoute } from "@tanstack/react-router";
import MarketingHomePage from "@/components/home-page/MarketingHomePage";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return <MarketingHomePage />;
}
