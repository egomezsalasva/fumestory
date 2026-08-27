import { useState } from "react";
import {
	redeemPaygCode,
	type RedeemPaygCodeResult,
} from "@/offline/redeemPaygCode";

type PaygRedeemFormProps = {
	onRedeemed?: (result: RedeemPaygCodeResult) => void;
};

export function PaygRedeemForm({ onRedeemed }: PaygRedeemFormProps) {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setBusy(true);
		try {
			const result = await redeemPaygCode({ email, code });
			setSuccess("Redeemed. Capacity updated on this device.");
			setCode("");
			onRedeemed?.(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to redeem code");
		} finally {
			setBusy(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<label className="block text-sm text-slate-200">
				Email
				<input
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={busy}
					className="mt-1 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white"
					placeholder="email"
				/>
			</label>
			<label className="block text-sm text-slate-200">
				Code
				<input
					type="text"
					required
					value={code}
					onChange={(e) => setCode(e.target.value)}
					disabled={busy}
					className="mt-1 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white"
					placeholder="CODE"
					autoComplete="off"
				/>
			</label>
			<div className="flex justify-center">
				<button
					type="submit"
					disabled={busy}
					className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 disabled:opacity-50"
				>
					{busy ? "Redeeming…" : "Redeem Credits"}
				</button>
			</div>
			{error && (
				<div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
					{error}
				</div>
			)}
			{success && (
				<div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
					{success}
				</div>
			)}
		</form>
	);
}
