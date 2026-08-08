import type { MaterialRecord } from "@/curation/materials/types";
import type { MaterialMasteryMap } from "@/components/academy/utils";
import LessonCompleteCard from "../LessonCompleteCard";
import type { CompleteSnapshot } from "../../../session/types";

type ResultPhaseProps = {
	snapshot: CompleteSnapshot;
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	materialMastery: MaterialMasteryMap;
	allReliableMaterialsCount: number;
	lives: number;
	maxLives: number;
	onTryAgain: () => void;
	onNextLesson: () => void;
	onOpenOverview: () => void;
};

export default function ResultPhase({
	snapshot,
	materials,
	learnedMaterialKeys,
	materialMastery,
	allReliableMaterialsCount,
	lives,
	maxLives,
	onTryAgain,
	onNextLesson,
	onOpenOverview,
}: ResultPhaseProps) {
	return (
		<LessonCompleteCard
			outcome={snapshot.outcome}
			previousKnownCount={snapshot.previousKnownCount}
			knownMaterialsCount={snapshot.newKnownCount}
			allReliableMaterialsCount={allReliableMaterialsCount}
			materials={materials}
			learnedMaterialKeys={learnedMaterialKeys}
			previousLearnedKeys={new Set(snapshot.previousLearnedKeys)}
			lessonMaterials={snapshot.lessonMaterials}
			materialMastery={materialMastery}
			lives={lives}
			maxLives={maxLives}
			onTryAgain={onTryAgain}
			onNextLesson={onNextLesson}
			onOpenOverview={onOpenOverview}
		/>
	);
}
