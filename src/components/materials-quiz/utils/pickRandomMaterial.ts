import type { MaterialRecord } from "@/curation/materials/types";

export function pickRandomMaterial(
	materials: MaterialRecord[],
): MaterialRecord {
	if (materials.length === 0) {
		throw new Error("Cannot pick a random material from an empty list");
	}

	const index = Math.floor(Math.random() * materials.length);
	return materials[index];
}
