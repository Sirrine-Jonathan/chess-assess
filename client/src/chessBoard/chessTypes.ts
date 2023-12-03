export enum PieceType {
  Rook = "r",
  Knight = "n",
  Bishop = "b",
  Queen = "q",
  King = "k",
  Pawn = "p",
}

export enum PieceColor {
  White = "w",
  Black = "b",
}

export type ChessPiece = {
  color: PieceColor;
  piece: PieceType;
  from: Sq;
};

export interface BasePieceProps {
  type: PieceType;
  color: PieceColor;
  canMove: boolean;
}

export interface PieceProps extends Omit<BasePieceProps, "type"> {}
export interface Options {
  showSquareName: boolean;
  showAxisLabels: boolean;
  showDefenseLayer: boolean;
  showEnemyDefenseLayer: boolean;
  defenseLayerColor: string;
  enemyDefenseLayerColor: string;
  disputedTerritoryLayerColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export type CaptureEvent = {
  piece: PieceType;
  type: "en-passant" | "capture";
  color: PieceColor;
};

export type LockedPieces = { [squareName: string]: Position };

export interface ChessBoardState {
  activePiece: ChessPiece | null;
  isConnected: boolean;
  board: Board;
  piecePosition: Position;
  position: Position;
  enemyPosition: Position;
  lockedPieces: LockedPieces;
  turn: PieceColor;
  ascii: string;
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isInsufficientMaterial: boolean;
  isGameOver: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  history: HistoryItem[];
  playerColor: PieceColor;
  whiteCaptured: PieceType[];
  blackCaptured: PieceType[];
}

export type Board = { square: string; type: string; color: string }[][];
export type Move = {
  to: string;
  from: string;
  color: string;
  piece: string;
  san: string;
  lan: string;
  before: string;
  after: string;
  flags: string;
  captured?: string;
  promotion?: string;
};

export type HistoryItem = {
  before: string;
  after: string;
  color: PieceColor;
  piece: PieceType;
  from: Sq;
  to: Sq;
  san: string;
  lan: string;
  flags: string;
};

export type Update = {
  ascii: string;
  board: Board;
  turn: PieceColor;
  position: Position;
  enemyPosition: Position;
  lockedPieces: LockedPieces;
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isInsufficientMaterial: boolean;
  isGameOver: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  fen: string;
  history: HistoryItem[];
};

export type Position = { moves: Move[]; defending: Move[] } | never;

export type ShowPosition = {
  position: Position;
  enemyPosition: Position;
};

export type ShowMoves = {
  moves: Move[];
};

export enum Sq {
  "A1" = "a1",
  "A2" = "a2",
  "A3" = "a3",
  "A4" = "a4",
  "A5" = "a5",
  "A6" = "a6",
  "A7" = "a7",
  "A8" = "a8",
  "B1" = "b1",
  "B2" = "b2",
  "B3" = "b3",
  "B4" = "b4",
  "B5" = "b5",
  "B6" = "b6",
  "B7" = "b7",
  "B8" = "b8",
  "C1" = "c1",
  "C2" = "c2",
  "C3" = "c3",
  "C4" = "c4",
  "C5" = "c5",
  "C6" = "c6",
  "C7" = "c7",
  "C8" = "c8",
  "D1" = "d1",
  "D2" = "d2",
  "D3" = "d3",
  "D4" = "d4",
  "D5" = "d5",
  "D6" = "d6",
  "D7" = "d7",
  "D8" = "d8",
  "E1" = "e1",
  "E2" = "e2",
  "E3" = "e3",
  "E4" = "e4",
  "E5" = "e5",
  "E6" = "e6",
  "E7" = "e7",
  "E8" = "e8",
  "F1" = "f1",
  "F2" = "f2",
  "F3" = "f3",
  "F4" = "f4",
  "F5" = "f5",
  "F6" = "f6",
  "F7" = "f7",
  "F8" = "f8",
  "G1" = "g1",
  "G2" = "g2",
  "G3" = "g3",
  "G4" = "g4",
  "G5" = "g5",
  "G6" = "g6",
  "G7" = "g7",
  "G8" = "g8",
  "H1" = "h1",
  "H2" = "h2",
  "H3" = "h3",
  "H4" = "h4",
  "H5" = "h5",
  "H6" = "h6",
  "H7" = "h7",
  "H8" = "h8",
}
