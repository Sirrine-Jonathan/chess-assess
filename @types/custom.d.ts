import type { Square, Color, PieceSymbol } from "chess-layers.js";

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

  type CaptureEvent = {
    piece: PieceSymbol;
    type: "en-passant" | "capture";
    color: Color;
  };

  type LockedPieces = { [squareName: string]: Position };

  interface ChessBoardState {
    activePiece: ChessPiece | null;
    activeMoves: Move[];
    lastMove: Move | null;
    isConnected: boolean;
    lockedPieces: LockedPieces;
    playerColor: Color;
    whiteCaptured: PieceSymbol[];
    blackCaptured: PieceSymbol[];
    game: {
      ascii: string;
      board: Board;
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
  }

  type Board = { square: string; type: string; color: string }[][];

  type Move = {
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

  type Moves = Move[];

  type GameUpdate = {
    ascii: string;
    board: Board;
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
