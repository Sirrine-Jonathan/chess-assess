import type { Dispatch, ReactNode } from "react";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import type {
  ChessBoardState,
  Board,
  ChessPiece,
  Update,
  HistoryItem,
  Position,
  ShowPosition,
  CaptureEvent,
} from "./chessTypes";
import { PieceColor, PieceType, Sq } from "./chessTypes";
import { socket } from "./ChessBoard";

const initialState: ChessBoardState = {
  activePiece: null,
  isConnected: false,
  board: [],
  piecePosition: { moves: [], defending: [] },
  position: { moves: [], defending: [] },
  enemyPosition: { moves: [], defending: [] },
  lockedPieces: {},
  turn: PieceColor.White,
  ascii: "",
  inCheck: false,
  isCheckmate: false,
  isDraw: false,
  isInsufficientMaterial: false,
  isGameOver: false,
  isStalemate: false,
  isThreefoldRepetition: false,
  history: [],
  playerColor: "w" as PieceColor,
  whiteCaptured: [],
  blackCaptured: [],
};

const ChessBoardContext = createContext<{
  state: ChessBoardState;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

enum ActionTypeNames {
  SetActivePiece = "SET_ACTIVE_PIECE",
  UpdateDroppables = "UPDATE_DROPPABLES",
  SetIsConnected = "SET_IS_CONNECTED",
  SetBoard = "SET_BOARD",
  SetMoves = "SET_MOVES",
  SetPositions = "SET_POSITIONS",
  SetTurn = "SET_TURN",
  SetAscii = "SET_ASCII",
  SetState = "SET_STATE",
  SetHistory = "SET_HISTORY",
  SetCaptured = "SET_CAPTURED",
  SetColorCaptured = "SET_COLOR_CAPTURED",
}

type ActionsPayload = {
  [ActionTypeNames.SetActivePiece]: ChessPiece | null;
  [ActionTypeNames.UpdateDroppables]: {
    piece: { type: PieceType; color: PieceColor };
    square: Sq;
  };
  [ActionTypeNames.SetIsConnected]: boolean;
  [ActionTypeNames.SetBoard]: Board;
  [ActionTypeNames.SetMoves]: Position;
  [ActionTypeNames.SetPositions]: ShowPosition;
  [ActionTypeNames.SetTurn]: PieceColor;
  [ActionTypeNames.SetAscii]: string;
  [ActionTypeNames.SetState]: Partial<Update>;
  [ActionTypeNames.SetHistory]: HistoryItem[];
  [ActionTypeNames.SetCaptured]: {
    blackCaptured: PieceType[];
    whiteCaptured: PieceType[];
  };
  [ActionTypeNames.SetColorCaptured]: {
    color: PieceColor;
    captured: PieceType[];
  };
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
    case ActionTypeNames.UpdateDroppables:
      return {
        ...state,
      };
    case ActionTypeNames.SetIsConnected:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ActionTypeNames.SetBoard:
      return {
        ...state,
        board: action.payload,
      };
    case ActionTypeNames.SetMoves:
      return {
        ...state,
        piecePosition: action.payload,
      };
    case ActionTypeNames.SetPositions:
      return {
        ...state,
        position: action.payload.position,
        enemyPosition: action.payload.enemyPosition,
      };
    case ActionTypeNames.SetTurn:
      return {
        ...state,
        turn: action.payload,
      };
    case ActionTypeNames.SetAscii:
      return {
        ...state,
        ascii: action.payload,
      };
    case ActionTypeNames.SetState:
      return {
        ...state,
        ...action.payload,
      };
    case ActionTypeNames.SetHistory:
      return {
        ...state,
        history: action.payload,
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
        } else {
          socket.emit("moves");
        }
      },
      move: (move: { to: Sq; from: Sq }) => {
        const finalMove = { ...move } as {
          to: Sq;
          from: Sq;
          promotion: "p" | "n" | "b" | "r" | "q" | "k";
        };

        const fromPiece = state.board
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
      updateDroppables: ({
        piece,
        square,
      }: {
        piece: { type: PieceType; color: PieceColor };
        square: Sq;
      }) => {
        dispatch({
          type: ActionTypeNames.UpdateDroppables,
          payload: { piece, square },
        });
      },
      setIsConnected: (isConnected: boolean) => {
        dispatch({
          type: ActionTypeNames.SetIsConnected,
          payload: isConnected,
        });
      },
      setBoard: (board: Board) => {
        dispatch({
          type: ActionTypeNames.SetBoard,
          payload: board,
        });
      },
      setMoves: (position: Position) => {
        dispatch({
          type: ActionTypeNames.SetMoves,
          payload: position,
        });
      },
      setPositions: (position: ShowPosition) => {
        dispatch({
          type: ActionTypeNames.SetPositions,
          payload: position,
        });
      },
      setTurn: (turn: PieceColor) => {
        dispatch({
          type: ActionTypeNames.SetTurn,
          payload: turn,
        });
      },
      setAscii: (ascii: string) => {
        dispatch({
          type: ActionTypeNames.SetAscii,
          payload: ascii,
        });
      },
      setState: (state: Partial<Update>) => {
        dispatch({
          type: ActionTypeNames.SetState,
          payload: state,
        });
      },
      setHistory: (history: HistoryItem[]) => {
        dispatch({
          type: ActionTypeNames.SetHistory,
          payload: history,
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
        blackCaptured: PieceType[];
        whiteCaptured: PieceType[];
      }) => {
        dispatch({
          type: ActionTypeNames.SetCaptured,
          payload: details,
        });
      },
    };
  }, [state, dispatch]);

  return { State: state, Actions: actions };
};
