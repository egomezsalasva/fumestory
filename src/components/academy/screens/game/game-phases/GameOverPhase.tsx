import LessonStartOverCard from "../LessonStartOverCard";

type GameOverPhaseProps = {
	lessonStreak: number;
	maxLives: number;
	onStartOver: () => void;
};

export default function GameOverPhase({
	lessonStreak,
	maxLives,
	onStartOver,
}: GameOverPhaseProps) {
	return (
		<LessonStartOverCard
			lessonStreak={lessonStreak}
			maxLives={maxLives}
			onStartOver={onStartOver}
		/>
	);
}
