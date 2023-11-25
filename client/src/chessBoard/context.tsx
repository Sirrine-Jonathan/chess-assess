import type { Dispatch, ReactNode } from "react";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import {
  PieceColor,
  PieceType,
  Sq,
  type ChessBoardState,
  type Board,
  type Move,
  type Piece,
} from "./chessTypes";
import { socket } from "./ChessBoard";

const initialState = {
  activePiece: null,
  isConnected: false,
  board: [],
  moves: [],
  turn: PieceColor.White,
  ascii: "",
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
  SetTurn = "SET_TURN",
  SetAscii = "SET_ASCII",
}

type ActionsPayload = {
  [ActionTypeNames.SetActivePiece]: Piece | null;
  [ActionTypeNames.UpdateDroppables]: {
    piece: { type: PieceType; color: PieceColor };
    square: Sq;
  };
  [ActionTypeNames.SetIsConnected]: boolean;
  [ActionTypeNames.SetBoard]: Board;
  [ActionTypeNames.SetMoves]: Move[];
  [ActionTypeNames.SetTurn]: PieceColor;
  [ActionTypeNames.SetAscii]: string;
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
        moves: action.payload,
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
  }, []);

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
      setActivePiece: (piece: Piece | null) => {
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
        socket.emit("move", move);
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
      setMoves: (moves: Move[]) => {
        dispatch({
          type: ActionTypeNames.SetMoves,
          payload: moves,
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
    };
  }, [dispatch]);

  return { State: state, Actions: actions };
};
