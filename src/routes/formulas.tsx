import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/formulas")({
	component: Formulas,
});

function Formulas() {
	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">Formulas</div>
	);
}
