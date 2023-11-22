import {
  PieceColor,
  PieceType,
  BasePiece,
  type BasePieceProps,
} from "./BasePiece";

interface PawnProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Pawn = ({ color }: PawnProps) => {
  return <BasePiece color={color} type={PieceType.Pawn} />;
};
