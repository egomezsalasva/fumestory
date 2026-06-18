import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SignedIn } from "@neondatabase/neon-js/auth/react/ui";
import SideNav from "@/components/sidenav/SideNav";
import styles from "@/components/dashboard-layout/DashboardLayout.module.css";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SignedIn>
			<div className={styles.mobileBlocked}>
				<div>
					<div className={styles.mobileBlockedTitle}>Desktop Required</div>
					<p className={styles.mobileBlockedText}>
						Please use a desktop screen to access the dashboard.
					</p>
				</div>
			</div>
			<div className={styles.desktopShell}>
				<SideNav />
				<div className={styles.outletWrap}>
					<Outlet />
				</div>
			</div>
		</SignedIn>
	);
}
