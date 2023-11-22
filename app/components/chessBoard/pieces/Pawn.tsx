import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface PawnProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Pawn = ({ color }: PawnProps) => {
  return <BasePiece color={color} type={PieceType.Pawn} />;
};
