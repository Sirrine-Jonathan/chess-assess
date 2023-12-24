import { type Square, type Color, type PieceSymbol } from "chess.js";
import { useRef, useEffect } from "react";
import React, { useCallback } from "react";
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
import { ChessSquare } from "./parts/square";
import Sidebar from "./parts/sidebar";
import { useGame } from "./state/game/useGame";
import { GameProvider } from "./state/game/useGame";
import { OptionsProvider } from "./state/options/provider";
import { useOptions } from "./state/options/useOptions";
import clsx from "clsx";
import BottomDrawer from "./parts/bottomDrawer";
import GameOver from "./parts/gameOver";
import MobileControls from "./parts/mobileControls";
import { DisplayWrapper } from "./parts/displayWrapper";
import { useIsMobile } from "../hooks/useIsMobile";
import "./chessBoard.scss";

import {
  getGameType,
  getFen,
  getLevel,
  getColor,
  GameType,
  initType,
} from "./../utils";
import { SelectionProvider } from "./state/selection/provider";
import { WhiteCaptured, BlackCaptured } from "./parts/captured";
import { useSelection } from "./state/selection/useSelection";
import { botDelay } from "./state/game/useGame";

export const ChessBoardInner = ({ loading }: { loading: boolean }) => {
  const { Options } = useOptions();
  const { Actions, gameState } = useGame();
  const { selectionState, selectionActions } = useSelection();
  const isMobile = useIsMobile();

  const chessBoardWrapperRef = useRef<HTMLDivElement>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 15 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 15 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback(
    function handleDragStart(event: DragStartEvent) {
      const [color, piece, from] = (event.active.id as string).split("-");
      selectionActions.setActivePiece({ color, piece, from } as ChessPiece);
    },
    [Actions]
  );

  const handleDragEnd = useCallback(
    function handleDragEnd(event: DragEndEvent) {
      const parts = (event.active.id as string).split("-");
      const from = parts[2];
      if (event.over) {
        const move = {
          from: from as Square,
          to: event.over.id as Square,
        };
        const captured = Actions.move(move);
        if (captured) {
          Actions.setColorCaptured({
            color: captured.color as Color,
            piece: captured.piece,
            type: captured.type as "en-passant" | "capture",
          });
        }
        Actions.performUpdate();
        Actions.setLastMove(move);
        selectionActions.setActivePiece(null);
      }
    },
    [Actions]
  );

  useEffect(() => {
    Actions.performUpdate();
  }, []);

  const computerIsMoving = useRef<boolean>(false);
  const timeoutHandle = useRef<ReturnType<typeof window.setTimeout>>();
  useEffect(() => {
    if (
      gameState.turn !== gameState.playerColor &&
      computerIsMoving.current === false
    ) {
      console.log("bot move");
      clearTimeout(timeoutHandle.current);
      timeoutHandle.current = setTimeout(async () => {
        const result = await Actions.computerMove();
        if (result) {
          if (result.captured) {
            Actions.setColorCaptured({
              color: result.captured.color as Color,
              piece: result.captured.piece,
              type: result.captured.type as CaptureEvent["type"],
            });
          }
          Actions.setLastMove(result.move);
          selectionActions.setActivePiece(null);
        }
        Actions.performUpdate();
      }, botDelay);
      computerIsMoving.current = true;
    } else {
      console.log("player move");
      computerIsMoving.current = false;
    }
  }, [gameState.turn]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DisplayWrapper loading={loading}>
        <>
          <div
            ref={chessBoardWrapperRef}
            className="chessBoardWrapper"
            onClick={(e) => {
              if (e.target === chessBoardWrapperRef.current) {
                selectionActions.setActivePiece(null);
                Actions.setActiveMoves([]);
              }
            }}
          >
            <>
              {isMobile ? <MobileControls /> : null}
              <div className="outerBoardContainer">
                {(
                  gameState.playerColor === "w"
                    ? Options.flipBoard
                    : !Options.flipBoard
                ) ? (
                  <BlackCaptured isTop={true} />
                ) : (
                  <WhiteCaptured isTop={true} />
                )}
                <div className="innerBoardContainer">
                  <GameOver />
                  <div
                    key={gameState.ascii}
                    className={clsx([
                      "board",
                      gameState.isGameOver && "blur",
                      (gameState.playerColor === "w"
                        ? Options.flipBoard
                        : !Options.flipBoard) && "flip",
                    ])}
                    onKeyDown={(e) => {
                      if (e.code === "Escape") {
                        selectionActions.setActivePiece(null);
                        Actions.setActiveMoves([]);
                      }
                    }}
                  >
                    {gameState.board.flat().map((piece, index) => {
                      const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][
                        index % 8
                      ];
                      const fileNum = ((index - (index % 8)) % 9) - 1;
                      const file = fileNum < 0 ? 8 : fileNum;

                      const name = `${rank}${file}`;

                      const pieceCanMove = !!gameState.moves?.find((move) => {
                        return name === move.from;
                      });

                      const partOfLastMove =
                        gameState.lastMove !== null &&
                        (name === gameState.lastMove.to ||
                          name === gameState.lastMove.from);

                      const possibleDestination = selectionState.activePiece
                        ? !!gameState.activeMoves?.find(
                            (move) => name === move.to
                          )
                        : false;

                      return (
                        <ChessSquare
                          key={name}
                          name={name as Square}
                          flip={
                            gameState.playerColor === "w"
                              ? Options.flipBoard
                              : !Options.flipBoard
                          }
                          enemyDefending={
                            !!(
                              gameState.conflict &&
                              gameState.conflict[name as Square].black
                            )
                          }
                          playerDefending={
                            !!(
                              gameState.conflict &&
                              gameState.conflict[name as Square].white
                            )
                          }
                          isAttacked={
                            !!(
                              piece &&
                              ((gameState.conflict &&
                                gameState.conflict[name as Square].white &&
                                piece.color !== "w") ||
                                (gameState.conflict &&
                                  gameState.conflict[name as Square].black &&
                                  piece.color !== "b"))
                            )
                          }
                          partOfLastMove={partOfLastMove}
                          possibleDestination={possibleDestination}
                          pieceColor={piece ? piece.color : null}
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
                {(
                  gameState.playerColor === "w"
                    ? Options.flipBoard
                    : !Options.flipBoard
                ) ? (
                  <WhiteCaptured />
                ) : (
                  <BlackCaptured />
                )}
              </div>
            </>
          </div>
          {isMobile ? <BottomDrawer /> : <Sidebar />}
        </>
      </DisplayWrapper>
    </DndContext>
  );
};

export const ChessBoard = () => {
  initType();
  const type = getGameType();
  const color = getColor();
  const level = type === GameType.Trainer ? -1 : getLevel();
  const fen = getFen();
  return (
    <OptionsProvider>
      <SelectionProvider>
        <GameProvider fen={fen} color={color} type={type} level={level}>
          <ChessBoardInner loading={false} />
        </GameProvider>
      </SelectionProvider>
    </OptionsProvider>
  );
};
