import type {
  ShowPosition,
  Position,
  ChessPiece,
  CaptureEvent,
  Update,
} from "./chessTypes";
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
import BottomDrawer from "./BottomDrawer";
import useWindowDimensions from "./hooks/useWindowDimensions";
import Piece from "./pieces/Piece";

import History from "./parts/history";
import GameOver from "./parts/gameOver";
import MobileControls from "./parts/mobileControls";

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "ws://localhost:1337/chess"
    : "/chess";

export const socket = io(SERVER_URL, {
  autoConnect: false,
});

export const ChessBoardInner = () => {
  const { Options } = useOptions();
  const { Actions, State } = useChessBoardContext();
  const isMobile = useWindowDimensions().width <= 768;

  const displayWrapperRef = useRef<HTMLDivElement>(null);
  const chessBoardWrapperRef = useRef<HTMLDivElement>(null);

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
      Actions.setPositions({
        position: update.position,
        enemyPosition: update.enemyPosition,
      });
      Actions.setActivePiece(null);
      Actions.setState({
        turn: update.turn,
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

    function onShowPosition(showPosition: ShowPosition) {
      Actions.setPositions(showPosition);
    }

    function onShowMoves(position: Position) {
      console.log("onShowMoves", position);
      Actions.setMoves(position);
    }

    function onCapture(event: CaptureEvent) {
      Actions.setColorCaptured(event);
    }

    function onFenLoad(details: {
      blackCaptured: PieceType[];
      whiteCaptured: PieceType[];
    }) {
      Actions.setLoadDetails(details);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update", onUpdate);
    socket.on("showPosition", onShowPosition);
    socket.on("capture", onCapture);
    socket.on("loadSuccess", onFenLoad);
    socket.on("showMoves", onShowMoves);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update", onUpdate);
      socket.off("showPosition", onShowPosition);
      socket.off("capture", onCapture);
      socket.off("loadSuccess", onFenLoad);
      socket.off("showMoves", onShowMoves);
    };
  });

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const [color, piece, from] = (event.active.id as string).split("-");
      Actions.setActivePiece({ color, piece, from } as ChessPiece);
      socket.emit("moving", from);
    },
    [Actions]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      const parts = (event.active.id as string).split("-");
      const from = parts[2];
      if (event.over) {
        Actions.move({ from: from as Sq, to: event.over.id as Sq });
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
        className={clsx([
          "displayWrapper",
          !State.isConnected && "loading",
          isMobile && "isMobile",
        ])}
      >
        {State.isConnected ? (
          <>
            <div
              ref={chessBoardWrapperRef}
              className="chessBoardWrapper"
              onClick={(e) => {
                if (e.target === chessBoardWrapperRef.current) {
                  Actions.setActivePiece(null);
                }
              }}
            >
              <>
                {isMobile ? <MobileControls /> : null}
                <div className="outerBoardContainer">
                  {isMobile ? (
                    <div className="captureArea enemyCapturedPieces">
                      {State.whiteCaptured.map((piece) => (
                        <Piece color={"w" as PieceColor} type={piece} />
                      ))}
                    </div>
                  ) : null}
                  <div className="innerBoardContainer">
                    <GameOver />
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

                        if (name === "e2") {
                          console.log("piecePosition", {
                            active: State.activePiece,
                            position: State.piecePosition,
                            moves: State.piecePosition.moves,
                            defending: State.piecePosition.defending,
                          });
                        }

                        const canMove = !!State.piecePosition.moves?.find(
                          (move) => {
                            return name === move.from;
                          }
                        );
                        const enemyDefending = !State.activePiece
                          ? !!State.enemyPosition.defending?.find(
                              (move) => name === move.to
                            )
                          : false;
                        const playerDefending =
                          !!State.position.defending?.find(
                            (move) => name === move.to
                          );
                        const possibleMove = State.activePiece
                          ? !!State.piecePosition.moves?.find(
                              (move) => name === move.to
                            )
                          : false;
                        if (name === "e3") {
                          console.log("canMove e3 final", {
                            playerPosition: State.position,
                            enemyPosition: State.enemyPosition,
                          });
                        }
                        return (
                          <Square
                            key={name}
                            name={name}
                            enemyDefending={enemyDefending}
                            playerDefending={playerDefending}
                            possibleMove={possibleMove}
                          >
                            {piece ? (
                              <BasePiece
                                type={piece.type as PieceType}
                                color={piece.color as PieceColor}
                                canMove={canMove}
                              />
                            ) : null}
                          </Square>
                        );
                      })}
                    </div>
                  </div>
                  {isMobile ? (
                    <div className="captureArea capturedPieces">
                      {State.blackCaptured.map((piece) => (
                        <Piece color={"b" as PieceColor} type={piece} />
                      ))}
                    </div>
                  ) : null}
                  {isMobile ? <History /> : null}
                </div>
              </>
            </div>
            {isMobile ? <BottomDrawer /> : <Sidebar />}
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
