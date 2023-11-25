import type { Update, ShowMoves, Piece } from "./chessTypes";
import { useEffect } from "react";
import { PieceColor, PieceType } from "./chessTypes";
import { useCallback } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import { BasePiece } from "./pieces/BasePiece";
import { Square } from "./Square";
import { useChessBoardContext, ChessBoardContextProvider } from "./context";
import "./chessBoard.scss";
import io from "socket.io-client";

const socket = io("ws://localhost:4000/chess", {
  autoConnect: false,
});

export const ChessBoardInner = ({
  onConnectionChange,
}: {
  onConnectionChange: (isConnected: boolean) => void;
}) => {
  const { Actions, State } = useChessBoardContext();

  useEffect(() => {
    if (!State.isConnected) {
      socket.connect();
    }

    function onConnect() {
      Actions.setIsConnected(true);
    }

    function onDisconnect() {
      Actions.setIsConnected(false);
    }

    function onUpdate(update: Update) {
      console.log("update", update);
      Actions.setBoard(update.board);
      Actions.setTurn(update.turn);
      Actions.setAscii(update.ascii);
      Actions.setMoves(update.moves);
    }

    function onShowMoves(showMoves: ShowMoves) {
      console.log("checkMoves", showMoves);
      Actions.setMoves(showMoves.moves);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update", onUpdate);
    socket.on("showMoves", onShowMoves);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update", onUpdate);
      socket.off("showMoves", onShowMoves);
    };
  });

  useEffect(() => {
    console.log("connection change", { isConnected: State.isConnected });
    onConnectionChange(State.isConnected);
  }, [State.isConnected, onConnectionChange]);

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const [color, piece, from] = (event.active.id as string).split("-");
      Actions.setActivePiece({ color, piece, from } as Piece);
      socket.emit("dragStart", from);
      console.log("emitting dragStart", from);
    },
    [Actions]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      const [color, piece, from] = (event.active.id as string).split("-");
      if (event.over) {
        socket.emit("dragEnd", { from, to: event.over.id });
        console.log("emitting dragEnd", { from, to: event.over.id });
      }
      Actions.setActivePiece(null);
    },
    [Actions]
  );

  const handleDragCancel = useCallback(
    (event: DragCancelEvent) => {
      socket.emit("dragCancel", event.active);
      console.log("emitting dragCancel", event.active);
      Actions.setActivePiece(null);
    },
    [Actions]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div key={State.ascii} className="board">
        {State.board.flat().map((piece, index) => {
          const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][index % 8];
          const fileNum = ((index - (index % 8)) % 9) - 1;
          const file = fileNum < 0 ? 8 : fileNum;

          const name = `${rank}${file}`;

          return (
            <Square
              key={name}
              name={name}
              canMoveHere={
                !State.activePiece
                  ? !!State.moves?.find((move) => name === move.to)
                  : false
              }
              pieceCanMoveHere={
                State.activePiece
                  ? !!State.moves?.find((move) => name === move.to)
                  : false
              }
            >
              {piece ? (
                <BasePiece
                  type={piece.type as PieceType}
                  color={piece.color as PieceColor}
                  canMove={
                    !!State.moves?.find(
                      (move) =>
                        move.piece === piece.type && move.color === piece.color
                    )
                  }
                />
              ) : null}
            </Square>
          );
        })}
      </div>
    </DndContext>
  );
};

export const ChessBoard = ({
  onConnectionChange,
}: {
  onConnectionChange: (isConnected: boolean) => void;
}) => (
  <div>
    <ChessBoardContextProvider>
      <ChessBoardInner onConnectionChange={onConnectionChange} />
    </ChessBoardContextProvider>
  </div>
);
