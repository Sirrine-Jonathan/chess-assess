import type { Dispatch, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess.js";
import { DEFAULT_POSITION } from "chess.js";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";

import { socket } from "./ChessBoard";

const initialState: ChessBoardState = {
  activePiece: null,
  activeMoves: [],
  lastMove: null,
  isConnected: false,
  lockedPieces: {},
  playerColor: "w",
  whiteCaptured: [],
  blackCaptured: [],
  game: {
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
  },
};

const ChessBoardContext = createContext<{
  state: ChessBoardState;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

enum ActionTypeNames {
  SetActivePiece = "SET_ACTIVE_PIECE",
  SetIsConnected = "SET_IS_CONNECTED",
  PerformUpdate = "PERFORM_UPDATE",
  SetCaptured = "SET_CAPTURED",
  SetColorCaptured = "SET_COLOR_CAPTURED",
  SetActiveMoves = "SET_ACTIVE_MOVES",
  SetLastMove = "SET_LAST_MOVE",
}

type ActionsPayload = {
  [ActionTypeNames.SetActivePiece]: ChessPiece | null;
  [ActionTypeNames.SetIsConnected]: boolean;
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
  [ActionTypeNames.SetLastMove]: Move;
};

type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
};

type ActionType = ActionMap<ActionsPayload>[keyof ActionMap<ActionsPayload>];

const reducer = (state: ChessBoardState, action: ActionType) => {
  switch (action.type) {
    case ActionTypeNames.SetActivePiece:
      return {
        ...state,
        activePiece: action.payload,
      };
    case ActionTypeNames.SetIsConnected:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ActionTypeNames.PerformUpdate:
      return {
        ...state,
        game: action.payload,
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

export const ChessBoardContextProvider = ({
  fen,
  children,
}: {
  fen?: string;
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    if (fen) {
      socket.emit("load", fen);
    }
  }, [fen]);

  return (
    <ChessBoardContext.Provider value={contextValue}>
      {children}
    </ChessBoardContext.Provider>
  );
};

export const useChessBoardContext = () => {
  const { state, dispatch } = useContext(ChessBoardContext);

  const actions = useMemo(() => {
    return {
      setActivePiece: (piece: ChessPiece | null) => {
        dispatch({
          type: ActionTypeNames.SetActivePiece,
          payload: piece,
        });
        if (piece) {
          socket.emit("moving", piece.from);
        }
      },
      move: (move: { to: Square; from: Square }) => {
        const finalMove = { ...move } as {
          to: Square;
          from: Square;
          promotion: "p" | "n" | "b" | "r" | "q" | "k";
        };

        const fromPiece = state.game.board
          .flat()
          .find((place) => place && move.from === place.square);
        if (fromPiece?.type === "p") {
          console.log("okay", {
            move,
            file: move.to.split("")[1],
          });
          const file = move.to.split("")[1];
          if (file === "8" || file === "1") {
            finalMove.promotion = "q";
          }
        }

        socket.emit("move", finalMove);
      },
      // Responses to server socket emit
      setIsConnected: (isConnected: boolean) => {
        dispatch({
          type: ActionTypeNames.SetIsConnected,
          payload: isConnected,
        });
      },
      performUpdate: (update: GameUpdate) => {
        dispatch({
          type: ActionTypeNames.PerformUpdate,
          payload: update,
        });
      },
      setColorCaptured: (event: CaptureEvent) => {
        const { whiteCaptured, blackCaptured } = state;
        let capturedCopy =
          event.color === "w" ? [...whiteCaptured] : [...blackCaptured];
        capturedCopy = [...capturedCopy, event.piece];
        dispatch({
          type: ActionTypeNames.SetColorCaptured,
          payload: {
            color: event.color,
            captured: capturedCopy,
          },
        });
      },
      setLoadDetails: (details: {
        blackCaptured: PieceSymbol[];
        whiteCaptured: PieceSymbol[];
      }) => {
        dispatch({
          type: ActionTypeNames.SetCaptured,
          payload: details,
        });
      },
      setActiveMoves: (moves: Move[]) => {
        dispatch({
          type: ActionTypeNames.SetActiveMoves,
          payload: moves,
        });
      },
      setLastMove: (move: Move) => {
        dispatch({
          type: ActionTypeNames.SetLastMove,
          payload: move,
        });
      },
    };
  }, [state, dispatch]);

  return { State: state, Actions: actions };
};
