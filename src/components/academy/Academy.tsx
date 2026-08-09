import { useEffect, useRef, useState } from "react";
import { applyLessonPass, buildCurriculum } from "./curriculum";
import {
	loadAcademyProgressLocal,
	saveAcademyProgressLocal,
} from "./progress/academyProgressLocal";
import { hydrateAcademyFromProgress } from "./progress/hydrateAcademyProgress";
import { snapshotAcademyProgress } from "./progress/snapshotAcademyProgress";
import GameScreen from "./screens/game/GameScreen";
import LandingScreen from "./screens/map/LandingScreen";
import MapScreen from "./screens/map/MapScreen";
import { useAcademyMap } from "./screens/map/helpers/useAcademyMap";
import OverviewScreen from "./screens/overview/OverviewScreen";
import { useGameSession } from "./session/game/useGameSession";
import type { AcademyScreen } from "./session/types";

export default function Academy() {
	const [screen, setScreen] = useState<AcademyScreen>("home");

	const hydratedRef = useRef(
		hydrateAcademyFromProgress(loadAcademyProgressLocal()),
	);
	const [curriculum, setCurriculum] = useState(
		() => hydratedRef.current.curriculum,
	);

	const game = useGameSession({
		screen,
		initialState: hydratedRef.current.game,
		onLessonPassed: (lessonId) => {
			setCurriculum((current) => applyLessonPass(current, lessonId));
		},
	});

	useEffect(() => {
		saveAcademyProgressLocal(snapshotAcademyProgress(curriculum, game.durable));
	}, [
		curriculum,
		game.durable.lives,
		game.durable.lessonStreak,
		game.durable.materialMastery,
		game.durable.learnedMaterialKeys,
		game.durable.seenMaterialKeys,
	]);

	const map = useAcademyMap({
		screen,
		setScreen,
		curriculum,
		game,
	});

	if (screen === "home") {
		return (
			<LandingScreen
				sections={curriculum}
				onOpenSection={map.handleOpenSection}
			/>
		);
	}

	if (screen === "overview") {
		return (
			<OverviewScreen
				materials={game.materials}
				learnedMaterialKeys={game.learnedMaterialKeys}
				seenMaterialKeys={game.seenMaterialKeys}
				materialMastery={game.materialMastery}
				onBack={() => setScreen("section")}
			/>
		);
	}

	if (screen === "section" && map.activeSection) {
		return (
			<MapScreen
				section={map.activeSection}
				sections={curriculum}
				onBack={map.handleBackToHome}
				onOpenOverview={map.handleOpenOverview}
				onOpenLesson={map.handleOpenLesson}
			/>
		);
	}

	return (
		<GameScreen
			phase={game.phase}
			pool={game.lesson.pool}
			pickedKeys={game.lesson.pickedKeys}
			expandedKey={game.expandedKey}
			lessonSize={game.lessonSize}
			picksReady={game.picksReady}
			question={game.question}
			quizIndex={game.quizIndex}
			selected={game.selected}
			locked={game.locked}
			lives={game.lives}
			maxLives={game.maxLives}
			isLastQuizQuestion={game.isLastQuizQuestion}
			completeSnapshot={game.completeSnapshot}
			materials={game.materials}
			learnedMaterialKeys={game.learnedMaterialKeys}
			materialMastery={game.materialMastery}
			allReliableMaterialsCount={game.allReliableMaterialsCount}
			unitName={game.unitName}
			onExit={() => map.handleReturnToSection()}
			onToggleMaterial={game.handleToggleMaterial}
			onStartQuiz={game.handleStartQuiz}
			onToggleOption={game.handleToggleOption}
			onNext={game.handleNext}
			onTryAgain={() => map.handleReturnToSection()}
			onNextLesson={() => {
				if (game.isUnitFinishingLesson) {
					game.showUnitComplete();
					return;
				}
				map.handleReturnToSection({ toLatestUnlocked: true });
			}}
			onOpenOverview={map.handleOpenOverviewFromComplete}
			onStartOver={() => {
				game.handleStartOver();
				setCurriculum(buildCurriculum());
				map.handleBackToHome();
			}}
			onContinueFromUnitComplete={() =>
				map.handleReturnToSection({ toLatestUnlocked: true })
			}
		/>
	);
}
