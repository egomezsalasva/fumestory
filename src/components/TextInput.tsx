import styles from "./Form.module.css";
type TextInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
};

export function TextInput({
	label,
	value,
	onChange,
	placeholder,
	required,
}: TextInputProps) {
	return (
		<div>
			<label className={styles.formLabel}>
				{label} {required && "*"}
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={styles.formInput}
				placeholder={placeholder}
				required={required}
			/>
		</div>
	);
}
