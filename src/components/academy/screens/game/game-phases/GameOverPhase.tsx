import LessonStartOverCard from "../LessonStartOverCard";

type GameOverPhaseProps = {
	maxLives: number;
	onStartOver: () => void;
};

export default function GameOverPhase({
	maxLives,
	onStartOver,
}: GameOverPhaseProps) {
	return <LessonStartOverCard maxLives={maxLives} onStartOver={onStartOver} />;
}
