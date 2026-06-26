import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import MaterialsQuiz from "@/components/materials-quiz/MaterialsQuiz";

export const Route = createFileRoute("/try-materials-quiz")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Materials Quiz" },
			{ name: "robots", content: "index,follow" },
		],
	}),
	component: MaterialsQuizRoute,
});

function MaterialsQuizRoute() {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;

	return (
		<div className={homeStyles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<MaterialsQuiz />
			</div>
		</div>
	);
}
