import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface RookProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Rook = ({ color }: RookProps) => {
  return <BasePiece color={color} type={PieceType.Rook} />;
};
