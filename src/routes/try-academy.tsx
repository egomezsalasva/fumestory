import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authClient } from "auth";
import MarketingHeaderSection from "@/components/home-page/sections/MarketingHeaderSection";
import homeStyles from "@/components/home-page/MarketingHomePage.module.css";
import Academy from "@/components/academy/Academy";

export const Route = createFileRoute("/try-academy")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Academy" },
			{ name: "robots", content: "index,follow" },
		],
	}),
	component: AcademyRoute,
});

function AcademyRoute() {
	const { data } = authClient.useSession();
	const isLoggedIn = !!data?.session;
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (document.readyState === "complete") {
			setReady(true);
			return;
		}
		const onLoad = () => setReady(true);
		window.addEventListener("load", onLoad);
		return () => window.removeEventListener("load", onLoad);
	}, []);

	if (!ready) {
		return (
			<div className={homeStyles.container}>
				<div
					style={{
						minHeight: "100vh",
						display: "grid",
						placeItems: "center",
						color: "rgba(245,247,250,0.85)",
					}}
				>
					Loading...
				</div>
			</div>
		);
	}

	return (
		<div className={homeStyles.container}>
			<MarketingHeaderSection isLoggedIn={isLoggedIn} styles={homeStyles} />
			<div className={homeStyles.content}>
				<Academy />
			</div>
		</div>
	);
}
