import type { PropsWithChildren, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess.js";
import React, { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import { Sweat, Lock } from "../pieces/svg";
import { useSelection } from "../state/selection/useSelection";
import { useLongPress } from "../../hooks/useLongPress";

interface SquareProps {
  name: Square;
  flip: boolean;
  playerDefending: boolean;
  possibleDestination: boolean;
  enemyDefending: boolean;
  partOfLastMove: boolean;
  isAttacked: boolean;
  pieceColor: Color | null;
}

export const ChessSquare = ({
  name,
  flip,
  playerDefending,
  possibleDestination,
  enemyDefending,
  partOfLastMove,
  isAttacked,
  pieceColor,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { gameState, Actions } = useGame();
  const { selectionState, selectionActions } = useSelection();
  const { Options } = useOptions();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const pieceName = gameState.pieceMap[name as keyof typeof gameState.pieceMap];

  const isLockedShow =
    pieceName && selectionState.lockedShowPieces.includes(pieceName);
  const isLockedHide =
    pieceName && selectionState.lockedHidePieces.includes(pieceName);
  if (pieceName == "e2") {
    console.log(pieceName, isLockedShow, isLockedHide);
    console.log(selectionState.lockedShowPieces);
  }

  const showDefenseLayer =
    ((!isLockedHide && Options.showDefenseLayer) || isLockedShow) &&
    playerDefending;
  const showEnemyDefenseLayer =
    ((!isLockedHide && Options.showEnemyDefenseLayer) || isLockedShow) &&
    enemyDefending;

  const nothingSquare =
    !possibleDestination && !showDefenseLayer && !showEnemyDefenseLayer;

  const pieceOnThisSquare = gameState.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare &&
    pieceOnThisSquare?.square === selectionState.activePiece?.from;

  const getLayers = () => {
    const triangles = [
      <span key="top" className="layer topLayer" />,
      <span key="right" className="layer rightLayer" />,
      <span key="bottom" className="layer bottomLayer" />,
      <span key="left" className="layer leftLayer" />,
    ];
    const layers: ReactNode[] = [...triangles];

    if (isAttacked) {
      layers.push(
        <span key="isAttacked" className="layer isAttacked">
          <Sweat />
        </span>
      );
    }

    if (isLockedShow || isLockedHide) {
      layers.push(
        <span key="locked" className="layer lockedLayer">
          <Lock />
        </span>
      );
    }

    if (possibleDestination) {
      layers.push(
        <span key="moveLayer" className="layer moveLayer">
          {triangles}
        </span>
      );
      return layers;
    }

    if (partOfLastMove) {
      layers.push(<span className="layer partOfLastMove">{triangles}</span>);
      return layers;
    }

    if (showDefenseLayer) {
      layers.push(
        <span
          key="defense"
          className={clsx([
            "layer",
            showEnemyDefenseLayer ? "disputedLayer" : "defenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    } else if (showEnemyDefenseLayer) {
      layers.push(
        <span
          key="disputed"
          className={clsx([
            "layer",
            showDefenseLayer ? "disputedLayer" : "enemyDefenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    }

    return layers;
  };

  const onLongPress = () => {
    console.log("long press");
    if (!pieceName) {
      console.log("no piece name");
      return;
    }
    if (isLockedHide || isLockedShow) {
      console.log(pieceName, "is locked");
      selectionActions.unlockHide(name);
      selectionActions.unlockShow(name);
    } else {
      console.log("locking", pieceName, pieceColor);
      if (pieceColor === "b") {
        if (Options.showEnemyDefenseLayer) {
          selectionActions.lockShow(name);
        } else {
          selectionActions.lockHide(name);
        }
      } else if (pieceColor === "w") {
        console.log(pieceName, "is white");
        if (Options.showDefenseLayer) {
          console.log("showing defense");
          selectionActions.lockShow(name);
        } else {
          console.log("hiding defense");
          selectionActions.lockHide(name);
        }
      }
    }
  };

  const onClick = () => {
    const piece = gameState.board.flat().find((cell) => cell?.square === name);
    if (piece && piece.color === gameState.turn) {
      selectionActions.setActivePiece({
        color: piece.color as Color,
        piece: piece.type as PieceSymbol,
        from: name as Square,
      });
    } else if (
      selectionState.activePiece &&
      (possibleDestination || playerDefending)
    ) {
      const move = {
        from: selectionState.activePiece.from,
        to: name as Square,
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
    }
  };

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  return (
    <div
      key={name}
      id={name}
      ref={possibleDestination ? setNodeRef : null}
      className={clsx([
        "square",
        flip && "flip",
        playerDefending && "playerDefending",
        possibleDestination && "possibleDestination",
        enemyDefending && "enemyDefending",
        partOfLastMove && "partOfLastMove",
        isAttacked && "isAttacked",
        isOver && "isOver",
        isActive && "isActive",
        nothingSquare && "nothingSquare",
      ])}
      style={{ ...(possibleDestination ? { cursor: "pointer" } : {}) }}
      tabIndex={0}
      {...longPressEvent}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          const piece = gameState.board
            .flat()
            .find((cell) => cell?.square === name);
          if (piece && piece.color === gameState.turn) {
            selectionActions.setActivePiece({
              color: piece.color as Color,
              piece: piece.type as PieceSymbol,
              from: name as Square,
            });
          } else if (
            selectionState.activePiece &&
            (possibleDestination || playerDefending)
          ) {
            const move = {
              from: selectionState.activePiece.from,
              to: name as Square,
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
          }
        } else {
          const parent = nameRef.current?.closest(".board");
          if (parent) {
            const child = parent?.querySelector(`#${name}`);
            const children = parent.children;
            const index = Array.prototype.indexOf.call(children, child);
            const adjacentRight = children?.[index + 1];
            const adjacentLeft = children?.[index - 1];
            const adjacentUp = children?.[index - 8];
            const adjacentDown = children?.[index + 8];

            let id = "";
            if (e.code === "ArrowRight") {
              id = adjacentRight?.id;
            } else if (e.code === "ArrowLeft") {
              id = adjacentLeft?.id;
            } else if (e.code === "ArrowUp") {
              id = adjacentUp?.id;
            } else if (e.code === "ArrowDown") {
              id = adjacentDown?.id;
            }
            if (id) {
              const el = document.querySelector(`#${id}`);
              if (el) {
                (el as HTMLDivElement).focus();
              }
            }
          }
        }
      }}
    >
      <span className="pieceName">{pieceName || "NA"}</span>
      {getLayers()}
      {Options.showSquareName ? (
        <span ref={nameRef} className="squareName">
          {name}
        </span>
      ) : null}
      {children}
    </div>
  );
};
