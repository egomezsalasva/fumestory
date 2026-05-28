import { useState, useEffect } from "react";
import { authedFetch } from "@/utils/authed-fetch";
import styles from "@/components/Form.module.css";

type RawMaterial = {
	id: number;
	name: string;
};

type RawMaterialAutocompleteProps = {
	label: string;
	value: string;
	onSelect: (materialId: number, materialName: string) => void;
	required?: boolean;
};

export function RawMaterialAutocomplete({
	label,
	value,
	onSelect,
	required,
}: RawMaterialAutocompleteProps) {
	const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
	const [search, setSearch] = useState(value);
	const [showDropdown, setShowDropdown] = useState(false);

	useEffect(() => {
		authedFetch("/api/raw-materials")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setRawMaterials(data.data);
				}
			})
			.catch((err) => console.error("Error fetching raw materials:", err));
	}, []);

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const filteredMaterials = rawMaterials.filter((rm) =>
		rm.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="relative">
			<label className={styles.formLabel}>
				{label} {required && "*"}
			</label>
			<input
				type="text"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setShowDropdown(true);
				}}
				onFocus={() => setShowDropdown(true)}
				onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
				className={styles.formInput}
				placeholder="Search raw material..."
			/>

			{showDropdown && (
				<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
					{filteredMaterials.length > 0 ? (
						filteredMaterials.map((rm) => (
							<button
								key={rm.id}
								type="button"
								onClick={() => {
									onSelect(rm.id, rm.name);
									setShowDropdown(false);
								}}
								className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors"
							>
								{rm.name}
							</button>
						))
					) : (
						<div className="px-4 py-2 text-gray-400">
							No raw materials found
						</div>
					)}
				</div>
			)}
		</div>
	);
}
