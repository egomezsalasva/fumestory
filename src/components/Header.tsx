import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { authClient } from "../../auth";

function SignOutAction() {
	const navigate = useNavigate();
	return (
		<button
			onClick={async () => {
				await authClient.signOut();
				navigate({ to: "/", replace: true });
			}}
			className="px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm"
		>
			Sign out
		</button>
	);
}

const Header = () => {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	// Check which section we're in
	const isInventory =
		currentPath === "/inventory" ||
		currentPath.startsWith("/add-raw-material") ||
		currentPath.startsWith("/add-dilution") ||
		currentPath.startsWith("/add-feedback");

	const isCompositions =
		currentPath.startsWith("/compositions") ||
		currentPath.startsWith("/add-composition") ||
		currentPath.startsWith("/composition") ||
		currentPath.startsWith("/add-formula");

	return (
		<header className="h-15 bg-slate-800 border-b border-slate-700">
			<div className="h-full max-w-7xl mx-auto px-8">
				<div className="h-full flex items-center justify-between">
					{/* Left: Navigation */}
					<nav className="flex gap-5">
						<Link
							to="/inventory"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Inventory
						</Link>
						<Link
							to="/compositions"
							className="text-gray-300 hover:text-white transition-colors"
							activeProps={{ className: "text-white font-semibold" }}
						>
							Compositions
						</Link>
					</nav>

					{/* Right: Conditional Actions */}
					<nav className="flex gap-5">
						{isInventory && (
							<>
								<Link
									to="/add-raw-material"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Raw Material
								</Link>
								<Link
									to="/add-dilution"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Dilution
								</Link>
								<Link
									to="/add-feedback"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Guest Feedback
								</Link>
							</>
						)}
						{isCompositions && (
							<>
								<Link
									to="/add-composition"
									className="text-gray-300 hover:text-white transition-colors"
									activeProps={{ className: "text-white font-semibold" }}
								>
									+ Composition
								</Link>
							</>
						)}
					</nav>

					<div className="flex items-center gap-2">
						<SignOutAction />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
