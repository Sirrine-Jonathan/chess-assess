import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface QueenProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Queen = ({ color }: QueenProps) => {
  return <BasePiece color={color} type={PieceType.Queen} />;
};
