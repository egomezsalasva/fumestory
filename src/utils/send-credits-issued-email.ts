import { Resend } from "resend";
import type { StripePackId } from "@/utils/stripe";
import { STRIPE_PACKS } from "@/utils/stripe";

const FROM = "Fumestory <credits@fumestory.com>";

const PACK_LABELS: Record<StripePackId, string> = {
	"raw-materials": "Raw Materials pack (+50 materials, +50 dilutions)",
	dilutions: "Dilutions pack (+100 dilutions)",
	compositions: "Compositions pack (+50 compositions, +50 formula mods)",
	"formula-mods": "Formula Mods pack (+100 formula mods)",
};

/** Deterministic code from Stripe session id (idempotent on webhook retries). */
export function paygCodeFromCheckoutSession(sessionId: string): string {
	const raw = sessionId
		.replace(/^cs_(test_|live_)?/i, "")
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "");
	const chunk = (raw.slice(-8) + "XXXXXXXX").slice(0, 8);
	return `FS-${chunk.slice(0, 4)}-${chunk.slice(4, 8)}`;
}

function getResend() {
	const key = process.env.RESEND_API_KEY?.trim();
	if (!key) {
		throw new Error("Missing RESEND_API_KEY");
	}
	return new Resend(key);
}

export async function sendCreditsIssuedEmail(input: {
	to: string;
	packId: StripePackId;
	code: string;
	autoRedeemed: boolean;
}) {
	const packLabel = PACK_LABELS[input.packId];
	const extras = STRIPE_PACKS[input.packId].extras;

	const autoLine = input.autoRedeemed
		? "If you checked out while logged in on the website, these credits should already appear under Usage."
		: "Credits are ready to redeem.";

	const text = [
		"Thanks for your Fumestory purchase.",
		"",
		`Pack: ${packLabel}`,
		`Account email: ${input.to}`,
		"",
		autoLine,
		"",
		"If credits are missing online, or you use the desktop app, redeem with this code (same email + code):",
		input.code,
		"",
		"Each code can only be redeemed once.",
		"",
		"— Fumestory",
		"credits@fumestory.com",
	].join("\n");

	const html = `
		<p>Thanks for your Fumestory purchase.</p>
		<p><strong>Pack:</strong> ${packLabel}</p>
		<p><strong>Account email:</strong> ${input.to}</p>
		<p>${autoLine}</p>
		<p>If credits are missing online, or you use the desktop app, redeem with this code (same email + code):</p>
		<p style="font-size:1.25rem;letter-spacing:0.05em;"><strong>${input.code}</strong></p>
		<p style="color:#666;">Each code can only be redeemed once.</p>
		<p>— Fumestory<br/>credits@fumestory.com</p>
		<!-- extras: m${extras.materials} d${extras.dilutions} c${extras.compositions} mods${extras.mods} -->
	`.trim();

	const resend = getResend();
	const { error } = await resend.emails.send({
		from: FROM,
		to: input.to,
		subject: "Your Fumestory credits",
		text,
		html,
	});

	if (error) {
		throw new Error(error.message);
	}
}
