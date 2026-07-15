import { createFileRoute } from "@tanstack/react-router";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import MaterialsQuiz from "@/components/materials-quiz/MaterialsQuiz";

export const Route = createFileRoute("/_dashboard/academy")({
	...requireNavRoute("/academy"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Academy" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: MaterialsQuizPage,
});

function MaterialsQuizPage() {
	return (
		<DashboardLayout title="Academy">
			<MaterialsQuiz />
		</DashboardLayout>
	);
}
