import { useState, useEffect } from "react";
import { authedFetch } from "@/utils/authed-fetch";

type RawMaterial = {
	id: number;
	name: string;
};

type Dilution = {
	id: number;
	raw_material_id: number;
	percentage: number;
	dilution_date: string | null;
	available: boolean;
};

type CombinedItem = {
	dilutionId: number;
	materialId: number;
	materialName: string;
	percentage: number;
	date: string | null;
	displayText: string;
};

type DilutionAutocompleteProps = {
	label: string;
	value: string;
	onSelect: (
		dilutionId: number,
		materialId: number,
		materialName: string,
		percentage: number,
	) => void;
	excludeDilutionIds?: number[];
};

export function DilutionAutocomplete({
	label,
	value,
	onSelect,
	excludeDilutionIds = [],
}: DilutionAutocompleteProps) {
	const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([]);
	const [search, setSearch] = useState(value);
	const [showDropdown, setShowDropdown] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			authedFetch("/api/raw-materials").then((res) => res.json()),
			authedFetch("/api/dilutions").then((res) => res.json()),
		])
			.then(([materialsData, dilutionsData]) => {
				if (materialsData.success && dilutionsData.success) {
					const materials: RawMaterial[] = materialsData.data;
					const dilutions: Dilution[] = dilutionsData.data;

					// Create combined items for each dilution
					const items: CombinedItem[] = dilutions
						.filter((d) => d.available)
						.map((d) => {
							const material = materials.find(
								(m) => m.id === d.raw_material_id,
							);
							const dateStr = d.dilution_date
								? new Date(d.dilution_date).toLocaleDateString()
								: "";
							return {
								dilutionId: d.id,
								materialId: d.raw_material_id,
								materialName: material?.name || "Unknown",
								percentage: d.percentage,
								date: d.dilution_date,
								displayText: `${material?.name || "Unknown"} - ${d.percentage}%${dateStr ? ` (${dateStr})` : ""}`,
							};
						});

					setCombinedItems(items);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching data:", err);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const filteredItems = combinedItems
		.filter((item) => !excludeDilutionIds.includes(item.dilutionId))
		.filter((item) =>
			item.displayText.toLowerCase().includes(search.toLowerCase()),
		);

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-gray-300 mb-2">
				{label}
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
				className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
				placeholder="Search material and dilution..."
				disabled={loading}
			/>

			{showDropdown && (
				<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
					{loading ? (
						<div className="px-4 py-2 text-gray-400">Loading...</div>
					) : filteredItems.length > 0 ? (
						filteredItems.map((item) => (
							<button
								key={item.dilutionId}
								type="button"
								onClick={() => {
									onSelect(
										item.dilutionId,
										item.materialId,
										item.materialName,
										item.percentage,
									);
									setShowDropdown(false);
								}}
								className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors"
							>
								{item.displayText}
							</button>
						))
					) : (
						<div className="px-4 py-2 text-gray-400">No dilutions found</div>
					)}
				</div>
			)}
		</div>
	);
}
