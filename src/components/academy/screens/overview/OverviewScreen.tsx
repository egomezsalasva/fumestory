import type { MaterialRecord } from "@/curation/materials/types";
import type { MaterialMasteryMap } from "@/components/academy/utils";
import formStyles from "@/components/Form.module.css";
import MaterialsOverview from "./MaterialsOverview";
import styles from "../../Academy.module.css";

type OverviewScreenProps = {
	materials: MaterialRecord[];
	learnedMaterialKeys: ReadonlySet<string>;
	seenMaterialKeys: ReadonlySet<string>;
	materialMastery: MaterialMasteryMap;
	onBack: () => void;
};

export default function OverviewScreen({
	materials,
	learnedMaterialKeys,
	seenMaterialKeys,
	materialMastery,
	onBack,
}: OverviewScreenProps) {
	return (
		<section className={styles.quizSection}>
			<div className={`${formStyles.formContainer} ${styles.quizContainer}`}>
				<MaterialsOverview
					materials={materials}
					learnedMaterialKeys={learnedMaterialKeys}
					seenMaterialKeys={seenMaterialKeys}
					materialMastery={materialMastery}
					onBack={onBack}
				/>
			</div>
		</section>
	);
}
