import type { PropsWithChildren, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess.js";
import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useChessBoardContext } from "./gameContext";
import { useOptions } from "./optionsContext";
import { Sweat } from "./pieces/svg";

interface SquareProps {
  name: string;
  playerDefending: boolean;
  possibleDestination: boolean;
  enemyDefending: boolean;
  partOfLastMove: boolean;
  isAttacked: boolean;
}

export const ChessSquare = ({
  name,
  playerDefending,
  possibleDestination,
  enemyDefending,
  partOfLastMove,
  isAttacked,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { State, Actions } = useChessBoardContext();
  const { Options } = useOptions();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const pieceOnThisSquare = State.game.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare && pieceOnThisSquare?.square === State.activePiece?.from;

  const getLayers = () => {
    const layers: ReactNode[] = [];

    if (possibleDestination) {
      layers.push(<span className="layer moveLayer" />);
    }

    if (Options.showDefenseLayer && playerDefending) {
      layers.push(
        <span
          className={clsx([
            "layer",
            Options.showEnemyDefenseLayer && enemyDefending
              ? "disputedLayer"
              : "defenseLayer",
          ])}
        />
      );
    }

    if (Options.showEnemyDefenseLayer && enemyDefending) {
      layers.push(
        <span
          className={clsx([
            "layer",
            Options.showDefenseLayer && playerDefending
              ? "disputedLayer"
              : "enemyDefenseLayer",
          ])}
        />
      );
    }

    if (isAttacked) {
      layers.push(
        <span className="layer isAttacked">
          <Sweat />
        </span>
      );
    }
    return layers;
  };

  return (
    <div
      id={name}
      ref={possibleDestination ? setNodeRef : null}
      className={clsx([
        "square",
        playerDefending && "playerDefendingd",
        possibleDestination && "possibleDestination",
        enemyDefending && "enemyDefending",
        partOfLastMove && "partOfLastMove",
        isAttacked && "isAttacked",
        isOver && "isOver",
        isActive && "isActive",
      ])}
      style={{ ...(possibleDestination ? { cursor: "pointer" } : {}) }}
      tabIndex={0}
      onClick={() => {
        const piece = State.game.board
          .flat()
          .find((cell) => cell?.square === name);
        if (piece && piece.color === State.game.turn) {
          Actions.setActivePiece({
            color: piece.color as Color,
            piece: piece.type as PieceSymbol,
            from: name as Square,
          });
        } else if (
          State.activePiece &&
          (possibleDestination || playerDefending)
        ) {
          Actions.move({ from: State.activePiece.from, to: name as Square });
        }
      }}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          const piece = State.game.board
            .flat()
            .find((cell) => cell?.square === name);
          if (piece && piece.color === State.game.turn) {
            Actions.setActivePiece({
              color: piece.color as Color,
              piece: piece.type as PieceSymbol,
              from: name as Square,
            });
          } else if (
            State.activePiece &&
            (possibleDestination || playerDefending)
          ) {
            Actions.move({ from: State.activePiece.from, to: name as Square });
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

            let id;
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
