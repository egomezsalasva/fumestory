import { useState } from "react";

type TagInputProps = {
	label: string;
	values: string[];
	onChange: (values: string[]) => void;
	placeholder?: string;
};

export function TagInput({
	label,
	values,
	onChange,
	placeholder,
}: TagInputProps) {
	const [input, setInput] = useState("");

	const handleAdd = () => {
		if (input.trim() && !values.includes(input.trim())) {
			onChange([...values, input.trim()]);
			setInput("");
		}
	};

	const handleRemove = (index: number) => {
		onChange(values.filter((_, i) => i !== index));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<div>
			<label className="block text-sm font-medium text-gray-300 mb-2">
				{label}
			</label>
			<div className="space-y-2">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
						placeholder={placeholder}
					/>
					<button
						type="button"
						onClick={handleAdd}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Add
					</button>
				</div>
				{values.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{values.map((value, index) => (
							<span
								key={index}
								className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700 text-white rounded-full"
							>
								{value}
								<button
									type="button"
									onClick={() => handleRemove(index)}
									className="text-red-400 hover:text-red-300"
								>
									×
								</button>
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
