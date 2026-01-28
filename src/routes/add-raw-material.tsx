import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add-raw-material")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-[calc(100vh-60px)] bg-slate-900 p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold text-white mb-7">Add Raw Material</h1>
				<div className="bg-slate-800 rounded-lg p-6">
					<p className="text-gray-400">Form coming next...</p>
				</div>
			</div>
		</div>
	);
}
