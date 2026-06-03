import { useEffect, useState } from "react";
import { authedFetch } from "@/utils/authed-fetch";
import { BOTTLE_LABEL_PARSE } from "@/utils/bottle-labels";
import styles from "./Form.module.css";

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

type LabelItem = { label: string | null };

function parseStoredLabel(item: LabelItem): ParsedLabel | null {
	if (!item.label) return null;
	const match = item.label.match(BOTTLE_LABEL_PARSE);
	if (!match) return null;
	return {
		prefix: match[1],
		number: parseInt(match[2], 10),
		full: item.label,
	};
}

export function LabelInput({
	label,
	value,
	onChange,
	placeholder,
	required = false,
}: LabelInputProps) {
	const [existingLabels, setExistingLabels] = useState<ParsedLabel[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;

		const loadLabels = async () => {
			try {
				const [materialsRes, compositionsRes] = await Promise.all([
					authedFetch("/api/raw-materials"),
					authedFetch("/api/compositions"),
				]);

				const [materialsJson, compositionsJson] = await Promise.all([
					materialsRes.json(),
					compositionsRes.json(),
				]);

				if (cancelled) return;

				const items: LabelItem[] = [
					...(materialsJson.success ? materialsJson.data : []),
					...(compositionsJson.success ? compositionsJson.data : []),
				];

				const parsed = items
					.map(parseStoredLabel)
					.filter((entry): entry is ParsedLabel => entry !== null);

				setExistingLabels(parsed);
			} catch (err) {
				console.error("Failed to fetch labels:", err);
			}
		};

		void loadLabels();

		return () => {
			cancelled = true;
		};
	}, []);

	const currentMatch = value.match(/^([A-Z]*)(\d*)$/);
	const currentPrefix = currentMatch ? currentMatch[1] : "";

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

	const handleChange = (newValue: string) => {
		const upperValue = newValue.toUpperCase();

		if (upperValue && !/^[A-Z]*\d*$/.test(upperValue)) {
			setError("Label must be letters followed by numbers (e.g., LB1)");
		} else if (
			upperValue.trim() !== "" &&
			existingLabels.some(
				(l) => l.full.toUpperCase() === upperValue.toUpperCase(),
			)
		) {
			setError("Label already exists");
		} else {
			setError("");
		}

		onChange(upperValue);
	};

	return (
		<div className="relative">
			<label className={styles.formLabel}>{label}</label>
			<input
				type="text"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				onFocus={() => setShowDropdown(true)}
				onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
				placeholder={placeholder}
				required={required}
				className={`${styles.formInput} ${error ? styles.formInputError : ""}`}
			/>

			{error && <p className="mt-1 text-sm text-red-400">{error}</p>}

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
