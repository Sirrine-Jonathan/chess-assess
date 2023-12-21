import type { PropsWithChildren, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess.js";
import React, { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import { Sweat } from "../pieces/svg";
import { useSelection } from "../state/selection/useSelection";
import { botDelay } from "../state/game/useGame";

interface SquareProps {
  name: string;
  flip: boolean;
  playerDefending: boolean;
  possibleDestination: boolean;
  enemyDefending: boolean;
  partOfLastMove: boolean;
  isAttacked: boolean;
}

export const ChessSquare = ({
  name,
  flip,
  playerDefending,
  possibleDestination,
  enemyDefending,
  partOfLastMove,
  isAttacked,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { gameState, Actions } = useGame();
  const { selectionActions } = useSelection();
  const { selectionState } = useSelection();
  const { Options } = useOptions();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const nothingSquare =
    !possibleDestination &&
    (!playerDefending || !Options.showDefenseLayer) &&
    (!enemyDefending || !Options.showEnemyDefenseLayer);

  const pieceOnThisSquare = gameState.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare &&
    pieceOnThisSquare?.square === selectionState.activePiece?.from;

  const getLayer = () => {
    const triangles = [
      <span key="top" className="layer topLayer" />,
      <span key="right" className="layer rightLayer" />,
      <span key="bottom" className="layer bottomLayer" />,
      <span key="left" className="layer leftLayer" />,
    ];
    const layers: ReactNode[] = [...triangles];

    // this can be applied along with any other layer
    if (isAttacked) {
      layers.push(
        <span key="isAttacked" className="layer isAttacked">
          <Sweat />
        </span>
      );
    }

    if (partOfLastMove) {
      layers.push(<span className="layer partOfLastMove">{triangles}</span>);
    }

    if (possibleDestination) {
      layers.push(<span className="layer moveLayer">{triangles}</span>);
      return layers;
    } else if (Options.showDefenseLayer && playerDefending) {
      layers.push(
        <span
          key="defense"
          className={clsx([
            "layer",
            Options.showEnemyDefenseLayer && enemyDefending
              ? "disputedLayer"
              : "defenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    } else if (Options.showEnemyDefenseLayer && enemyDefending) {
      layers.push(
        <span
          key="disputed"
          className={clsx([
            "layer",
            Options.showDefenseLayer && playerDefending
              ? "disputedLayer"
              : "enemyDefenseLayer",
          ])}
        >
          {triangles}
        </span>
      );
    }

    return layers;
  };

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
      onClick={() => {
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
      }}
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
      {getLayer()}
      {Options.showSquareName ? (
        <span ref={nameRef} className="squareName">
          {name}
        </span>
      ) : null}
      {children}
    </div>
  );
};
