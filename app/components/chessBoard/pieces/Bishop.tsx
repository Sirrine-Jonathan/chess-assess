import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface BishopProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Bishop = ({ color }: BishopProps) => {
  return <BasePiece color={color} type={PieceType.Bishop} />;
};
