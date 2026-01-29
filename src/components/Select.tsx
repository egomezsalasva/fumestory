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
			<label className="block text-sm font-medium text-gray-300 mb-2">
				{label} {required && "*"}
			</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
				required={required}
			>
				{placeholder && <option value="">{placeholder}</option>}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
