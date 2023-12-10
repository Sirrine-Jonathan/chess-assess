import type { PropsWithChildren, ReactNode } from "react";
import type { Square, Color, PieceSymbol } from "chess-layers.js";
import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useChessBoardContext } from "./gameContext";
import { useOptions } from "./optionsContext";
import { Sweat } from "./pieces/svg";

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
  const { State, Actions } = useChessBoardContext();
  const { Options } = useOptions();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const pieceOnThisSquare = State.game.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare && pieceOnThisSquare?.square === State.activePiece?.from;

  const getLayer = () => {
    const layers: ReactNode[] = [];

    if (isAttacked) {
      layers.push(
        <span key="isAttacked" className="layer isAttacked">
          <Sweat />
        </span>
      );
    }

    if (possibleDestination) {
      layers.push(<span className="layer moveLayer" />);
      return layers;
    } else if (partOfLastMove) {
      layers.push(<span className="layer partOfLastMove" />);
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
        />
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
        />
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
