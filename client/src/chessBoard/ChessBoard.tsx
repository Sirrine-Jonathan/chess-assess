import {
  type Square,
  type Color,
  type PieceSymbol,
  DEFAULT_POSITION,
} from "chess.js";
import { useRef, useEffect } from "react";
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
import { ChessSquare } from "./parts/square";
import Sidebar from "./parts/sidebar";
import { useGame } from "./state/game/useGame";
import { GameProvider } from "./state/game/useGame";
import { OptionsProvider } from "./state/options/provider";
import { useOptions } from "./state/options/useOptions";
import clsx from "clsx";
import BottomDrawer from "./parts/bottomDrawer";
import History from "./parts/history";
import GameOver from "./parts/gameOver";
import MobileControls from "./parts/mobileControls";
import { DisplayWrapper } from "./parts/displayWrapper";
import { useIsMobile } from "../hooks/useIsMobile";
import "./chessBoard.scss";
import { SocketProvider } from "./state/socket/provider";
import { useSocket } from "./state/socket/useSocket";
import { getRoom } from "./state/socket/connect";
import { SelectionProvider } from "./state/selection/provider";
import { WhiteCaptured, BlackCaptured } from "./parts/captured";
import { useSelection } from "./state/selection/useSelection";

export const ChessBoardInner = ({ loading }) => {
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
            type: captured.type as CaptureEvent["type"],
          });
        }
        Actions.performUpdate();
        Actions.setLastMove(move);
        selectionActions.setActivePiece(null);
        setTimeout(() => {
          if (gameState.isComputerGame) {
            const result = Actions.computerMove();
            if (result) {
              const { captured, move } = result;
              if (captured) {
                Actions.setColorCaptured({
                  color: captured.color as Color,
                  piece: captured.piece,
                  type: captured.type as CaptureEvent["type"],
                });
              }
              Actions.setLastMove(move);
              selectionActions.setActivePiece(null);
            }
            Actions.performUpdate();
          }
        }, gameState.botDelay);
      }
    },
    [Actions]
  );

  useEffect(() => {
    Actions.performUpdate();
  }, []);

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
              {/*<pre>{gameState.ascii}</pre>*/}
              <div className="outerBoardContainer">
                {isMobile ? <WhiteCaptured /> : null}
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
                          name={name}
                          flip={
                            gameState.playerColor === "w"
                              ? Options.flipBoard
                              : !Options.flipBoard
                          }
                          enemyDefending={gameState.conflict[name].black}
                          playerDefending={gameState.conflict[name].white}
                          isAttacked={
                            piece &&
                            ((gameState.conflict[name].white &&
                              piece.color !== "w") ||
                              (gameState.conflict[name].black &&
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
                {isMobile ? <BlackCaptured /> : null}
                {isMobile ? <History /> : null}
              </div>
            </>
          </div>
          {isMobile ? <BottomDrawer /> : <Sidebar />}
        </>
      </DisplayWrapper>
    </DndContext>
  );
};

const ChessBoardComputer = () => {
  const url = new URL(window.location.href);
  const fen = decodeURIComponent(
    url.pathname.split("/")?.[2] || DEFAULT_POSITION
  );

  console.log("load", { fen, url, split: url.pathname.split("/") });

  return (
    <GameProvider
      fen={fen || DEFAULT_POSITION}
      role={"white"}
      isComputerGame={true}
    >
      <ChessBoardInner loading={false} />
    </GameProvider>
  );
};

const ChessBoardRoom = () => {
  const url = new URL(window.location.href);
  const fen = decodeURIComponent(
    url.pathname.split("/")?.[2] || DEFAULT_POSITION
  );

  console.log("load", { fen, url, split: url.pathname.split("/") });

  const { isConnected, role } = useSocket();

  return (
    <GameProvider fen={fen} role={role} isComputerGame={false}>
      <ChessBoardInner loading={isConnected} />
    </GameProvider>
  );
};

export const ChessBoard = () => {
  const room = getRoom();

  if (room) {
    <SocketProvider>
      <OptionsProvider>
        <SelectionProvider>
          <ChessBoardRoom />
        </SelectionProvider>
      </OptionsProvider>
    </SocketProvider>;
  }

  return (
    <OptionsProvider>
      <SelectionProvider>
        <ChessBoardComputer />
      </SelectionProvider>
    </OptionsProvider>
  );
};
