import { Knight } from "./Knight";
import { Rook } from "./Rook";
import { Bishop } from "./Bishop";
import { Queen } from "./Queen";
import { King } from "./King";
import { Pawn } from "./Pawn";

export enum PieceType {
  Rook = "ROOK",
  Knight = "KNIGHT",
  Bishop = "BISHOP",
  Queen = "QUEEN",
  King = "KING",
  Pawn = "PAWN",
}

export enum PieceColor {
  White = "WHITE",
  Black = "Black",
}

export interface BasePieceProps {
  type: PieceType;
  color: PieceColor;
}

export { Knight, Rook, Bishop, Queen, King, Pawn };
