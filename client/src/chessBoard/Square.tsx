import type { PropsWithChildren, ReactNode } from "react";
import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useChessBoardContext } from "./gameContext";
import { Sq, type PieceColor, type PieceType } from "./chessTypes";
import { useOptions } from "./optionsContext";

interface SquareProps {
  name: string;
  playerDefending: boolean;
  possibleMove: boolean;
  enemyDefending: boolean;
}

export const Square = ({
  name,
  playerDefending,
  possibleMove,
  enemyDefending,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { State, Actions } = useChessBoardContext();
  const { Options } = useOptions();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const pieceOnThisSquare = State.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare && pieceOnThisSquare?.square === State.activePiece?.from;

  const getLayers = () => {
    const layers: ReactNode[] = [];
    if (name === "e2") {
      console.log(`getLayers ${name}`, {
        possibleMove,
        playerDefending,
        enemyDefending,
      });
    }
    if (possibleMove) {
      layers.push(<span className="layer moveLayer" />);
    }
    if (Options.showDefenseLayer && playerDefending) {
      layers.push(
        <span
          className={clsx([
            "layer",
            enemyDefending ? "disputedLayer" : "defenseLayer",
          ])}
        />
      );
    }
    if (Options.showEnemyDefenseLayer && enemyDefending) {
      layers.push(
        <span
          className={clsx([
            "layer",
            playerDefending ? "disputedLayer" : "enemyDefenseLayer",
          ])}
        />
      );
    }
    return layers;
  };

  return (
    <div
      id={name}
      ref={playerDefending || possibleMove ? setNodeRef : null}
      className={clsx([
        "square",
        playerDefending && "playerDefending_disabled",
        possibleMove && "possibleMove_disabled",
        enemyDefending && "enemyDefending",
        playerDefending && "defending",
        isOver && "isOver",
        isActive && "isActive",
      ])}
      style={{ ...(possibleMove ? { cursor: "pointer" } : {}) }}
      tabIndex={0}
      onClick={() => {
        const piece = State.board.flat().find((cell) => cell?.square === name);
        if (piece && piece.color === State.turn) {
          Actions.setActivePiece({
            color: piece.color as PieceColor,
            piece: piece.type as PieceType,
            from: name as Sq,
          });
        } else if (State.activePiece && (possibleMove || playerDefending)) {
          Actions.move({ from: State.activePiece.from, to: name as Sq });
        }
      }}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          const piece = State.board
            .flat()
            .find((cell) => cell?.square === name);
          if (piece && piece.color === State.turn) {
            Actions.setActivePiece({
              color: piece.color as PieceColor,
              piece: piece.type as PieceType,
              from: name as Sq,
            });
          } else if (State.activePiece && (possibleMove || playerDefending)) {
            Actions.move({ from: State.activePiece.from, to: name as Sq });
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
