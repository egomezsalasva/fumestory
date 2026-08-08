import { MAX_LEVEL } from "../../constants";
import type { Level } from "../../types";

export function resolveLevel(sectionIndex: number): Level {
	return Math.min(MAX_LEVEL, Math.max(1, sectionIndex)) as Level;
}
