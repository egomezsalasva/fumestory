import { FC } from "react";
import styles from "./DashboardLayout.module.css";
import { Link } from "@tanstack/react-router";
import BackArrowIcon from "./svgs/BackArrowIcon";
import PlusIcon from "./svgs/PlusIcon";
import CogIcon from "../svgs/CogIcon";
import AgentIcon from "./svgs/AgentIcon";

type BackButtonConfig = {
	to: string;
	params?: Record<string, string>;
};

type DashboardLayoutProps = {
	title: string;
	children: React.ReactNode;
	showTourButton?: boolean;
	plusButton?: BackButtonConfig;
	showCogButton?: boolean;
	backButton?: BackButtonConfig;
	agentToggle?: boolean;
	onAgentToggleClick?: () => void;
};

const BackButton = ({ backButton }: { backButton: BackButtonConfig }) => {
	return (
		<Link
			to={backButton?.to}
			params={backButton?.params ?? {}}
			className={styles.backButton}
		>
			<BackArrowIcon />
		</Link>
	);
};

const DashboardLayout: FC<DashboardLayoutProps> = ({
	children,
	title,
	showTourButton = false,
	plusButton,
	showCogButton = false,
	backButton,
	agentToggle = false,
	onAgentToggleClick,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.innerContainer}>
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						{backButton && <BackButton backButton={backButton} />}
						<h1>{title}</h1>
					</div>
					<div className={styles.headerRight}>
						{showCogButton && (
							<Link to="/project-settings">
								<CogIcon />
							</Link>
						)}
						{plusButton && (
							<Link to={plusButton.to} params={plusButton.params ?? {}}>
								<PlusIcon />
							</Link>
						)}
						{agentToggle && (
							<button
								type="button"
								className="cursor-pointer"
								onClick={onAgentToggleClick}
							>
								<AgentIcon />
							</button>
						)}
					</div>
				</div>
				<div className={styles.body}>{children}</div>
			</div>
			<div className={styles.footer}>
				{showTourButton && <button className={styles.tourButton}>Tour</button>}
			</div>
		</div>
	);
};

export default DashboardLayout;
