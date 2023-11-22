import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./basePiece";

interface QueenProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Queen = ({ color }: QueenProps) => {
  return <BasePiece color={color} type={PieceType.Queen} />;
};
