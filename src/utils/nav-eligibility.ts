import { redirect } from "@tanstack/react-router";
import { authedFetch } from "@/utils/authed-fetch";
import type { DilutionBlindTestStats } from "@/routes/api.scent-blind-tests";
import type { UserSettingsEffective } from "@/utils/user-settings";

/** Fired after inventory/composition mutations so shell UI (e.g. SideNav) can unlock nav items. */
export const NAV_ELIGIBILITY_UPDATED_EVENT =
	"fumestory:nav-eligibility-updated" as const;

/** One-way unlock flags only — callers set `true` after a successful create. */
export type NavEligibilityPatch = {
	hasRawMaterials?: true;
	hasDilutions?: true;
	hasCompositions?: true;
	hasScentTests?: true;
};

export type NavEligibility = {
	hasRawMaterials: boolean;
	hasDilutions: boolean;
	hasCompositions: boolean;
	hasScentTests: boolean;
	guestFeedbackEnabled: boolean;
	scentBlindTestEnabled: boolean;
	materialsQuizEnabled: boolean;
};

export type NavRedirectTarget = {
	to: string;
	hash?: string;
};

const ADD_ON_FEATURES_REDIRECT: NavRedirectTarget = {
	to: "/project-settings",
	hash: "add-on-features",
};

const EMPTY_ELIGIBILITY: NavEligibility = {
	hasRawMaterials: false,
	hasDilutions: false,
	hasCompositions: false,
	hasScentTests: false,
	guestFeedbackEnabled: false,
	scentBlindTestEnabled: false,
	materialsQuizEnabled: true,
};

function hasNonEmptyData(res: Response, json: { data?: unknown[] }): boolean {
	return res.ok && Array.isArray(json.data) && json.data.length > 0;
}

/** Nearest actionable step when dilutions are required but missing. */
function redirectForMissingDilutions(
	eligibility: NavEligibility,
): NavRedirectTarget {
	return eligibility.hasRawMaterials
		? { to: "/add-dilution" }
		: { to: "/add-raw-material" };
}

export async function loadNavEligibility(): Promise<NavEligibility> {
	try {
		const [settingsRes, materialsRes, dilutionsRes, compositionsRes] =
			await Promise.all([
				authedFetch("/api/user-settings"),
				authedFetch("/api/raw-materials"),
				authedFetch("/api/dilutions"),
				authedFetch("/api/compositions"),
			]);

		const [settingsJson, materialsJson, dilutionsJson, compositionsJson] =
			await Promise.all([
				settingsRes.json() as Promise<{ data?: UserSettingsEffective }>,
				materialsRes.json() as Promise<{ data?: unknown[] }>,
				dilutionsRes.json() as Promise<{ data?: unknown[] }>,
				compositionsRes.json() as Promise<{ data?: unknown[] }>,
			]);

		const eligibility: NavEligibility = {
			hasRawMaterials: hasNonEmptyData(materialsRes, materialsJson),
			hasDilutions: hasNonEmptyData(dilutionsRes, dilutionsJson),
			hasCompositions: hasNonEmptyData(compositionsRes, compositionsJson),
			hasScentTests: false,
			guestFeedbackEnabled: false,
			scentBlindTestEnabled: false,
			materialsQuizEnabled: true,
		};

		if (settingsRes.ok && settingsJson.data) {
			eligibility.guestFeedbackEnabled =
				settingsJson.data.guest_feedback_enabled;
			eligibility.scentBlindTestEnabled =
				settingsJson.data.scent_blind_test_enabled;
			eligibility.materialsQuizEnabled =
				settingsJson.data.materials_quiz_enabled;

			if (settingsJson.data.scent_blind_test_enabled) {
				const testsRes = await authedFetch("/api/scent-blind-tests");
				const testsJson = (await testsRes.json()) as {
					data?: DilutionBlindTestStats[];
				};
				eligibility.hasScentTests = hasNonEmptyData(testsRes, testsJson);
			}
		}

		return eligibility;
	} catch {
		return EMPTY_ELIGIBILITY;
	}
}

/** Returns a redirect target when the route's sidenav requirements are not met. */
export function redirectForRoute(
	pathname: string,
	eligibility: NavEligibility,
): NavRedirectTarget | null {
	switch (pathname) {
		case "/inventory":
			return eligibility.hasRawMaterials ? null : { to: "/add-raw-material" };

		case "/add-dilution":
			return eligibility.hasRawMaterials ? null : { to: "/add-raw-material" };

		case "/add-composition":
			return eligibility.hasDilutions
				? null
				: redirectForMissingDilutions(eligibility);

		case "/compositions":
			if (eligibility.hasCompositions) return null;
			if (!eligibility.hasDilutions) {
				return redirectForMissingDilutions(eligibility);
			}
			return { to: "/add-composition" };

		case "/add-feedback":
			if (!eligibility.guestFeedbackEnabled) {
				return ADD_ON_FEATURES_REDIRECT;
			}
			return eligibility.hasDilutions
				? null
				: redirectForMissingDilutions(eligibility);

		case "/scent-blind-test":
			if (!eligibility.scentBlindTestEnabled) {
				return ADD_ON_FEATURES_REDIRECT;
			}
			return eligibility.hasDilutions
				? null
				: redirectForMissingDilutions(eligibility);

		case "/scent-knowledge":
			if (!eligibility.scentBlindTestEnabled) {
				return ADD_ON_FEATURES_REDIRECT;
			}
			return eligibility.hasScentTests ? null : { to: "/scent-blind-test" };

		case "/materials-quiz":
			if (!eligibility.materialsQuizEnabled) {
				return ADD_ON_FEATURES_REDIRECT;
			}
			return null;

		default:
			return null;
	}
}

/** Spread into guarded route configs: `...requireNavRoute("/compositions")` */
export function requireNavRoute(pathname: string) {
	return {
		// beforeLoad needs authedFetch (client session). Skip on server, run after hydration on client.
		ssr: false as const,
		beforeLoad: async () => {
			const eligibility = await loadNavEligibility();
			const target = redirectForRoute(pathname, eligibility);
			if (target) {
				throw redirect({
					to: target.to,
					hash: target.hash,
					replace: true,
				});
			}
		},
	};
}

export function notifyNavEligibilityUpdated(patch: NavEligibilityPatch): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent(NAV_ELIGIBILITY_UPDATED_EVENT, { detail: patch }),
		);
	}
}
