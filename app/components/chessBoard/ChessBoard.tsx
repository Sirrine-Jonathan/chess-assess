"use client";

import type { Dispatch, ReactNode } from "react";
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { PieceColor, Rook, Knight, Bishop, Queen, King, Pawn } from "./pieces";
import { Square } from "./Square";
import "./chessBoard.css";

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
}

type ActionsPayload = {
  [ActionTypeNames.SetActivePiece]: string;
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
    console.log("drag end");
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
          <Square name="a8">
            <Rook color={PieceColor.Black} />
          </Square>
          <Square name="b8">
            <Knight color={PieceColor.Black} />
          </Square>
          <Square name="c8">
            <Bishop color={PieceColor.Black} />
          </Square>
          <Square name="d8">
            <Queen color={PieceColor.Black} />
          </Square>
          <Square name="e8">
            <King color={PieceColor.Black} />
          </Square>
          <Square name="f8">
            <Bishop color={PieceColor.Black} />
          </Square>
          <Square name="g8">
            <Knight color={PieceColor.Black} />
          </Square>
          <Square name="h8">
            <Rook color={PieceColor.Black} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name="a7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="b7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="c7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="d7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="e7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="f7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="g7">
            <Pawn color={PieceColor.Black} />
          </Square>
          <Square name="h7">
            <Pawn color={PieceColor.Black} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name="a6" />
          <Square name="b6" />
          <Square name="c6" />
          <Square name="d6" />
          <Square name="e6" />
          <Square name="f6" />
          <Square name="g6" />
          <Square name="h6" />
        </div>
        <div className="row flex flex-row">
          <Square name="a5" />
          <Square name="b5" />
          <Square name="c5" />
          <Square name="d5" />
          <Square name="e5" />
          <Square name="f5" />
          <Square name="g5" />
          <Square name="h5" />
        </div>
        <div className="row flex flex-row">
          <Square name="a4" />
          <Square name="b4" />
          <Square name="c4" />
          <Square name="d4" />
          <Square name="e4" />
          <Square name="f4" />
          <Square name="g4" />
          <Square name="h4" />
        </div>
        <div className="row flex flex-row">
          <Square name="a3" />
          <Square name="b3" />
          <Square name="c3" />
          <Square name="d3" />
          <Square name="e3" />
          <Square name="f3" />
          <Square name="g3" />
          <Square name="h3" />
        </div>
        <div className="row flex flex-row">
          <Square name="a2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="b2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="c2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="d2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="e2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="f2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="g2">
            <Pawn color={PieceColor.White} />
          </Square>
          <Square name="h2">
            <Pawn color={PieceColor.White} />
          </Square>
        </div>
        <div className="row flex flex-row">
          <Square name="a1">
            <Rook color={PieceColor.White} />
          </Square>
          <Square name="b1">
            <Knight color={PieceColor.White} />
          </Square>
          <Square name="c1">
            <Bishop color={PieceColor.White} />
          </Square>
          <Square name="d1">
            <Queen color={PieceColor.White} />
          </Square>
          <Square name="e1">
            <King color={PieceColor.White} />
          </Square>
          <Square name="f1">
            <Bishop color={PieceColor.White} />
          </Square>
          <Square name="g1">
            <Knight color={PieceColor.White} />
          </Square>
          <Square name="h1">
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
