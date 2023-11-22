import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface KingProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const King = ({ color }: KingProps) => {
  return <BasePiece color={color} type={PieceType.King} />;
};
