import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./BasePiece";

interface RookProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Rook = ({ color }: RookProps) => {
  return <BasePiece color={color} type={PieceType.Rook} />;
};
