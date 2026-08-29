import Stripe from "stripe";

export function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY?.trim();
	if (!key) {
		throw new Error("Missing STRIPE_SECRET_KEY");
	}
	return new Stripe(key, {
		apiVersion: "2026-08-26.dahlia",
	});
}

export const STRIPE_PACKS = {
	"raw-materials": {
		priceEnv: "STRIPE_PRICE_RAW_MATERIALS",
		extras: {
			materials: 50,
			dilutions: 50,
			compositions: 0,
			mods: 0,
		},
	},
	dilutions: {
		priceEnv: "STRIPE_PRICE_DILUTIONS",
		extras: {
			materials: 0,
			dilutions: 100,
			compositions: 0,
			mods: 0,
		},
	},
	compositions: {
		priceEnv: "STRIPE_PRICE_COMPOSITIONS",
		extras: {
			materials: 0,
			dilutions: 0,
			compositions: 50,
			mods: 50,
		},
	},
	"formula-mods": {
		priceEnv: "STRIPE_PRICE_FORMULA_MODS",
		extras: {
			materials: 0,
			dilutions: 0,
			compositions: 0,
			mods: 100,
		},
	},
} as const;

export type StripePackId = keyof typeof STRIPE_PACKS;

export function isStripePackId(value: string): value is StripePackId {
	return value in STRIPE_PACKS;
}

export function getStripePriceId(packId: StripePackId): string | null {
	const envKey = STRIPE_PACKS[packId].priceEnv;
	const priceId = process.env[envKey]?.trim();
	return priceId || null;
}
