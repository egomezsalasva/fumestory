import { Link, useRouterState } from "@tanstack/react-router";

const Header = () => {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	// Check which section we're in
	const isInventory =
		currentPath === "/" ||
		currentPath.startsWith("/add-raw-material") ||
		currentPath.startsWith("/add-dilution") ||
		currentPath.startsWith("/add-feedback");

	return (
		<header className="h-15 bg-slate-800 border-b border-slate-700">
			<div className="h-full max-w-7xl mx-auto px-8">
				<div className="h-full flex items-center justify-between">
					{/* Left: Navigation */}
					<nav className="flex gap-6">
						<Link
							to="/"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Inventory
						</Link>
						<span className="text-gray-600 cursor-not-allowed">Accords</span>
						<span className="text-gray-600 cursor-not-allowed">Perfumes</span>
					</nav>

					{/* Right: Conditional Actions */}
					<nav className="flex gap-6">
						{isInventory && (
							<>
								<Link
									to="/add-raw-material"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Add Material
								</Link>
								<Link
									to="/add-dilution"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Add Dilution
								</Link>
								<Link
									to="/add-feedback"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Add Feedback
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
