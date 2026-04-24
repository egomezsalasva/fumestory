import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/project-settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout title="Project Settings">
			<div className="p-6 bg-slate-800 rounded-lg border border-slate-700 mb-6">
				<h2 className="text-lg font-medium text-white mb-4">
					Project Settings
				</h2>
				<ul className="space-y-2">
					<li>
						<label>
							<input type="checkbox" className="mr-2" />
							Automatically remove weight from dilution total on formula
							creation
						</label>
					</li>
				</ul>
			</div>
			<div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
				<h2 className="text-lg font-medium text-white mb-4">Add-on Features</h2>
				<ul className="space-y-2">
					<li>
						<label>
							<input type="checkbox" className="mr-2" />
							Guest Feedback
						</label>
					</li>
					<li>
						<label>
							<input type="checkbox" className="mr-2" />
							Blind Scent Test
						</label>
					</li>
				</ul>
			</div>
		</DashboardLayout>
	);
}
