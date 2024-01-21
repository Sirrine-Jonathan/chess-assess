import type { Square, Color, PieceSymbol, Move } from "chess.js";

declare global {
  type ChessPiece = {
    color: Color;
    piece: PieceSymbol;
    from: Square;
  };
  interface BasePieceProps {
    type: PieceSymbol;
    color: Color;
    pieceCanMove: boolean;
  }

  interface PieceProps extends Omit<BasePieceProps, "type"> {}
  interface Options {
    flipBoard: boolean;
    showSquareName: boolean;
    showAxisLabels: boolean;
    showDefenseLayer: boolean;
    showEnemyDefenseLayer: boolean;
    defenseLayerColor: string;
    enemyDefenseLayerColor: string;
    disputedLayerColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  }

  type CaptureEvent = {
    piece: PieceSymbol;
    type: "en-passant" | "capture";
    color: Color;
  };

  type LockedPieces = { [squareName: string]: null };

  type Conflict = Record<Square, { white: boolean; black: boolean }> | null;

  interface GameState {
    playerColor: Color | null;
    ascii: string;
    board: Board;
    pieceMap: Record<Square, Square | null>;
    conflict: Conflict;
    moves: Move[];
    lockedMoves: Move[];
    lockedDefense: Move[];
    turn: Color;
    inCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    isInsufficientMaterial: boolean;
    isGameOver: boolean;
    isStalemate: boolean;
    isThreefoldRepetition: boolean;
    fen: string;
    history: Move[];
    whiteCaptured: PieceSymbol[];
    blackCaptured: PieceSymbol[];
    lastMove: Pick<Move, "to" | "from"> | null;
    activeMoves: Move[];
    skillLevel: number;
    type: GameType;
    navIndex: number;
    promotion: {
      to: Square;
      from: Square;
      promotion: "n" | "b" | "r" | "q";
    } | null;
    opening: string | undefined | null;
  }
  interface SelectionState {
    activePiece: ChessPiece | null;
    lockedOwn: Square[];
    lockedTarget: Square[];
  }

  type Board = ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];

  type GameUpdate = {
    ascii: string;
    board: Board;
    conflict: Conflict;
    moves: Move[];
    turn: Color;
    inCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    isInsufficientMaterial: boolean;
    isGameOver: boolean;
    isStalemate: boolean;
    isThreefoldRepetition: boolean;
    fen: string;
    history: Move[];
  };

  type Position = { moves: Move[]; defending: Move[] } | never;

  type ShowPosition = {
    position: Position;
    enemyPosition: Position;
  };
}
