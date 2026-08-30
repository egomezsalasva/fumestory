import { useEffect, useMemo, useRef, useState } from "react";
import { curatedMaterialsData } from "@/curation/materials/data/data";
import type { MaterialRecord } from "@/curation/materials/types";
import { normalizeCasNumber } from "@/utils/cas-numbers";

export type CuratedMaterialSearchMode = "name" | "cas";

type Step = "search" | "names" | "cas";

type CuratedMaterialSearchModalProps = {
	mode: CuratedMaterialSearchMode;
	onClose: () => void;
	onSelect: (
		material: MaterialRecord,
		pickedName: string,
		pickedCas: string,
	) => void;
};

type SearchHit = {
	key: string;
	material: MaterialRecord;
	title: string;
	subtitle: string;
};

function sourceNameUsed(material: MaterialRecord): string[] {
	const names: string[] = [];
	for (const source of material.sources ?? []) {
		const data = source.data as { nameUsed?: string };
		if (typeof data.nameUsed === "string" && data.nameUsed.trim()) {
			names.push(data.nameUsed.trim());
		}
	}
	return names;
}

function uniqueNames(material: MaterialRecord): string[] {
	const seen = new Set<string>();
	const names: string[] = [];
	for (const name of [
		material.canonicalName,
		...(material.otherNames ?? []),
		...sourceNameUsed(material),
	]) {
		const trimmed = name.trim();
		const key = trimmed.toLowerCase();
		if (!trimmed || seen.has(key)) continue;
		seen.add(key);
		names.push(trimmed);
	}
	return names;
}

function casOptions(material: MaterialRecord): string[] {
	const list = material.cas ?? [];
	return list.length > 0 ? list : ["No CAS"];
}

function nameHits(query: string): SearchHit[] {
	const q = query.trim().toLowerCase();
	const hits: SearchHit[] = [];
	for (const material of curatedMaterialsData.materials) {
		for (const name of uniqueNames(material)) {
			if (q && !name.toLowerCase().includes(q)) continue;
			hits.push({
				key: `${material.canonicalName}::${name}`,
				material,
				title: name,
				subtitle: [
					name.toLowerCase() === material.canonicalName.toLowerCase()
						? null
						: material.canonicalName,
					material.cas?.length ? material.cas.join(", ") : "No CAS",
				]
					.filter(Boolean)
					.join(" · "),
			});
		}
	}
	return hits.sort((a, b) => a.title.localeCompare(b.title));
}

function casHits(query: string): SearchHit[] {
	const raw = query.trim().toLowerCase();
	const normalized = (normalizeCasNumber(query) ?? raw).toLowerCase();
	const hits: SearchHit[] = [];
	for (const material of curatedMaterialsData.materials) {
		const casList = material.cas ?? [];
		if (casList.length === 0) {
			if (!raw) {
				hits.push({
					key: `${material.canonicalName}::nocas`,
					material,
					title: "No CAS",
					subtitle: material.canonicalName,
				});
			}
			continue;
		}
		for (const cas of casList) {
			const c = cas.toLowerCase();
			if (raw && !c.includes(raw) && !c.includes(normalized)) continue;
			hits.push({
				key: `${material.canonicalName}::${cas}`,
				material,
				title: cas,
				subtitle: material.canonicalName,
			});
		}
	}
	return hits.sort((a, b) => a.title.localeCompare(b.title));
}

function optionClass(selected: boolean): string {
	return [
		"flex w-full flex-col items-start gap-0.5 px-5 py-3 text-left",
		selected ? "bg-slate-700/80" : "hover:bg-slate-700/50",
	].join(" ");
}

