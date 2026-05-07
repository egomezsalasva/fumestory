import { useEffect, useRef, useState } from "react";

type InterfaceTab = {
	title: string;
	image: string;
};

type MarketingInterfaceSectionProps = {
	styles: Record<string, string>;
};

const INTERFACE_TABS: InterfaceTab[] = [
	{ title: "Inventory", image: "/inventory.png" },
	{ title: "Add Raw Material", image: "/add-raw-material.png" },
	{ title: "Add Dilution", image: "/add-dilution.png" },
	{ title: "Compositions", image: "/formulas.png" },
	{ title: "Formulas", image: "/formulas.png" },
];

const InterfaceItem = ({
	title,
	isActive,
	progressPercent = 0,
	onClick,
	styles,
}: {
	title: string;
	isActive: boolean;
	progressPercent: number;
	onClick: () => void;
	styles: Record<string, string>;
}) => {
	return (
		<div
			onClick={onClick}
			className={`${styles.interfaceItem} ${isActive ? styles.interfaceItem_active : ""}`}
		>
			{isActive && (
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					xmlns="http://www.w3.org/2000/svg"
					className={styles.interfaceItemIcon_left}
				>
					<path d="M8 8H0C4.41828 8 8 4.41828 8 0V8Z" />
				</svg>
			)}
			{title}
			{isActive && (
				<svg
					width="8"
					height="8"
					viewBox="0 0 8 8"
					xmlns="http://www.w3.org/2000/svg"
					className={styles.interfaceItemIcon_right}
				>
					<path d="M8 8H0C4.41828 8 8 4.41828 8 0V8Z" />
				</svg>
			)}
			<div className={styles.progressBar}>
				<div
					className={styles.progressBarFill}
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
};

const MarketingInterfaceSection = ({
	styles,
}: MarketingInterfaceSectionProps) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [slideProgress, setSlideProgress] = useState(0);
	const slideStartRef = useRef<number>(performance.now());

	const activeTab = INTERFACE_TABS[activeIndex];

	useEffect(() => {
		let raf = 0;
		const ms = 10_000;

		const tick = (now: number) => {
			const elapsed = now - slideStartRef.current;
			if (elapsed >= ms) {
				setActiveIndex((i) => (i + 1) % INTERFACE_TABS.length);
				slideStartRef.current = now;
				setSlideProgress(0);
			} else {
				setSlideProgress((elapsed / ms) * 100);
			}
			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);

	const handleTabClick = (index: number) => {
		setActiveIndex(index);
		slideStartRef.current = performance.now();
		setSlideProgress(0);
	};

	return (
		<div className={styles.interfaceContainer}>
			<div className={styles.interfaceList}>
				{INTERFACE_TABS.map((tab, index) => (
					<InterfaceItem
						key={tab.title}
						title={tab.title}
						isActive={index === activeIndex}
						progressPercent={index === activeIndex ? slideProgress : 0}
						onClick={() => handleTabClick(index)}
						styles={styles}
					/>
				))}
			</div>
			<div className={styles.interfaceImage}>
				<div className={styles.interfaceImageContent}>
					<img src={activeTab.image} alt={activeTab.title} />
				</div>
			</div>
		</div>
	);
};

export default MarketingInterfaceSection;
