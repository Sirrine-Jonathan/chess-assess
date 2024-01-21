import { PieceSymbol, Color, Move, Square } from "chess.js";

export enum ActionTypeNames {
  SetActivePiece = "SET_ACTIVE_PIECE",
  SetIsConnected = "SET_IS_CONNECTED",
  PerformUpdate = "PERFORM_UPDATE",
  SetCaptured = "SET_CAPTURED",
  SetColorCaptured = "SET_COLOR_CAPTURED",
  SetActiveMoves = "SET_ACTIVE_MOVES",
  SetLastMove = "SET_LAST_MOVE",
  UpdatePieceMap = "UPDATE_PIECE_MAP",
  SetLockedMoves = "SET_LOCKED_MOVES",
  SetLockedDefense = "SET_LOCKED_DEFENSE",
  SetNavIndex = "SET_NAV_INDEX",
  SetPromotion = 'SET_PROMOTION'
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
  [ActionTypeNames.UpdatePieceMap]: GameState["pieceMap"];
  [ActionTypeNames.SetLockedMoves]: Move[];
  [ActionTypeNames.SetLockedDefense]: Move[];
  [ActionTypeNames.SetNavIndex]: number;
  [ActionTypeNames.SetPromotion]: {
    to: Square;
    from: Square;
    promotion: "n" | "b" | "r" | "q";
  } | null;
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
    case ActionTypeNames.UpdatePieceMap:
      return {
        ...state,
        pieceMap: action.payload,
      };
    case ActionTypeNames.SetLockedMoves:
      return {
        ...state,
        lockedMoves: action.payload,
      };
    case ActionTypeNames.SetLockedDefense:
      return {
        ...state,
        lockedDefense: action.payload,
      };
    case ActionTypeNames.SetNavIndex:
      return {
        ...state,
        navIndex: action.payload
      }
    case ActionTypeNames.SetPromotion:
      return {
        ...state,
        promotion: action.payload
      }
    default:
      return state;
  }
};
