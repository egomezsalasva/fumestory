import { Link } from "@tanstack/react-router";
import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";
import shared from "../../shared.module.css";

type LessonStartOverCardProps = {
	maxLives: number;
	onStartOver?: () => void;
};

export default function LessonStartOverCard({
	maxLives,
	onStartOver,
}: LessonStartOverCardProps) {
	return (
		<div className={styles.lessonCompleteCard}>
			<h2 className={styles.lessonStartOverTitle}>Out of lives</h2>
			<p className={styles.lessonStartOverMessage}>
				You&apos;ve run out of lives. Sign up to get fresh lives and keep your
				Academy progress.
			</p>
			<div
				className={shared.lives}
				aria-label={`0 of ${maxLives} lives remaining`}
			>
				{Array.from({ length: maxLives }, (_, index) => (
					<span
						key={index}
						className={`${shared.life} ${shared.lifeLost}`}
						aria-hidden="true"
					/>
				))}
			</div>
			<div className={styles.gateActions}>
				<div className={styles.gatePrimaryRow}>
					<Link
						to="/auth/$pathname"
						params={{ pathname: "sign-up" }}
						className={formStyles.formSubmitButton}
					>
						Sign up
					</Link>
					{onStartOver ? (
						<button
							type="button"
							className={formStyles.formSubmitButton}
							onClick={onStartOver}
						>
							Start over
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}
