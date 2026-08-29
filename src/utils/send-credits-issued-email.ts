import { Resend } from "resend";
import type { StripePackId } from "@/utils/stripe";
import { STRIPE_PACKS } from "@/utils/stripe";

const FROM = "Fumestory <credits@fumestory.com>";
const SITE = "https://fumestory.com";

const PACK_LABELS: Record<StripePackId, string> = {
	"raw-materials": "Raw Materials pack",
	dilutions: "Dilutions pack",
	compositions: "Compositions pack",
	"formula-mods": "Formula Mods pack",
};

function packExtrasLine(packId: StripePackId): string {
	const e = STRIPE_PACKS[packId].extras;
	const parts: string[] = [];
	if (e.materials) parts.push(`+${e.materials} materials`);
	if (e.dilutions) parts.push(`+${e.dilutions} dilutions`);
	if (e.compositions) parts.push(`+${e.compositions} compositions`);
	if (e.mods) parts.push(`+${e.mods} formula mods`);
	return parts.join(" · ");
}

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
	const extrasLine = packExtrasLine(input.packId);
	const extras = STRIPE_PACKS[input.packId].extras;

	const autoLine = input.autoRedeemed
		? "You checked out while logged in — credits should already show under Usage on the website."
		: "Redeem these credits in Fumestory (web or desktop) with the email and code below.";

	const text = [
		"Fumestory",
		"",
		"Thanks for your purchase.",
		"",
		`Pack: ${packLabel}`,
		extrasLine,
		`Email: ${input.to}`,
		"",
		autoLine,
		"",
		"Redeem code (web or desktop app):",
		input.code,
		"",
		"Use the same email you paid with. Each code works once.",
		"",
		`${SITE}/pricing`,
		"",
		"— Fumestory",
		"credits@fumestory.com",
	].join("\n");

	const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#070707;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070707;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#0e0e0e;border:1px solid #2a2a2a;">
          <tr>
            <td style="padding:28px 28px 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.04em;color:#f5f7fa;">
              Fumestory
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.5;color:#c8cdd4;">
              Thanks for your purchase.
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a9199;">Pack</p>
              <p style="margin:0 0 4px;font-size:18px;font-weight:600;color:#f5f7fa;">${packLabel}</p>
              <p style="margin:0;font-size:14px;color:#a8 greyb0;">${extrasLine}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.55;color:#c8cdd4;">
              ${autoLine}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070707;border:1px solid #3a3a3a;">
                <tr>
                  <td style="padding:20px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                    <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a9199;">Email</p>
                    <p style="margin:0 0 18px;font-size:15px;color:#f5f7fa;">${input.to}</p>
                    <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a9199;">Code</p>
                    <p style="margin:0;font-size:26px;font-weight:600;letter-spacing:0.12em;color:#f5f7fa;">${input.code}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.5;color:#8a9199;">
              Use the same email you paid with. Each code can only be redeemed once — on the website under Usage, or in the desktop app.
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
              <a href="${SITE}/pricing" style="display:inline-block;padding:12px 20px;border:2px solid #f5f7fa;color:#f5f7fa;text-decoration:none;font-size:14px;font-weight:500;">
                View pricing
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;border-top:1px solid #2a2a2a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">
              <p style="margin:20px 0 0;">Fumestory · <a href="mailto:credits@fumestory.com" style="color:#8a9199;">credits@fumestory.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- extras: m${extras.materials} d${extras.dilutions} c${extras.compositions} mods${extras.mods} -->
</body>
</html>
	`.trim();

	const resend = getResend();
	const { error } = await resend.emails.send({
		from: FROM,
		to: input.to,
		subject: `Your Fumestory credits — ${packLabel}`,
		text,
		html,
	});

	if (error) {
		throw new Error(error.message);
	}
}
