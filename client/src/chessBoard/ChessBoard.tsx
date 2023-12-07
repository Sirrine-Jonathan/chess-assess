import type { Square, Color, PieceSymbol } from "chess.js";
import { useEffect, useRef } from "react";
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
import { ChessSquare } from "./Square";
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

    function onUpdate(update: GameUpdate) {
      Actions.performUpdate(update);

      window.history.replaceState(
        null,
        "",
        window.location.origin + "/" + encodeURIComponent(update.fen)
      );
    }

    function onCapture(event: CaptureEvent) {
      Actions.setColorCaptured(event);
    }

    function onLoadSuccess(details: {
      blackCaptured: PieceSymbol[];
      whiteCaptured: PieceSymbol[];
    }) {
      Actions.setLoadDetails(details);
    }

    function onShowActiveMoves(moves: Move[]) {
      Actions.setActiveMoves(moves);
    }

    function onMoveEnded(move: Move) {
      Actions.setActivePiece(null);
      Actions.setActiveMoves([]);
      Actions.setLastMove(move);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update", onUpdate);
    socket.on("capture", onCapture);
    socket.on("loadSuccess", onLoadSuccess);
    socket.on("showActiveMoves", onShowActiveMoves);
    socket.on("moveEnded", onMoveEnded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update", onUpdate);
      socket.off("capture", onCapture);
      socket.off("loadSuccess", onLoadSuccess);
      socket.off("showActiveMoves", onShowActiveMoves);
      socket.off("moveEnded", onMoveEnded);
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
        Actions.move({ from: from as Square, to: event.over.id as Square });
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
                  Actions.setActiveMoves([]);
                }
              }}
            >
              <>
                {isMobile ? <MobileControls /> : null}
                <div className="outerBoardContainer">
                  {isMobile ? (
                    <div className="captureArea enemyCapturedPieces">
                      {State.whiteCaptured.map((piece) => (
                        <Piece color={"w" as Color} type={piece} />
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
                      key={State.game.ascii}
                      className={clsx([
                        "board",
                        State.game.isGameOver && "blur",
                      ])}
                      onKeyDown={(e) => {
                        if (e.code === "Escape") {
                          Actions.setActivePiece(null);
                          Actions.setActiveMoves([]);
                        }
                      }}
                    >
                      {State.game.board.flat().map((piece, index) => {
                        const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][
                          index % 8
                        ];
                        const fileNum = ((index - (index % 8)) % 9) - 1;
                        const file = fileNum < 0 ? 8 : fileNum;

                        const name = `${rank}${file}`;

                        const pieceCanMove = !!State.game.moves?.find(
                          (move) => {
                            return name === move.from;
                          }
                        );

                        const partOfLastMove =
                          State.lastMove !== null &&
                          (name === State.lastMove.to ||
                            name === State.lastMove.from);

                        const possibleDestination = State.activePiece
                          ? !!State.activeMoves?.find(
                              (move) => name === move.to
                            )
                          : false;

                        return (
                          <ChessSquare
                            key={name}
                            name={name}
                            enemyDefending={State.game.conflict[name].black}
                            playerDefending={State.game.conflict[name].white}
                            isAttacked={
                              piece &&
                              ((State.game.conflict[name].white &&
                                piece.color !== "w") ||
                                (State.game.conflict[name].black &&
                                  piece.color !== "b"))
                            }
                            partOfLastMove={partOfLastMove}
                            possibleDestination={possibleDestination}
                          >
                            {piece ? (
                              <BasePiece
                                type={piece.type as PieceSymbol}
                                color={piece.color as Color}
                                pieceCanMove={pieceCanMove}
                              />
                            ) : null}
                          </ChessSquare>
                        );
                      })}
                    </div>
                  </div>
                  {isMobile ? (
                    <div className="captureArea capturedPieces">
                      {State.blackCaptured.map((piece) => (
                        <Piece color={"b" as Color} type={piece} />
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
