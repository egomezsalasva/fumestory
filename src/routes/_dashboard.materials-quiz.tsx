import { createFileRoute } from "@tanstack/react-router";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import MaterialsQuiz from "@/components/materials-quiz/MaterialsQuiz";

export const Route = createFileRoute("/_dashboard/materials-quiz")({
	...requireNavRoute("/materials-quiz"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Materials Quiz" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: MaterialsQuizPage,
});

function MaterialsQuizPage() {
	return (
		<DashboardLayout title="Materials Quiz">
			<MaterialsQuiz />
		</DashboardLayout>
	);
}
