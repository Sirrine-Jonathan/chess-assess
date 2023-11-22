import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./basePiece";

interface RookProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Rook = ({ color }: RookProps) => {
  return <BasePiece color={color} type={PieceType.Rook} />;
};
