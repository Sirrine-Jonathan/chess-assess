import type { Update, ShowMoves, Piece } from "./chessTypes";
import { useEffect, useRef } from "react";
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
import Sidebar from "./Sidebar";
import { useChessBoardContext, ChessBoardContextProvider } from "./gameContext";
import { OptionsContextProvider, useOptions } from "./optionsContext";
import "./chessBoard.scss";
import io from "socket.io-client";
import clsx from "clsx";

const SERVER_PORT = process.env.NODE_ENV === "production" ? 3000 : 4000;

export const socket = io(`ws://localhost:${SERVER_PORT}/chess`, {
  autoConnect: false,
});

export const ChessBoardInner = () => {
  const { Options } = useOptions();
  const { Actions, State } = useChessBoardContext();

  const displayWrapperRef = useRef<HTMLDivElement>(null);

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
      Actions.setMoves({ moves: update.moves, enemyMoves: update.enemyMoves });
      Actions.setActivePiece(null);
      Actions.setState({
        inCheck: update.inCheck,
        isCheckmate: update.isCheckmate,
        isDraw: update.isDraw,
        isInsufficientMaterial: update.isInsufficientMaterial,
        isGameOver: update.isGameOver,
        isStalemate: update.isStalemate,
        isThreefoldRepetition: update.isThreefoldRepetition,
      });
      Actions.setHistory(update.history);

      window.history.replaceState(
        null,
        "",
        window.location.origin + "/" + encodeURIComponent(update.fen)
      );
    }

    function onShowMoves(showMoves: ShowMoves) {
      console.log("checkMoves", showMoves);
      Actions.setMoves(showMoves);
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

  useEffect(() => {
    if (displayWrapperRef.current) {
      const styleString = Object.entries({
        "--primary-color": Options.primaryColor,
        "--secondary-color": Options.secondaryColor,
        "--accent-color": Options.accentColor,
        "--defense-color": Options.defenseLayerColor,
        "--enemy-defense-color": Options.enemyDefenseLayerColor,
        "--disputed-color": Options.disputedTerritoryLayerColor,
      }).reduce((acc: string, [key, val]: string[]) => {
        return acc + `${key}: ${val};`;
      }, "");
      displayWrapperRef.current.setAttribute("style", styleString);
    }
  }, [displayWrapperRef, Options]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={displayWrapperRef}
        className={clsx(["displayWrapper", !State.isConnected && "loading"])}
      >
        {State.isConnected ? (
          <>
            <div className="chessBoardWrapper">
              <>
                <div className="outerBoardContainer">
                  <div className="innerBoardContainer">
                    {Options.showAxisLabels ? (
                      <div className="rankRuler">
                        {[8, 7, 6, 5, 4, 3, 2, 1].map((number) => (
                          <div className="gridLabel rankLabel">{number}</div>
                        ))}
                      </div>
                    ) : null}
                    {Options.showAxisLabels ? (
                      <div className="fileRuler">
                        {["a", "b", "c", "d", "e", "f", "g", "h"].map(
                          (letter) => (
                            <div className="gridLabel fileLabel">{letter}</div>
                          )
                        )}
                      </div>
                    ) : null}
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
                        const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][
                          index % 8
                        ];
                        const fileNum = ((index - (index % 8)) % 9) - 1;
                        const file = fileNum < 0 ? 8 : fileNum;

                        const name = `${rank}${file}`;

                        return (
                          <Square
                            key={name}
                            name={name}
                            enemyDefending={
                              !State.activePiece
                                ? !!State.enemyMoves?.find(
                                    (move) => name === move.to
                                  )
                                : false
                            }
                            canMoveHere={
                              !State.activePiece
                                ? !!State.moves?.find(
                                    (move) => name === move.to
                                  )
                                : false
                            }
                            pieceCanMoveHere={
                              State.activePiece
                                ? !!State.moves?.find(
                                    (move) => name === move.to
                                  )
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
                  </div>
                </div>
              </>
            </div>
            <Sidebar />
          </>
        ) : (
          <div className="loadingSpinner">
            <div />
          </div>
        )}
      </div>
    </DndContext>
  );
};

export const ChessBoard = () => {
  const url = new URL(window.location.href);
  const fen = decodeURIComponent(url.pathname.split("/")[1]);
  return (
    <div>
      <OptionsContextProvider>
        <ChessBoardContextProvider fen={fen}>
          <ChessBoardInner />
        </ChessBoardContextProvider>
      </OptionsContextProvider>
    </div>
  );
};
