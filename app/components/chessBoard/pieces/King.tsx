import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./basePiece";

interface KingProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const King = ({ color }: KingProps) => {
  return <BasePiece color={color} type={PieceType.King} />;
};
