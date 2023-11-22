import type { BasePieceProps } from "./index";
import { PieceColor, PieceType } from "./index";
import { BasePiece } from "./BasePiece";

interface KnightProps extends Omit<BasePieceProps, "type"> {
  color: PieceColor;
}

export const Knight = ({ color }: KnightProps) => {
  return <BasePiece color={color} type={PieceType.Knight} />;
};
