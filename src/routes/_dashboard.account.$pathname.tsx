import { createFileRoute } from "@tanstack/react-router";
import {
	ChangeEmailCard,
	ChangePasswordCard,
	SessionsCard,
} from "@neondatabase/neon-js/auth/react/ui";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
export const Route = createFileRoute("/_dashboard/account/$pathname")({
	component: Account,
});
function Account() {
	const { pathname } = Route.useParams();
	const title =
		pathname === "security" ? "Account Security" : "Account Settings";
	return (
		<DashboardLayout title={title}>
			<div className="w-full max-w-170 mx-auto">
				<ChangeEmailCard className="mb-6	" />
				<ChangePasswordCard className="mb-6" />
				<SessionsCard className="mb-6" />
			</div>
		</DashboardLayout>
	);
}
