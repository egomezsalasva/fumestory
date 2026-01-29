import { useState, useEffect } from "react";

type Category = {
	id: number;
	name: string;
};

type CategoryAutocompleteProps = {
	label: string;
	value: string;
	onSelect: (categoryId: number, categoryName: string) => void;
};

export function CategoryAutocomplete({
	label,
	value,
	onSelect,
}: CategoryAutocompleteProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState(value);
	const [showDropdown, setShowDropdown] = useState(false);

	useEffect(() => {
		fetch("/api/categories")
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setCategories(data.data);
				}
			})
			.catch((err) => console.error("Error fetching categories:", err));
	}, []);

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(search.toLowerCase()),
	);

	const handleCreateCategory = async () => {
		console.log("Would create category:", search.trim());
		// TODO: Uncomment when ready to save to database
		/*
        try {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: search.trim() }),
            });
            const data = await response.json();
            if (data.success) {
                setCategories([...categories, data.data]);
                onSelect(data.data.id, data.data.name);
                setShowDropdown(false);
            }
        } catch (err) {
            console.error("Error creating category:", err);
        }
        */

		// For now, just close dropdown
		setShowDropdown(false);
	};

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
				placeholder="Search or add category..."
			/>

			{showDropdown && (
				<div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg max-h-48 overflow-y-auto">
					{filteredCategories.length > 0 ? (
						filteredCategories.map((cat) => (
							<button
								key={cat.id}
								type="button"
								onClick={() => {
									onSelect(cat.id, cat.name);
									setShowDropdown(false);
								}}
								className="w-full text-left px-4 py-2 text-white hover:bg-slate-600 transition-colors"
							>
								{cat.name}
							</button>
						))
					) : search.trim() ? (
						<button
							type="button"
							onClick={handleCreateCategory}
							className="w-full text-left px-4 py-2 text-green-400 hover:bg-slate-600 transition-colors font-medium"
						>
							+ Create "{search}"
						</button>
					) : (
						<div className="px-4 py-2 text-gray-400">
							Start typing to search...
						</div>
					)}
				</div>
			)}
		</div>
	);
}
