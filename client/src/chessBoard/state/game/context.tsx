import type { Dispatch } from "react";
import { DEFAULT_POSITION } from "chess.js";
import { createContext } from "react";
import { ActionType } from "./reducer";

export const initialState: GameState = {
  playerColor: "w",
  ascii: "",
  board: [],
  conflict: {},
  moves: [],
  turn: "w",
  inCheck: false,
  isCheckmate: false,
  isDraw: false,
  isInsufficientMaterial: false,
  isGameOver: false,
  isStalemate: false,
  isThreefoldRepetition: false,
  fen: DEFAULT_POSITION,
  history: [],
  whiteCaptured: [],
  blackCaptured: [],
  lastMove: null,
  activeMoves: [],
  isComputerGame: true,
  botDelay: 1000,
};

const GameContext = createContext<{
  gameState: GameState;
  dispatch: Dispatch<ActionType>;
}>({
  gameState: initialState,
  dispatch: () => null,
});

export { GameContext };
