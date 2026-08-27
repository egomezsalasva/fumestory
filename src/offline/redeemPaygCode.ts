import {
	getOfflineInstallId,
	setOfflineEntitlements,
	type OfflineEntitlements,
} from "@/offline/db";

export type RedeemPaygCodeInput = {
	email: string;
	code: string;
};

export type RedeemPaygCodeResult = OfflineEntitlements;

type RedeemApiSuccess = {
	success: true;
	data: {
		email: string;
		extras_materials: number;
		extras_dilutions: number;
		extras_compositions: number;
		extras_mods: number;
	};
};

type RedeemApiError = {
	error?: string;
};

export async function redeemPaygCode(
	input: RedeemPaygCodeInput,
): Promise<RedeemPaygCodeResult> {
	const email = input.email.trim().toLowerCase();
	const code = input.code.trim();
	if (!email || !code) {
		throw new Error("Email and code are required");
	}

	const { offline_install_id } = await getOfflineInstallId();

	const response = await fetch("/api/payg/redeem", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email,
			code,
			install_id: offline_install_id,
		}),
	});

	const json = (await response.json()) as RedeemApiSuccess | RedeemApiError;
	if (!response.ok || !("success" in json) || !json.success) {
		const message =
			"error" in json && typeof json.error === "string"
				? json.error
				: "Failed to redeem code";
		throw new Error(message);
	}

	return setOfflineEntitlements({
		email: json.data.email,
		extras_materials: json.data.extras_materials,
		extras_dilutions: json.data.extras_dilutions,
		extras_compositions: json.data.extras_compositions,
		extras_mods: json.data.extras_mods,
	});
}
