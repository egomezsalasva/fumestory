import { useCallback, useEffect, useState } from "react";
import { authedFetch } from "@/utils/authed-fetch";
import type { UserSettingsEffective } from "@/utils/user-settings";
import {
	notifyUserSettingsUpdated,
	USER_SETTINGS_UPDATED_EVENT,
} from "@/utils/user-settings";
import type {
	DismissedUiEffective,
	HeaderHintId,
} from "@/utils/toast-settings";
import { dismissHeaderHintPatch } from "@/utils/toast-settings";
import {
	getVisibleHeaderHints,
	type HeaderHintDefinition,
} from "./header-hints";
import styles from "./DashboardLayout.module.css";

type UserSettingsApiData = UserSettingsEffective & {
	dismissed_ui: DismissedUiEffective;
};

type HeaderHintsProps = {
	hintIds: HeaderHintId[];
};

export function HeaderHints({ hintIds }: HeaderHintsProps) {
	const [hints, setHints] = useState<HeaderHintDefinition[]>([]);

	const loadHints = useCallback(() => {
		authedFetch("/api/user-settings")
			.then((res) => res.json())
			.then((json: { data?: UserSettingsApiData }) => {
				if (!json.data) {
					setHints([]);
					return;
				}
				const { dismissed_ui, ...settings } = json.data;
				setHints(
					getVisibleHeaderHints(settings, dismissed_ui, {
						hintIds,
						limit: 1,
					}),
				);
			})
			.catch(() => setHints([]));
	}, [hintIds]);

	useEffect(() => {
		loadHints();
		window.addEventListener(USER_SETTINGS_UPDATED_EVENT, loadHints);
		return () => {
			window.removeEventListener(USER_SETTINGS_UPDATED_EVENT, loadHints);
		};
	}, [loadHints]);

	const dismissHint = async (id: HeaderHintDefinition["id"]) => {
		setHints([]);
		try {
			await authedFetch("/api/user-settings", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ dismissed_ui: dismissHeaderHintPatch(id) }),
			});
			notifyUserSettingsUpdated();
		} catch {
			loadHints();
		}
	};

	const hint = hints[0];
	if (!hint) return null;

	return (
		<div className={styles.headerHints}>
			<div className={styles.headerHint}>
				<p className={styles.headerHintMessage}>
					<span className={styles.headerHintMessageBold}>Hint:</span>{" "}
					{hint.message}
				</p>
				<button
					type="button"
					className={styles.headerHintDismiss}
					aria-label="Dismiss hint"
					onClick={() => void dismissHint(hint.id)}
				>
					×
				</button>
			</div>
		</div>
	);
}
