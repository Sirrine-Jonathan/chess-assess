import { PieceSymbol, Color, Move } from "chess.js";

export enum ActionTypeNames {
  SetActivePiece = "SET_ACTIVE_PIECE",
  SetIsConnected = "SET_IS_CONNECTED",
  PerformUpdate = "PERFORM_UPDATE",
  SetCaptured = "SET_CAPTURED",
  SetColorCaptured = "SET_COLOR_CAPTURED",
  SetActiveMoves = "SET_ACTIVE_MOVES",
  SetLastMove = "SET_LAST_MOVE",
}

export type ActionsPayload = {
  [ActionTypeNames.PerformUpdate]: GameUpdate;
  [ActionTypeNames.SetCaptured]: {
    blackCaptured: PieceSymbol[];
    whiteCaptured: PieceSymbol[];
  };
  [ActionTypeNames.SetColorCaptured]: {
    color: Color;
    captured: PieceSymbol[];
  };
  [ActionTypeNames.SetActiveMoves]: Move[];
  [ActionTypeNames.SetLastMove]: Pick<Move, "to" | "from">;
};

export type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
};

export type ActionType =
  ActionMap<ActionsPayload>[keyof ActionMap<ActionsPayload>];

export const reducer = (state: GameState, action: ActionType) => {
  switch (action.type) {
    case ActionTypeNames.PerformUpdate:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypeNames.SetCaptured:
      return {
        ...state,
        whiteCaptured: action.payload.whiteCaptured,
        blackCaptured: action.payload.blackCaptured,
      };
    case ActionTypeNames.SetColorCaptured: {
      return {
        ...state,
        ...(action.payload.color === "w"
          ? { whiteCaptured: action.payload.captured }
          : { blackCaptured: action.payload.captured }),
      };
    }
    case ActionTypeNames.SetActiveMoves:
      return {
        ...state,
        activeMoves: action.payload,
      };
    case ActionTypeNames.SetLastMove:
      return {
        ...state,
        lastMove: action.payload,
      };
    default:
      return state;
  }
};
