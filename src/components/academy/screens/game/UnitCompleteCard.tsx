import { Link } from "@tanstack/react-router";
import formStyles from "@/components/Form.module.css";
import styles from "./LessonComplete.module.css";

type UnitCompleteCardProps = {
	unitName: string;
	onContinue: () => void;
};

export default function UnitCompleteCard({
	unitName,
	onContinue,
}: UnitCompleteCardProps) {
	return (
		<div className={styles.lessonCompleteCard}>
			<h2 className={styles.lessonStartOverTitle}>Great job</h2>
			<p className={styles.lessonStartOverMessage}>
				You finished the {unitName} unit. Sign up to keep your progress and get
				access to Fumestory.
			</p>
			<div className={styles.gateActions}>
				<Link
					to="/auth/$pathname"
					params={{ pathname: "sign-up" }}
					className={`${formStyles.formSubmitButton} ${styles.gatePrimaryButton}`}
				>
					Sign up
				</Link>
				<Link to="/features" className={styles.secondaryButton}>
					View Features
				</Link>
				<button
					type="button"
					className={`${formStyles.formSubmitButton} ${styles.gatePrimaryButton}`}
					onClick={onContinue}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
