import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./BasePiece";

interface BishopProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Bishop = ({ color }: BishopProps) => {
  return <BasePiece color={color} type={PieceType.Bishop} />;
};
