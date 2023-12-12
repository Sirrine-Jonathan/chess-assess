import type { Square, Color, PieceSymbol } from "chess.js";

declare global {
  type ChessPiece = {
    color: Color;
    piece: PieceSymbol;
    from: Square;
  };

  type GameRole = "white" | "black" | "spectator";
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

  interface SocketState {
    isConnected: boolean;
    role: GameRole;
  }

  type CaptureEvent = {
    piece: PieceSymbol;
    type: "en-passant" | "capture";
    color: Color;
  };

  type LockedPieces = { [squareName: string]: Position };

  type Conflict = Record<Square, { white: boolean; black: boolean }> | {};

  interface GameState {
    playerColor: Color | null;
    ascii: string;
    board: Board;
    conflict: Conflict;
    moves: Moves;
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
    lastMove: BaseMove | null;
    activeMoves: Move[];
    isComputerGame: boolean;
    botDelay: number;
  }
  interface SelectionState {
    activePiece: ChessPiece | null;
    lockedPieces: LockedPieces;
  }

  type Board = { square: string; type: string; color: string }[][];

  type BaseMove = {
    to: Square;
    from: Square;
  };

  type Move = {
    color: string;
    piece: string;
    san: string;
    lan: string;
    before: string;
    after: string;
    flags: string;
    captured?: string;
    promotion?: string;
  } & BaseMove;

  type Moves = Move[];

  type GameUpdate = {
    ascii: string;
    board: Board;
    conflict: Conflict;
    moves: Moves;
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
