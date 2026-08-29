import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import styles from "./MarketingJourneySection.module.css";

const JourneyItem = ({
	title,
	className,
	children,
}: {
	title: string;
	className?: string;
	children: ReactNode;
}) => (
	<div className={`${styles.item} ${className ?? ""}`}>
		<div className={styles.itemContent}>
			<h3>{title}</h3>
			{children}
		</div>
	</div>
);

const MarketingJourneySection = () => {
	return (
		<div className={styles.container} id="journey">
			<h2>Journey Through Fumestory</h2>
			<div className={styles.grid}>
				<JourneyItem title="Learn" className={styles.item1}>
					<p>
						Use the academy to learn and memorize raw materials and their
						properties. Use the encyclopedia to search and find specific raw
						materials.
					</p>
					<Link to="/try-academy" className={styles.academyButton}>
						Try Academy<span>(No Signup)</span>
					</Link>
				</JourneyItem>

				<JourneyItem title="Order Materials" className={styles.item2}>
					<p>
						Find distributors and suppliers of raw materials and keep a wishlist
						of the materials you want to purchase.
					</p>
				</JourneyItem>

				<JourneyItem title="Organize Your Inventory" className={styles.item3}>
					<p>
						Keep track of your raw materials and their dilutions. Get warning
						when you are running low on stock.
					</p>
				</JourneyItem>

				<JourneyItem title="Train" className={styles.item4}>
					<p>
						Train by doing blind scent tests to test your knowledge of raw
						materials you own. Build formula studies to practice building
						perfumes and accords.
					</p>
				</JourneyItem>

				<JourneyItem title="Create" className={styles.item5}>
					<p>
						Build accords and perfumes and keep them organized. Keep formula
						iterations organized. Enterprise-encrypted or privately stored on
						your device with the desktop app so you can keep your formulas safe
						and private.
					</p>
				</JourneyItem>

				<JourneyItem title="Evaluate" className={styles.item6}>
					<p>
						Connect with evaluators from reputable fragrance houses for external
						professional structured feedback on your compositions.
					</p>
				</JourneyItem>

				<JourneyItem title="Market Ready" className={styles.item7}>
					<p>
						Get IFRA standard warnings to comply with regulations and guidelines
						for market launch. Patent your formulas to keep them protected.
					</p>
				</JourneyItem>
			</div>
		</div>
	);
};

export default MarketingJourneySection;
