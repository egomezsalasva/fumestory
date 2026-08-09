import { FC, useEffect, useState } from "react";
import styles from "./DashboardLayout.module.css";
import { Link, useRouterState } from "@tanstack/react-router";
import BackArrowIcon from "./svgs/BackArrowIcon";
import PlusIcon from "./svgs/PlusIcon";
import CogIcon from "../svgs/CogIcon";
import AgentIcon from "./svgs/AgentIcon";
import WhiteSpinner from "@/components/WhiteSpinner";
import { HeaderHints } from "./HeaderHints";
import type { HeaderHintId } from "@/utils/toast-settings";

type BackButtonConfig = {
	to: string;
	params?: Record<string, string>;
};

type DashboardLayoutProps = {
	title: React.ReactNode;
	children: React.ReactNode;
	showTourButton?: boolean;
	plusButton?: BackButtonConfig;
	showCogButton?: boolean;
	cogButtonHash?: string;
	headerActions?: React.ReactNode;
	headerHints?: HeaderHintId[];
	backButton?: BackButtonConfig;
	agentToggle?: boolean;
	onAgentToggleClick?: () => void;
};

const BackButton = ({ backButton }: { backButton: BackButtonConfig }) => {
	const [pending, setPending] = useState(false);
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	useEffect(() => {
		if (!isLoading) setPending(false);
	}, [isLoading]);

	return (
		<Link
			to={backButton?.to}
			params={backButton?.params ?? {}}
			className={styles.backButton}
			aria-busy={pending}
			aria-label={pending ? "Loading" : "Back"}
			onClick={() => setPending(true)}
		>
			{pending ? <WhiteSpinner size={12} /> : <BackArrowIcon />}
		</Link>
	);
};

const DashboardLayout: FC<DashboardLayoutProps> = ({
	children,
	title,
	showTourButton = false,
	plusButton,
	showCogButton = false,
	cogButtonHash,
	headerActions,
	headerHints,
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
						{headerHints && headerHints.length > 0 && (
							<HeaderHints hintIds={headerHints} />
						)}
						{headerActions}
						{showCogButton && (
							<Link
								to="/project-settings"
								hash={cogButtonHash?.replace(/^#/, "") || undefined}
							>
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
