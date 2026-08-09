import UnitCompleteCard from "../UnitCompleteCard";

type UnitCompletePhaseProps = {
	unitName: string;
	onContinue: () => void;
};

export default function UnitCompletePhase({
	unitName,
	onContinue,
}: UnitCompletePhaseProps) {
	return <UnitCompleteCard unitName={unitName} onContinue={onContinue} />;
}
