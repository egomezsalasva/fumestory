const MarketingMissionSection = ({
	styles,
}: {
	styles: Record<string, string>;
}) => {
	return (
		<div className={styles.missionContainer}>
			<div className={styles.missionContent}>
				{/* <h2>A Workspace Designed For Modern Perfumery</h2> */}
				<h2>A Flexible Workspace For Perfumers</h2>
				{/* <h2>Minimal By Default.<br />Expandable When You Need More.</h2> */}
				<p className={styles.missionDescription}>
					Start with a clean, minimal workspace and expand it with the features
					you need. Manage materials, build accords, track formula evolution,
					and develop perfumes with tools designed to adapt to different
					perfumery workflows.
				</p>
			</div>
		</div>
	);
};

export default MarketingMissionSection;
