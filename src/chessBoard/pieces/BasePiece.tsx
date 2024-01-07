import Piece from "./Piece";
import { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import { useGame } from "../state/game/useGame";

export const BasePiece = ({ color, type, pieceCanMove }: BasePieceProps) => {
  const { gameState } = useGame();
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




  return (
    <div
      className={clsx(["piece", pieceCanMove && "pieceCanMove"])}
      tabIndex={-1}
    >
      <div ref={pieceRef} id={piece} data-color={color} data-type={type}>
        <Piece color={color} type={type} />
      </div>
    </div>
  );
};
