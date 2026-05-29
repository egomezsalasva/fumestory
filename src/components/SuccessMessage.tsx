import { Link } from "@tanstack/react-router";

const SuccessMessage = ({
	message,
	link,
	onClose,
}: {
	message: string;
	link?: {
		text: string;
		to: string;
	};
	onClose?: () => void;
}) => {
	return (
		<div className="px-4 py-3 bg-emerald-900/40 border border-emerald-500 rounded-lg text-emerald-200 flex items-center justify-between gap-3">
			<p className="m-0">{message}</p>
			<div className="flex items-center gap-3">
				{link && (
					<Link
						to={link.to}
						className="inline-flex items-center px-3 py-1.5 rounded-[0.25rem] bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium whitespace-nowrap"
					>
						{link.text}
					</Link>
				)}
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label="Close success message"
						className="inline-flex items-center justify-center px-3 py-1.5 rounded-[0.25rem] border border-emerald-400/60 text-emerald-200 hover:bg-emerald-800/40 text-sm font-medium"
					>
						X
					</button>
				)}
			</div>
		</div>
	);
};

export default SuccessMessage;
