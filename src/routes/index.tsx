import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
	useEffect(() => {
		fetch("/api/health")
			.then((res) => res.json())
			.then((data) => console.log("Database test:", data))
			.catch((err) => console.error("Database error:", err));
	}, []);

	return (
		<div className="min-h-screen bg-slate-900 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-white mb-4">
					Perfume Organizer
				</h1>
				<p className="text-gray-400">Manage your raw materials and formulas</p>
			</div>
		</div>
	);
}
