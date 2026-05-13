import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { authedFetch } from "@/utils/authed-fetch";
import {
	notifyUserSettingsUpdated,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/project-settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const [settings, setSettings] = useState<UserSettingsEffective | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoadError(null);
			try {
				const res = await authedFetch("/api/user-settings");
				const json = (await res.json()) as {
					success?: boolean;
					data?: UserSettingsEffective;
					error?: string;
				};
				if (!res.ok) {
					throw new Error(json.error || "Failed to load settings");
				}
				if (!json.data) {
					throw new Error("Invalid response");
				}
				if (!cancelled) {
					setSettings(json.data);
				}
			} catch (e) {
				if (!cancelled) {
					setLoadError(
						e instanceof Error ? e.message : "Failed to load settings",
					);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const patchUserSettings = useCallback(async (body: object) => {
		setSaveError(null);
		setSaving(true);
		try {
			const res = await authedFetch("/api/user-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const json = (await res.json()) as {
				success?: boolean;
				data?: UserSettingsEffective;
				error?: string;
			};
			if (!res.ok) {
				throw new Error(json.error || "Failed to save settings");
			}
			if (!json.data) {
				throw new Error("Invalid response");
			}
			setSettings(json.data);
			notifyUserSettingsUpdated();
		} catch (e) {
			setSaveError(e instanceof Error ? e.message : "Failed to save settings");
		} finally {
			setSaving(false);
		}
	}, []);

	return (
		<DashboardLayout title="Project Settings">
			<div className="w-full max-w-170 mx-auto">
				<div className="p-6 bg-slate-800 rounded-lg border border-slate-700 mb-6">
					<h2 className="text-lg font-medium text-white mb-4">
						Project Settings
					</h2>
					{/* <ul className="space-y-2">
						<li>
							<label>
								<input type="checkbox" className="mr-2" />
								Automatically remove weight from dilution total on formula
								creation
							</label>
						</li>
					</ul> */}
					{/* <div className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4">
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
					</div> */}
					<div className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4">
						<h3 className="text-sm font-medium text-slate-100">
							Raw Materials Settings
						</h3>
						{/* <div className="h-px w-full bg-slate-600 my-2"></div>
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
						</ul> */}
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Raw Materials Table Settings
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.inventory_columns.label ?? true}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: { label: e.target.checked },
											});
										}}
									/>
									Show Label Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={
											settings?.inventory_columns.material_nature ?? true
										}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: {
													material_nature: e.target.checked,
												},
											});
										}}
									/>
									Show Material Nature Column
								</label>
							</li>
							{/* <li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									Show Name Column
								</label>
							</li> */}
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.inventory_columns.category_name ?? true}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: {
													category_name: e.target.checked,
												},
											});
										}}
									/>
									Show Category Column
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.inventory_columns.note_type ?? true}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: { note_type: e.target.checked },
											});
										}}
									/>
									Show Note Type Column
								</label>
							</li>

							{/* <li>
								<label className="inline-flex items-center text-sm text-slate-200">
									<input type="checkbox" className="mr-2" />
									Show Dilutions Available Column
								</label>
							</li> */}
						</ul>
					</div>
				</div>
				<div
					className="p-6 bg-slate-800 rounded-lg border border-slate-700"
					id="add-on-features"
				>
					<h2 className="text-lg font-medium text-white mb-4">
						Add-on Features
					</h2>
					<ul className="space-y-2">
						<li>
							<label className="inline-flex items-center text-slate-200 cursor-pointer">
								<input
									type="checkbox"
									className="mr-2"
									checked={settings?.guest_feedback_enabled ?? false}
									disabled={settings === null || saving}
									onChange={(e) => {
										void patchUserSettings({
											guest_feedback_enabled: e.target.checked,
										});
									}}
								/>
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
					{loadError && (
						<div className="mb-4 p-3 rounded-md border border-red-500/40 bg-red-500/10 text-sm text-red-200">
							{loadError}
						</div>
					)}
					{saveError && (
						<div className="mb-4 p-3 rounded-md border border-red-500/40 bg-red-500/10 text-sm text-red-200">
							{saveError}
						</div>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}
