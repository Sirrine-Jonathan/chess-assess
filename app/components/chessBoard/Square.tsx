import React, { type PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";

interface SquareProps {
  name: string;
}

export const Square = ({ name, children }: PropsWithChildren<SquareProps>) => {
  const { isOver, setNodeRef } = useDroppable({ id: name });
  const style = {
    background: isOver ? "white" : undefined,
  };

  return (
    <div id={name} ref={setNodeRef} className={clsx`square`} style={style}>
      <span className="squareName">{name}</span>
      {children}
    </div>
  );
};
