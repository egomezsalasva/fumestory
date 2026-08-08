import { MAX_LIVES } from "../../constants";
import type { GameState } from "../types";
import { tryAgain } from "./tryAgain";

export function startOver(state: GameState): GameState {
	return tryAgain({
		...state,
		gameOverStreak: 0,
		lives: MAX_LIVES,
		lessonStreak: 0,
	});
}
