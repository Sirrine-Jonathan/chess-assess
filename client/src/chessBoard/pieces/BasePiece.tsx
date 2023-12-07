import Piece from "./Piece";
import { useRef, useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";

export const BasePiece = ({ color, type, pieceCanMove }: BasePieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const [square, setSquare] = useState<string | null>(null);

  useEffect(() => {
    if (pieceRef.current) {
      const squareDiv = pieceRef.current?.closest(".square");
      if (squareDiv && squareDiv.id) {
        setSquare(squareDiv.id);
      }
    }
  }, [pieceRef]);

  const piece = `${color}-${type}`;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${piece}-${square}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={clsx(["piece", pieceCanMove && "pieceCanMove"])}
      ref={pieceCanMove ? setNodeRef : null}
      style={style}
      {...(pieceCanMove ? listeners : {})}
      {...(pieceCanMove ? attributes : {})}
      tabIndex={-1}
    >
      <div ref={pieceRef} id={piece} data-color={color} data-type={type}>
        <Piece color={color} type={type} />
      </div>
    </div>
  );
};
