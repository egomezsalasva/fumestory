import { Link } from "@tanstack/react-router";

const Header = () => {
	return (
		<header className="h-15 bg-slate-800 border-b border-slate-700">
			<div className="h-full max-w-7xl mx-auto px-8 py-4">
				<div className="h-full flex items-center justify-end">
					<nav className="flex gap-6">
						<Link
							to="/"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Inventory
						</Link>
						<Link
							to="/add-raw-material"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Add Raw Material
						</Link>
						<Link
							to="/add-dilution"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Add Dilution
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
