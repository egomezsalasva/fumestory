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
			<label className="block text-sm font-medium text-gray-300 mb-2">
				{label} {required && "*"}
			</label>
			<input
				type="datetime-local"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
				required={required}
			/>
		</div>
	);
}
