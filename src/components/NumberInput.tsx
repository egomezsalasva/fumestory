import styles from "@/components/Form.module.css";
type NumberInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	labelRight?: React.ReactNode;
} & Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "value" | "onChange"
>;

export function NumberInput({
	label,
	value,
	onChange,
	labelRight,
	...inputProps
}: NumberInputProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Block: e, E, +, - (except at the start for negative numbers if min allows it)
		const invalidChars = ["e", "E", "+", "-"];

		if (invalidChars.includes(e.key)) {
			e.preventDefault();
		}
	};

	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<label className={styles.formLabel}>
					{label} {inputProps.required && "*"}
				</label>
				{labelRight}
			</div>
			<input
				type="number"
				{...inputProps}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				className={styles.formInput}
			/>
		</div>
	);
}
