import { createFileRoute } from "@tanstack/react-router";
import { requireNavRoute } from "@/utils/nav-eligibility";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import Academy from "@/components/academy/Academy";

export const Route = createFileRoute("/_dashboard/academy")({
	...requireNavRoute("/academy"),
	head: () => ({
		meta: [
			{ title: "Fumestory | Academy" },
			{ name: "robots", content: "noindex" },
		],
	}),
	component: AcademyPage,
});

function AcademyPage() {
	return (
		<DashboardLayout title="Academy">
			<Academy />
		</DashboardLayout>
	);
}
