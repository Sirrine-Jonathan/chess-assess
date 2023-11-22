"use client";

import type { Dispatch, ReactNode } from "react";
import { PieceColor, PieceType } from "./pieces";
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Rook, Knight, Bishop, Queen, King, Pawn } from "./pieces";
import { Square } from "./Square";
import "./chessBoard.css";

export enum Sq {
  "A1" = "a1",
  "A2" = "a2",
  "A3" = "a3",
  "A4" = "a4",
  "A5" = "a5",
  "A6" = "a6",
  "A7" = "a7",
  "A8" = "a8",
  "B1" = "b1",
  "B2" = "b2",
  "B3" = "b3",
  "B4" = "b4",
  "B5" = "b5",
  "B6" = "b6",
  "B7" = "b7",
  "B8" = "b8",
  "C1" = "c1",
  "C2" = "c2",
  "C3" = "c3",
  "C4" = "c4",
  "C5" = "c5",
  "C6" = "c6",
  "C7" = "c7",
  "C8" = "c8",
  "D1" = "d1",
  "D2" = "d2",
  "D3" = "d3",
  "D4" = "d4",
  "D5" = "d5",
  "D6" = "d6",
  "D7" = "d7",
  "D8" = "d8",
  "E1" = "e1",
  "E2" = "e2",
  "E3" = "e3",
  "E4" = "e4",
  "E5" = "e5",
  "E6" = "e6",
  "E7" = "e7",
  "E8" = "e8",
  "F1" = "f1",
  "F2" = "f2",
  "F3" = "f3",
  "F4" = "f4",
  "F5" = "f5",
  "F6" = "f6",
  "F7" = "f7",
  "F8" = "f8",
  "G1" = "g1",
  "G2" = "g2",
  "G3" = "g3",
  "G4" = "g4",
  "G5" = "g5",
  "G6" = "g6",
  "G7" = "g7",
  "G8" = "g8",
  "H1" = "h1",
  "H2" = "h2",
  "H3" = "h3",
  "H4" = "h4",
  "H5" = "h5",
  "H6" = "h6",
  "H7" = "h7",
  "H8" = "h8",
}
interface ChessBoardState {
  activePiece: string | null;
}

const initialState = {
  activePiece: null,
};

const ChessBoardContext = createContext<{
  state: ChessBoardState;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

enum ActionTypeNames {
  SetActivePiece = "SET_ACTIVE_PIECE",
  UpdateDroppables = "UPDATE_DROPPABLES",
}

type ActionsPayload = {
  [ActionTypeNames.SetActivePiece]: string;
  [ActionTypeNames.UpdateDroppables]: {
    piece: { type: PieceType; color: PieceColor };
    square: Sq;
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
    default:
      return state;
  }
};

export const ChessBoardContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ChessBoardContext.Provider value={contextValue}>
      {children}
    </ChessBoardContext.Provider>
  );
};

export const useChessBoardContext = () => {
  const { state, dispatch } = useContext(ChessBoardContext);

  const actions = useCallback(() => {
    return {
      setActivePiece: (piece: string) => {
        dispatch({
          type: ActionTypeNames.SetActivePiece,
          payload: piece,
        });
      },
      updateDroppables: ({
        piece,
        square,
      }: {
        piece: { type: PieceType; color: PieceColor };
        square: Sq;
      }) => {
        console.log("dispatching start of move", { piece, square });
        dispatch({
          type: ActionTypeNames.UpdateDroppables,
          payload: { piece, square },
        });
      },
    };
  }, [state, dispatch]);

  return { State: state, Actions: actions };
};

export const ChessBoardInner = () => {
  const handleDragStart = useCallback(function handleDragStart({
    active,
  }: DragStartEvent) {
    console.log("piece active", active);
  },
  []);

  const handleDragEnd = useCallback(function handleDragEnd(
    event: DragEndEvent
  ) {
    console.log("drag end", event);
  },
  []);

  const handleDragCancel = useCallback(() => {
    console.log("drag cancel");
  }, []);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board flex flex-col">
        <div className="row flex flex-row">
          <Square name={Sq.A8}>
            <Rook color={PieceColor.Black} />
          </Square>
          <Square name={Sq.B8}>
            <Knight color={PieceColor.Black} />
          </Square>
          <Square name={Sq.C8}>
            <Bishop color={PieceColor.Black} />
          </Square>
          <Square name={Sq.D8}>
            <Queen color={PieceColor.Black} />
          </Square>
          <Square name={Sq.E8}>
            <King color={PieceColor.Black} />
          </Square>
          <Square name={Sq.F8}>
            <Bishop color={PieceColor.Black} />
          </Square>
          <Square name={Sq.G8}>
            <Knight color={PieceColor.Black} />
          </Square>
          <Square name={Sq.H8}>
            <Rook color={PieceColor.Black} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.B7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.C7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.D7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.E7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.F7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.G7}>
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name={Sq.H7}>
            <Pawn color={PieceColor.Black} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A6} />
          <Square name={Sq.B6} />
          <Square name={Sq.C6} />
          <Square name={Sq.D6} />
          <Square name={Sq.E6} />
          <Square name={Sq.F6} />
          <Square name={Sq.G6} />
          <Square name={Sq.H6} />
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A5} />
          <Square name={Sq.B5} />
          <Square name={Sq.C5} />
          <Square name={Sq.D5} />
          <Square name={Sq.E5} />
          <Square name={Sq.F5} />
          <Square name={Sq.G5} />
          <Square name={Sq.H5} />
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A4} />
          <Square name={Sq.B4} />
          <Square name={Sq.C4} />
          <Square name={Sq.D4} />
          <Square name={Sq.E4} />
          <Square name={Sq.F4} />
          <Square name={Sq.G4} />
          <Square name={Sq.H4} />
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A3} />
          <Square name={Sq.B3} />
          <Square name={Sq.C3} />
          <Square name={Sq.D3} />
          <Square name={Sq.E3} />
          <Square name={Sq.F3} />
          <Square name={Sq.G3} />
          <Square name={Sq.H3} />
        </div>
        <div className="row flex flex-row">
          <Square name={Sq.A2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.B2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.C2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.D2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.E2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.F2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.G2}>
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name={Sq.H2}>
            <Pawn color={PieceColor.White} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name="a1">
            <Rook color={PieceColor.White} />
          </Square>
          <Square name={Sq.B1}>
            <Knight color={PieceColor.White} />
          </Square>
          <Square name={Sq.C1}>
            <Bishop color={PieceColor.White} />
          </Square>
          <Square name={Sq.D1}>
            <Queen color={PieceColor.White} />
          </Square>
          <Square name={Sq.E1}>
            <King color={PieceColor.White} />
          </Square>
          <Square name={Sq.F1}>
            <Bishop color={PieceColor.White} />
          </Square>
          <Square name={Sq.G1}>
            <Knight color={PieceColor.White} />
          </Square>
          <Square name={Sq.H1}>
            <Rook color={PieceColor.White} />
          </Square>
        </div>
      </div>
    </DndContext>
  );
};

export const ChessBoard = () => (
  <ChessBoardContextProvider>
    <ChessBoardInner />
  </ChessBoardContextProvider>
);
