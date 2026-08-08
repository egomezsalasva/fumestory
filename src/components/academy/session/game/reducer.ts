import { completeLesson } from "./handlers/completeLesson";
import { nextQuestion } from "./handlers/nextQuestion";
import { openLesson } from "./handlers/openLesson";
import { resetSession } from "./handlers/resetSession";
import { selectOption } from "./handlers/selectOption";
import { startOver } from "./handlers/startOver";
import { startQuiz } from "./handlers/startQuiz";
import { toggleMaterial } from "./handlers/toggleMaterial";
import { tryAgain } from "./handlers/tryAgain";
import type { GameAction, GameState } from "./types";

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "OPEN_LESSON":
			return openLesson(state, action.payload);
		case "TOGGLE_MATERIAL":
			return toggleMaterial(state, action.payload.material);
		case "START_QUIZ":
			return startQuiz(state);
		case "TOGGLE_OPTION":
			return selectOption(state, action.payload.option);
		case "NEXT":
			return nextQuestion(state);
		case "TRY_AGAIN":
			return tryAgain(state);
		case "START_OVER":
			return startOver(state);
		case "RESET_SESSION":
			return resetSession(state);
		case "LESSON_PASSED":
			return state;
		default:
			return state;
	}
}
