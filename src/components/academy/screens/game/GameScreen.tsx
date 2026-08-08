import type { MaterialRecord } from "@/curation/materials/types";
import type {
	MaterialMasteryMap,
	QuizQuestion,
} from "@/components/academy/utils";
import formStyles from "@/components/Form.module.css";
import styles from "../../Academy.module.css";
import type { CompleteSnapshot, LessonPhase } from "../../session/types";
import CardPickPhase from "./game-phases/CardPickPhase";
import GameOverPhase from "./game-phases/GameOverPhase";
import QuizPhase from "./game-phases/QuizPhase";
import ResultPhase from "./game-phases/ResultPhase";

type GameScreenProps = {
	phase: LessonPhase;
	pool: MaterialRecord[];
	pickedKeys: string[];
	expandedKey: string | null;
	lessonSize: number;
	picksReady: boolean;
	question: QuizQuestion | null;
	quizIndex: number;
	selected: string[];
	locked: boolean;
	lives: number;
	maxLives: number;
	isLastQuizQuestion: boolean;
	completeSnapshot: CompleteSnapshot | null;
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	materialMastery: MaterialMasteryMap;
	allReliableMaterialsCount: number;
	gameOverStreak: number;
	onExit: () => void;
	onToggleMaterial: (material: MaterialRecord) => void;
	onStartQuiz: () => void;
	onToggleOption: (option: string) => void;
	onNext: () => void;
	onTryAgain: () => void;
	onNextLesson: () => void;
	onOpenOverview: () => void;
	onStartOver: () => void;
};

export default function GameScreen({
	phase,
	pool,
	pickedKeys,
	expandedKey,
	lessonSize,
	picksReady,
	question,
	quizIndex,
	selected,
	locked,
	lives,
	maxLives,
	isLastQuizQuestion,
	completeSnapshot,
	materials,
	learnedMaterialKeys,
	materialMastery,
	allReliableMaterialsCount,
	gameOverStreak,
	onExit,
	onToggleMaterial,
	onStartQuiz,
	onToggleOption,
	onNext,
	onTryAgain,
	onNextLesson,
	onOpenOverview,
	onStartOver,
}: GameScreenProps) {
	return (
		<section className={styles.quizSection}>
			<div className={`${formStyles.formContainer} ${styles.quizContainer}`}>
				{phase !== "complete" ? (
					<button
						type="button"
						className={styles.exitLesson}
						aria-label="Back to section map"
						onClick={onExit}
					>
						×
					</button>
				) : null}

				{phase === "learn" ? (
					<CardPickPhase
						pool={pool}
						pickedKeys={pickedKeys}
						expandedKey={expandedKey}
						lessonSize={lessonSize}
						picksReady={picksReady}
						onToggle={onToggleMaterial}
						onStartQuiz={onStartQuiz}
					/>
				) : null}

				{phase === "complete" && completeSnapshot ? (
					<ResultPhase
						snapshot={completeSnapshot}
						materials={materials}
						learnedMaterialKeys={learnedMaterialKeys}
						materialMastery={materialMastery}
						allReliableMaterialsCount={allReliableMaterialsCount}
						lives={lives}
						maxLives={maxLives}
						onTryAgain={onTryAgain}
						onNextLesson={onNextLesson}
						onOpenOverview={onOpenOverview}
					/>
				) : null}

				{phase === "gameOver" ? (
					<GameOverPhase
						lessonStreak={gameOverStreak}
						maxLives={maxLives}
						onStartOver={onStartOver}
					/>
				) : null}

				{phase === "quiz" && question ? (
					<QuizPhase
						question={question}
						quizIndex={quizIndex}
						selected={selected}
						locked={locked}
						lives={lives}
						maxLives={maxLives}
						isLastQuizQuestion={isLastQuizQuestion}
						onToggleOption={onToggleOption}
						onNext={onNext}
					/>
				) : null}
			</div>
		</section>
	);
}