export function CuratedMaterialSearchModal({
	mode,
	onClose,
	onSelect,
}: CuratedMaterialSearchModalProps) {
	const [query, setQuery] = useState("");
	const [step, setStep] = useState<Step>("search");
	const [picked, setPicked] = useState<MaterialRecord | null>(null);
	const [selectedName, setSelectedName] = useState("");
	const [selectedCas, setSelectedCas] = useState("");
	const [searchPickedName, setSearchPickedName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (step === "search") inputRef.current?.focus();
	}, [step]);

	const results = useMemo(
		() => (mode === "cas" ? casHits(query) : nameHits(query)),
		[mode, query],
	);

	const names = picked ? uniqueNames(picked) : [];
	const casList = picked ? casOptions(picked) : [];
	const needsNameStep = names.length > 1;
	const needsCasStep = casList.length > 1;

	const title =
		step === "search"
			? mode === "cas"
				? "Search by CAS"
				: "Search by name"
			: step === "names"
				? "Choose name"
				: "Choose CAS";

	const startFromHit = (hit: SearchHit) => {
		const nameChoices = uniqueNames(hit.material);
		const casChoices = casOptions(hit.material);
		const nameFromHit =
			mode === "name" && nameChoices.includes(hit.title)
				? hit.title
				: (nameChoices[0] ?? hit.material.canonicalName);
		const casFromHit = casChoices[0] ?? "No CAS";

		setPicked(hit.material);
		setSelectedName(nameFromHit);
		setSearchPickedName(nameFromHit);
		setSelectedCas(casFromHit);

		if (nameChoices.length > 1) {
			setStep("names");
			return;
		}
		if (casChoices.length > 1) {
			setStep("cas");
			return;
		}
		onSelect(hit.material, nameFromHit, casFromHit);
	};

	const confirm = () => {
		if (!picked) return;
		onSelect(picked, selectedName, selectedCas);
	};

	const goNext = () => {
		if (step === "names") {
			if (needsCasStep) setStep("cas");
			else confirm();
			return;
		}
		confirm();
	};

	const goBack = () => {
		if (step === "cas" && needsNameStep) {
			setStep("names");
			return;
		}
		setStep("search");
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onClose}
		>
			<div
				className="relative flex h-[60vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="curated-material-search-title"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-700 px-5 py-4">
					<div>
						<h2
							id="curated-material-search-title"
							className="pr-2 text-lg font-medium text-slate-100"
						>
							{title}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xl leading-none text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100"
					>
						×
					</button>
				</div>

				{step === "search" ? (
					<div className="shrink-0 border-b border-slate-700 px-5 py-3">
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={mode === "cas" ? "e.g. 6790-58-5" : "e.g. Ambroxan"}
							className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
						/>
					</div>
				) : null}

				<div className="min-h-0 flex-1 overflow-y-auto">
					{step === "search" ? (
						results.length === 0 ? (
							<p className="px-5 py-8 text-sm text-slate-400">No matches.</p>
						) : (
							<ul>
								{results.map((hit) => (
									<li
										key={hit.key}
										className="m-4 overflow-hidden rounded-lg border border-slate-600"
									>
										<button
											type="button"
											className={optionClass(false)}
											onClick={() => startFromHit(hit)}
										>
											<span className="text-sm font-medium text-slate-100">
												{hit.title}
											</span>
											<span className="text-xs text-slate-400">
												{hit.subtitle}
											</span>
										</button>
									</li>
								))}
							</ul>
						)
					) : null}

					{step === "names" ? (
						<ul>
							{names.map((name) => (
								<li
									key={name}
									className="m-4 overflow-hidden rounded-lg border border-slate-600"
								>
									<button
										type="button"
										className={optionClass(selectedName === name)}
										onClick={() => setSelectedName(name)}
									>
										<span className="flex w-full items-center justify-between gap-2">
											<span className="text-sm font-medium text-slate-100">
												{name}
											</span>
											{name === searchPickedName ? (
												<span className="rounded border border-slate-500 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
													Your pick
												</span>
											) : null}
										</span>
									</button>
								</li>
							))}
						</ul>
					) : null}

					{step === "cas" ? (
						<ul>
							{casList.map((cas, index) => (
								<li
									key={cas}
									className="m-4 overflow-hidden rounded-lg border border-slate-600"
								>
									<button
										type="button"
										className={optionClass(selectedCas === cas)}
										onClick={() => setSelectedCas(cas)}
									>
										<span className="flex w-full items-center justify-between gap-2">
											<span className="text-sm font-medium text-slate-100">
												{cas}
											</span>
											{index === 0 ? (
												<span className="rounded border border-slate-500 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
													Default
												</span>
											) : null}
										</span>
									</button>
								</li>
							))}
						</ul>
					) : null}
				</div>

				{step !== "search" ? (
					<div className="flex shrink-0 justify-between gap-2 border-t border-slate-700 px-5 py-3">
						<button
							type="button"
							className="rounded-md border border-slate-500 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700/50"
							onClick={goBack}
						>
							Back
						</button>
						<button
							type="button"
							className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900"
							onClick={goNext}
						>
							{step === "names" && needsCasStep ? "Next" : "Done"}
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}

function SearchFieldButton({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			title={label}
			className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#464859] bg-[#101c26] text-slate-300 hover:bg-slate-800 hover:text-slate-100"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="M20 20L17 17" />
			</svg>
		</button>
	);
}

export { SearchFieldButton };
