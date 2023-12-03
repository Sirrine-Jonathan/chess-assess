import { PieceColor, PieceType } from "../chessTypes";
import { RW, NW, BW, KW, QW, PW, RB, NB, BB, QB, KB, PB } from "./svg";

const colorTypeMap: Record<PieceColor, Record<PieceType, any>> = {
  [PieceColor.White]: {
    [PieceType.Rook]: RW,
    [PieceType.Knight]: NW,
    [PieceType.Bishop]: BW,
    [PieceType.King]: KW,
    [PieceType.Queen]: QW,
    [PieceType.Pawn]: PW,
  },
  [PieceColor.Black]: {
    [PieceType.Rook]: RB,
    [PieceType.Knight]: NB,
    [PieceType.Bishop]: BB,
    [PieceType.King]: KB,
    [PieceType.Queen]: QB,
    [PieceType.Pawn]: PB,
  },
};

const Piece = ({ color, type }: { color: PieceColor; type: PieceType }) => {
  const TypedPiece = colorTypeMap[color][type];
  return <TypedPiece />;
};

export default Piece;
