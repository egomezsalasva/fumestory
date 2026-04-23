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
				<label className="block text-sm font-medium text-gray-300">
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
				className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
			/>
		</div>
	);
}
