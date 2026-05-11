import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/project-settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout title="Project Settings">
			<div className="w-full max-w-170 mx-auto">
				{/* <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 mb-6">
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
					<div className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4">
						<h3 className="text-sm font-medium text-slate-100">
							Compositions Settings
						</h3>
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Additional Properties
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									Label
								</label>
							</li>
						</ul>
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Compositions Table Settings
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Name Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Type Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									Show Status Column
								</label>
							</li>
						</ul>
					</div>
					<div className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4">
						<h3 className="text-sm font-medium text-slate-100">
							Raw Materials Settings
						</h3>
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Additional Properties
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									CAS Number
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									Dilution Total Weight
								</label>
							</li>
						</ul>
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Raw Materials Table Settings
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Label Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Name Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Category Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Note Type Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Material Nature Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" checked />
									Show Created At Column
								</label>
							</li>
						</ul>
					</div>
				</div> */}
				<div
					className="p-6 bg-slate-800 rounded-lg border border-slate-700"
					id="add-on-features"
				>
					<h2 className="text-lg font-medium text-white mb-4">
						Add-on Features
					</h2>
					<ul className="space-y-2">
						<li>
							<label>
								<input type="checkbox" className="mr-2" />
								Guest Feedback
							</label>
						</li>
						{/* <li>
							<label>
								<input type="checkbox" className="mr-2" />
								Blind Scent Test
							</label>
						</li> */}
					</ul>
				</div>
			</div>
		</DashboardLayout>
	);
}
