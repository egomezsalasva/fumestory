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

export function notifyNavEligibilityUpdated(patch: NavEligibilityPatch): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(
			new CustomEvent(NAV_ELIGIBILITY_UPDATED_EVENT, { detail: patch }),
		);
	}
}
