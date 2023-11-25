import type { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

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
  const { isOver, setNodeRef } = useDroppable({ id: name });
  const style = {
    background: isOver ? "white" : undefined,
  };

  return (
    <div
      id={name}
      ref={canMoveHere || pieceCanMoveHere ? setNodeRef : null}
      className={clsx([
        "square",
        canMoveHere && "canMoveHere",
        pieceCanMoveHere && "pieceCanMoveHere",
      ])}
      style={style}
    >
      <span className="beingAttacked" />
      <span className="defending" />
      <span className="disputed" />
      <span className="squareName">{name}</span>
      {children}
    </div>
  );
};
