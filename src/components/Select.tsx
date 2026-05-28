import styles from "./Form.module.css";
import SelectArrow from "./svgs/SelectArrow";

type SelectOption = {
	value: string;
	label: string;
};

type SelectProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	required?: boolean;
};

export function Select({
	label,
	value,
	onChange,
	options,
	placeholder,
	required,
}: SelectProps) {
	return (
		<div>
			<label className={styles.formLabel}>
				{label} {required && "*"}
			</label>
			<div className={styles.selectWrapper}>
				<select
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={`${styles.formInput} ${styles.formSelect} ${!value ? styles.formInputPlaceholder : ""}`}
					required={required}
				>
					{placeholder && <option value="">{placeholder}</option>}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<span className={styles.selectChevron} aria-hidden>
					<SelectArrow />
				</span>
			</div>
		</div>
	);
}
