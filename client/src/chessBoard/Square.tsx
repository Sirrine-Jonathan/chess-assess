import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useChessBoardContext } from "./context";
import { Sq, type PieceColor, type PieceType } from "./chessTypes";

interface SquareProps {
  name: string;
  canMoveHere: boolean;
  pieceCanMoveHere: boolean;
}

export const Square = ({
  name,
  canMoveHere,
  pieceCanMoveHere,
  children,
}: PropsWithChildren<SquareProps>) => {
  const nameRef = useRef<HTMLSpanElement>(null);
  const { State, Actions } = useChessBoardContext();
  const { isOver, setNodeRef } = useDroppable({ id: name });

  const pieceOnThisSquare = State.board
    .flat()
    .find((cell) => cell?.square === name);
  const isActive =
    pieceOnThisSquare && pieceOnThisSquare?.square === State.activePiece?.from;

  return (
    <div
      id={name}
      ref={canMoveHere || pieceCanMoveHere ? setNodeRef : null}
      className={clsx([
        "square",
        canMoveHere && "canMoveHere",
        pieceCanMoveHere && "pieceCanMoveHere",
        isOver && "isOver",
        isActive && "isActive",
      ])}
      tabIndex={0}
      onClick={() => {
        const piece = State.board.flat().find((cell) => cell?.square === name);
        if (piece) {
          if (piece.color === State.turn) {
            Actions.setActivePiece({
              color: piece.color as PieceColor,
              piece: piece.type as PieceType,
              from: name as Sq,
            });
          }
        } else if (State.activePiece && (pieceCanMoveHere || canMoveHere)) {
          Actions.move({ from: State.activePiece.from, to: name as Sq });
        }
      }}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          const piece = State.board
            .flat()
            .find((cell) => cell?.square === name);
          if (piece) {
            if (piece.color === State.turn) {
              Actions.setActivePiece({
                color: piece.color as PieceColor,
                piece: piece.type as PieceType,
                from: name as Sq,
              });
            }
          } else if (State.activePiece && (pieceCanMoveHere || canMoveHere)) {
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
      {/* <span className="beingAttacked" />
      <span className="defending" />
      <span className="disputed" /> */}
      <span ref={nameRef} className="squareName">
        {name}
      </span>
      {children}
    </div>
  );
};
