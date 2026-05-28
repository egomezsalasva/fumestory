import styles from "@/components/Form.module.css";
type DateTimeInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
};

export function DateTimeInput({
	label,
	value,
	onChange,
	required,
}: DateTimeInputProps) {
	return (
		<div>
			<label className={styles.formLabel}>
				{label} {required && "*"}
			</label>
			<input
				type="datetime-local"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={`${styles.formInput} ${!value ? styles.formDateTimeEmpty : ""}`}
				required={required}
			/>
		</div>
	);
}
