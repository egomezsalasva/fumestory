import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SignedIn } from "@neondatabase/neon-js/auth/react/ui";
import SideNav from "@/components/sidenav/SideNav";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SignedIn>
			<div style={{ display: "flex" }}>
				<SideNav />
				<div
					style={{
						width: "100%",
						maxHeight: "100vh",
						paddingTop: "1rem",
						paddingRight: "1rem",
					}}
				>
					<Outlet />
				</div>
			</div>
		</SignedIn>
	);
}
