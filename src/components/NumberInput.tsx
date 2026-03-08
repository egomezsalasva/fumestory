type NumberInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	min?: number;
	max?: number;
	step?: number;
};

export function NumberInput({
	label,
	value,
	onChange,
	placeholder,
	required,
	min = 0,
	max,
	step = 1,
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
			<label className="block text-sm font-medium text-gray-300 mb-2">
				{label} {required && "*"}
			</label>
			<input
				type="number"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
				placeholder={placeholder}
				required={required}
				min={min}
				max={max}
				step={step}
			/>
		</div>
	);
}
