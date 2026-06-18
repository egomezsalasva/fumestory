import { createFileRoute } from "@tanstack/react-router";
import MarketingHomePage from "@/components/home-page/MarketingHomePage";

const homeJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "Fumestory",
	url: "https://fumestory.com/",
	applicationCategory: "BusinessApplication",
	operatingSystem: "Web",
	description:
		"Perfumery software for managing raw materials, dilutions, formulas, and compositions.",
};

export const Route = createFileRoute("/")({
	head: () => ({
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify(homeJsonLd),
			},
		],
	}),
	component: Index,
});

function Index() {
	return <MarketingHomePage />;
}
