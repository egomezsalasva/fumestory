import { useState, useEffect, useRef } from "react";
import styles from "./Form.module.css";
import { Select } from "@/components/Select";
import { toTitleCaseWords } from "@/utils/display-names";
import { authedFetch } from "@/utils/authed-fetch";
import { NEUTRAL_CATEGORY_COLOR } from "@/utils/curated-category-colors";

const OTHER_VALUE = "__other__";

type Category = {
	id: number;
	name: string;
};

type CategoryAutocompleteProps = {
	label: string;
	/** Curated category id, or null when Other / empty */
	categoryId: number | null;
	isOther: boolean;
	otherName: string;
	otherColor?: string;
	onCuratedChange: (categoryId: number, categoryName: string) => void;
	onOtherSelected: () => void;
	onOtherNameChange: (name: string) => void;
	onOtherColorChange?: (color: string) => void;
	onClear?: () => void;
	required?: boolean;
};

export function CategoryAutocomplete({
	label,
	categoryId,
	isOther,
	otherName,
	otherColor = NEUTRAL_CATEGORY_COLOR,
	onCuratedChange,
	onOtherSelected,
	onOtherNameChange,
	onOtherColorChange,
	onClear,
	required,
}: CategoryAutocompleteProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const colorInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		authedFetch("/api/categories")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setCategories(data.data);
				}
			})
			.catch((err) => console.error("Error fetching categories:", err));
	}, []);

	const selectValue = isOther
		? OTHER_VALUE
		: categoryId != null
			? String(categoryId)
			: "";

	const options = [
		...categories.map((cat) => ({
			value: String(cat.id),
			label: toTitleCaseWords(cat.name),
		})),
		{ value: OTHER_VALUE, label: "Other" },
	];

	return (
		<div className="space-y-2">
			<Select
				label={label}
				value={selectValue}
				onChange={(value) => {
					if (!value) {
						onClear?.();
						return;
					}
					if (value === OTHER_VALUE) {
						onOtherSelected();
						return;
					}
					const id = Number(value);
					const cat = categories.find((c) => c.id === id);
					if (cat) onCuratedChange(cat.id, cat.name);
				}}
				options={options}
				placeholder="Select category..."
				required={required}
			/>

			{isOther ? (
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={otherName}
						onChange={(e) => onOtherNameChange(e.target.value)}
						className={`${styles.formInput} flex-1`}
						placeholder="Type other primary category e.g. Conifer"
						required
					/>
					<button
						type="button"
						title="Pick category color"
						aria-label="Pick category color"
						onClick={() => colorInputRef.current?.click()}
						className="shrink-0 w-10 h-10 rounded-[0.25rem] cursor-pointer"
						style={{
							backgroundColor: otherColor,
							border: "1px solid #464859",
						}}
					/>
					<input
						ref={colorInputRef}
						type="color"
						value={otherColor}
						onChange={(e) => onOtherColorChange?.(e.target.value)}
						className="sr-only"
						tabIndex={-1}
					/>
				</div>
			) : null}
		</div>
	);
}
