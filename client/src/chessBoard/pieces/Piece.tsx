import type { Color, PieceSymbol } from "chess-layers.js";
import { RW, NW, BW, KW, QW, PW, RB, NB, BB, QB, KB, PB } from "./svg";

const colorTypeMap: Record<Color, Record<PieceSymbol, any>> = {
  w: {
    r: RW,
    n: NW,
    b: BW,
    k: KW,
    q: QW,
    p: PW,
  },
  b: {
    r: RB,
    n: NB,
    b: BB,
    k: KB,
    q: QB,
    p: PB,
  },
};

const Piece = ({ color, type }: { color: Color; type: PieceSymbol }) => {
  const TypedPiece = colorTypeMap[color][type];
  return TypedPiece ? <TypedPiece /> : null;
};

export default Piece;
