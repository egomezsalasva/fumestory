import {
	checkForAppUpdate,
	dismissAppUpdate,
	type AppUpdateInfo,
} from "@/offline/checkForAppUpdate";
import { isOffline } from "@/runtime";
import { useEffect, useState } from "react";
import styles from "./OfflineUpdateBanner.module.css";

export function OfflineUpdateBanner() {
	const offline = isOffline();
	const [update, setUpdate] = useState<AppUpdateInfo | null>(null);

	useEffect(() => {
		if (!offline) return;
		let cancelled = false;

		void checkForAppUpdate()
			.then((info) => {
				if (!cancelled) setUpdate(info);
			})
			.catch(() => {
				// silent — offline or network unavailable
			});

		return () => {
			cancelled = true;
		};
	}, [offline]);

	if (!offline || !update) return null;

	return (
		<div role="status" className={styles.notice}>
			<span className={styles.label}>Update {update.version}</span>
			<a
				href={update.downloadUrl}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.link}
			>
				Download
			</a>
			<button
				type="button"
				onClick={() => {
					dismissAppUpdate(update.version);
					setUpdate(null);
				}}
				className={styles.dismiss}
				aria-label="Dismiss update notice"
			>
				X
			</button>
		</div>
	);
}
