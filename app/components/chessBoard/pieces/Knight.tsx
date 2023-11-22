import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./basePiece";

interface KnightProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Knight = ({ color }: KnightProps) => {
  return <BasePiece color={color} type={PieceType.Knight} />;
};