import { useEffect, useState } from "react";
import { authedFetch } from "@/utils/authed-fetch";

type LabelInputProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
};

type ParsedLabel = {
	prefix: string;
	number: number;
	full: string;
};

export function LabelInput({
	label,
	value,
	onChange,
	placeholder,
	required,
}: LabelInputProps) {
	const [existingLabels, setExistingLabels] = useState<ParsedLabel[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [error, setError] = useState("");

	// Fetch existing labels
	useEffect(() => {
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					const parsed = data.data
						.map((rm: any) => {
							const match = rm.label.match(/^([A-Z]+)(\d+)$/);
							if (match) {
								return {
									prefix: match[1],
									number: parseInt(match[2], 10),
									full: rm.label,
								};
							}
							return null;
						})
						.filter(Boolean);
					setExistingLabels(parsed);
				}
			})
			.catch((err) => console.error("Failed to fetch labels:", err));
	}, []);

	// Parse current input
	const currentMatch = value.match(/^([A-Z]*)(\d*)$/);
	const currentPrefix = currentMatch ? currentMatch[1] : "";

	// Find labels with matching prefix
	const matchingLabels = existingLabels.filter(
		(l) => l.prefix === currentPrefix && currentPrefix !== "",
	);
	const maxNumber =
		matchingLabels.length > 0
			? Math.max(...matchingLabels.map((l) => l.number))
			: 0;
	const suggestedLabel = currentPrefix
		? `${currentPrefix}${maxNumber + 1}`
		: "";

	// Check if current value is duplicate
	const isDuplicate = existingLabels.some(
		(l) => l.full.toUpperCase() === value.toUpperCase(),
	);

	const handleChange = (newValue: string) => {
		const upperValue = newValue.toUpperCase();

		// Validate format: letters then numbers
		if (upperValue && !/^[A-Z]*\d*$/.test(upperValue)) {
			setError("Label must be letters followed by numbers (e.g., LB1)");
		} else if (isDuplicate) {
			setError("Label already exists");
		} else {
			setError("");
		}

		onChange(upperValue);
	};

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-slate-200 mb-2">
				{label}
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				onFocus={() => setShowDropdown(true)}
				onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
				placeholder={placeholder}
				required={required}
				className={`w-full px-4 py-2 bg-slate-700 text-white rounded-lg border ${
					error ? "border-red-500" : "border-slate-600"
				} focus:outline-none focus:border-blue-500`}
			/>

			{/* Error message */}
			{error && <p className="mt-1 text-sm text-red-400">{error}</p>}

			{/* Dropdown with suggestions */}
			{showDropdown && currentPrefix && (
				<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg">
					{maxNumber > 0 && (
						<div className="px-4 py-2 border-b border-slate-600">
							<span className="text-red-400">
								❌ Last: {currentPrefix}
								{maxNumber}
							</span>
						</div>
					)}
					{suggestedLabel && (
						<button
							type="button"
							onClick={() => {
								handleChange(suggestedLabel);
								setShowDropdown(false);
							}}
							className="w-full text-left px-4 py-2 text-green-400 hover:bg-slate-600"
						>
							✅ Suggested: {suggestedLabel}
						</button>
					)}
					{maxNumber === 0 && currentPrefix && (
						<div className="px-4 py-2 text-blue-400">
							💡 New prefix: {currentPrefix}1
						</div>
					)}
				</div>
			)}
		</div>
	);
}
