import type { Update, ShowMoves, Piece } from "./chessTypes";
import { useEffect } from "react";
import { PieceColor, PieceType, Sq } from "./chessTypes";
import { useCallback } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { BasePiece } from "./pieces/BasePiece";
import { Square } from "./Square";
import { useChessBoardContext, ChessBoardContextProvider } from "./context";
import "./chessBoard.scss";
import io from "socket.io-client";

export const socket = io("ws://localhost:4000/chess", {
  autoConnect: false,
});

export const ChessBoardInner = ({
  onConnectionChange,
}: {
  onConnectionChange: (isConnected: boolean) => void;
}) => {
  const { Actions, State } = useChessBoardContext();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 15 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

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
      Actions.setActivePiece(null);

      window.history.replaceState(
        null,
        "",
        window.location.origin + "/" + encodeURIComponent(update.fen)
      );
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
      socket.emit("moving", from);
      console.log("emitting moving", from);
    },
    [Actions]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      const [color, piece, from] = (event.active.id as string).split("-");
      if (event.over) {
        Actions.move({ from: from as Sq, to: event.over.id as Sq });
        console.log("emitting move", { from, to: event.over.id });
      }
    },
    [Actions]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div id="boardContainer">
        <div
          key={State.ascii}
          className="board"
          onKeyDown={(e) => {
            if (e.code === "Escape") {
              Actions.setActivePiece(null);
            }
          }}
        >
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
                          move.piece === piece.type &&
                          move.color === piece.color
                      )
                    }
                  />
                ) : null}
              </Square>
            );
          })}
        </div>
        <div id="information">
          <div>Status: {State.isConnected ? "Connected" : "Connecting..."}</div>
          <div>Turn: {State.turn === "w" ? "White" : "Black"}</div>
        </div>
      </div>
    </DndContext>
  );
};

export const ChessBoard = ({
  onConnectionChange,
}: {
  onConnectionChange: (isConnected: boolean) => void;
}) => {
  const url = new URL(window.location.href);
  const fen = decodeURIComponent(url.pathname.split("/")[1]);
  return (
    <div>
      <ChessBoardContextProvider fen={fen}>
        <ChessBoardInner onConnectionChange={onConnectionChange} />
      </ChessBoardContextProvider>
    </div>
  );
};
