import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { authedFetch } from "@/utils/authed-fetch";
import {
	notifyUserSettingsUpdated,
	type UserSettingsEffective,
} from "@/utils/user-settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/project-settings")({
	head: () => ({
		meta: [
			{ title: "Fumestory | Project Settings" },
			{ name: "robots", content: "noindex" },
		],
	}),
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
				<div
					className="p-6 bg-slate-800 rounded-lg border border-slate-700 mb-6"
					id="project-settings"
				>
					<h2 className="text-lg font-medium text-white mb-4">
						Project Settings
					</h2>
					<div
						className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4"
						id="compositions-settings"
					>
						<h3 className="text-sm font-medium text-slate-100">
							Compositions Settings
						</h3>
						<div className="h-px w-full bg-slate-600 my-2" />
						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={
											settings?.composition_bottle_label_enabled ?? false
										}
										disabled={settings === null || saving}
										onChange={(e) => {
											const enabled = e.target.checked;
											void patchUserSettings(
												enabled
													? {
															composition_bottle_label_enabled: true,
															compositions_columns: { label: true },
														}
													: {
															composition_bottle_label_enabled: false,
															compositions_columns: { label: false },
														},
											);
										}}
									/>
									Enable Bottle Label
								</label>
							</li>
						</ul>

						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Compositions Table Settings
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null &&
										settings.composition_bottle_label_enabled === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={settings?.compositions_columns.label ?? true}
										disabled={
											settings === null ||
											saving ||
											settings?.composition_bottle_label_enabled === false
										}
										onChange={(e) => {
											void patchUserSettings({
												compositions_columns: { label: e.target.checked },
											});
										}}
									/>
									Show Bottle Label Column
								</label>
							</li>
						</ul>
					</div>
					<div
						className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4"
						id="raw-materials-settings"
					>
						<h3 className="text-sm font-medium text-slate-100">
							Raw Materials Settings
						</h3>
						<div className="h-px w-full bg-slate-600 my-2"></div>
						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.cas_number_enabled ?? false}
										disabled={settings === null || saving}
										onChange={(e) => {
											const enabled = e.target.checked;
											void patchUserSettings(
												enabled
													? {
															cas_number_enabled: true,
															inventory_columns: { cas_number: true },
														}
													: {
															cas_number_enabled: false,
															inventory_columns: { cas_number: false },
														},
											);
										}}
									/>
									Enable CAS Number
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.bottle_label_enabled ?? false}
										disabled={settings === null || saving}
										onChange={(e) => {
											const enabled = e.target.checked;
											void patchUserSettings(
												enabled
													? {
															bottle_label_enabled: true,
															inventory_columns: { label: true },
														}
													: {
															bottle_label_enabled: false,
															inventory_columns: { label: false },
														},
											);
										}}
									/>
									Enable Bottle Label
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.material_nature_enabled ?? false}
										disabled={settings === null || saving}
										onChange={(e) => {
											const enabled = e.target.checked;
											void patchUserSettings(
												enabled
													? {
															material_nature_enabled: true,
															inventory_columns: { material_nature: true },
														}
													: {
															material_nature_enabled: false,
															inventory_columns: { material_nature: false },
														},
											);
										}}
									/>
									Enable Material Nature
								</label>
							</li>
						</ul>

						<h4 className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
							Raw Materials Table Settings
						</h4>

						<ul className="mt-3 space-y-2">
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null && settings.bottle_label_enabled === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={settings?.inventory_columns.label ?? true}
										disabled={
											settings === null ||
											saving ||
											settings?.bottle_label_enabled === false
										}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: { label: e.target.checked },
											});
										}}
									/>
									Show Bottle Label Column
								</label>
							</li>
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null && settings.cas_number_enabled === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={settings?.inventory_columns.cas_number ?? true}
										disabled={
											settings === null ||
											saving ||
											settings?.cas_number_enabled === false
										}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: { cas_number: e.target.checked },
											});
										}}
									/>
									Show CAS Number Column
								</label>
							</li>
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null &&
										settings.material_nature_enabled === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={
											settings?.inventory_columns.material_nature ?? true
										}
										disabled={
											settings === null ||
											saving ||
											settings?.material_nature_enabled === false
										}
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
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={settings?.inventory_columns.notes_display ?? true}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: {
													notes_display: e.target.checked,
												},
											});
										}}
									/>
									Show Notes Column
								</label>
							</li>
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null &&
										settings.guest_feedback_enabled === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={settings?.guest_feedback_aggregate_note ?? false}
										disabled={
											settings === null ||
											saving ||
											!settings.guest_feedback_enabled
										}
										onChange={(e) => {
											void patchUserSettings({
												guest_feedback_aggregate_note: e.target.checked,
											});
										}}
									/>
									Show Aggregated Note Counts From Guest Feedback
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={
											settings?.inventory_columns.available_dilutions ?? true
										}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												inventory_columns: {
													available_dilutions: e.target.checked,
												},
											});
										}}
									/>
									Show Dilutions Available Column
								</label>
							</li>
							<li>
								<label
									className={`inline-flex items-center text-sm cursor-pointer ${
										settings !== null &&
										settings.inventory_columns.available_dilutions === false
											? "cursor-not-allowed text-slate-500 opacity-70"
											: "text-slate-200"
									}`}
								>
									<input
										type="checkbox"
										className="mr-2 disabled:cursor-not-allowed disabled:opacity-50"
										checked={
											settings?.hide_raw_materials_without_available_dilutions ??
											false
										}
										disabled={
											settings === null ||
											saving ||
											settings.inventory_columns.available_dilutions === false
										}
										onChange={(e) => {
											void patchUserSettings({
												hide_raw_materials_without_available_dilutions:
													e.target.checked,
											});
										}}
									/>
									Only Show Raw Materials With Available Dilutions
								</label>
							</li>
						</ul>
					</div>
					<div className="mt-5 rounded-md border border-slate-600 bg-slate-900/40 p-4">
						<h3 className="text-sm font-medium text-slate-100">
							Agent Settings
						</h3>
						<div className="h-px w-full bg-slate-600 my-2" />
						<ul className="mt-3 space-y-2">
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={!settings?.raw_material_agent_collapsed}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												raw_material_agent_collapsed: !e.target.checked,
											});
										}}
									/>
									Show Raw Materials Agent
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={!settings?.composition_agent_collapsed}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												composition_agent_collapsed: !e.target.checked,
											});
										}}
									/>
									Show Compositions Agent
								</label>
							</li>
							<li>
								<label className="inline-flex items-center text-sm text-slate-200 cursor-pointer">
									<input
										type="checkbox"
										className="mr-2"
										checked={!settings?.formula_mod_agent_collapsed}
										disabled={settings === null || saving}
										onChange={(e) => {
											void patchUserSettings({
												formula_mod_agent_collapsed: !e.target.checked,
											});
										}}
									/>
									Show Formula Mod Agent
								</label>
							</li>
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
									checked={settings?.materials_quiz_enabled ?? true}
									disabled={settings === null || saving}
									onChange={(e) => {
										void patchUserSettings({
											materials_quiz_enabled: e.target.checked,
										});
									}}
								/>
								Materials Quiz
							</label>
						</li>
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
						<li>
							<label className="inline-flex items-center text-slate-200 cursor-pointer">
								<input
									type="checkbox"
									className="mr-2"
									checked={settings?.scent_blind_test_enabled ?? false}
									disabled={settings === null || saving}
									onChange={(e) => {
										void patchUserSettings({
											scent_blind_test_enabled: e.target.checked,
										});
									}}
								/>
								Scent Blind Test
							</label>
						</li>
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
