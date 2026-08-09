import type { GameState } from "../types";
import { initialGameState } from "../state";

/** Wipe all game progress and return to a fresh session. */
export function startOver(_state: GameState): GameState {
	return { ...initialGameState };
}
