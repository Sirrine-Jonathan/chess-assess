import { Chess, validateFen, type Square, Move } from "chess.js";
import { Howl } from "howler";

const moveSound = new Howl({
  src: ["/sounds/move.mp3"],
});

const captureSound = new Howl({
  src: ["/sounds/capture.mp3"],
});

const checkSound = new Howl({
  src: ["/sounds/move-check.mp3"],
});

const promoteSound = new Howl({
  src: ["/sounds/promote.mp3"],
});

const gameOverSound = new Howl({
  src: ["/sounds/game-end.mp3"],
});

const castleSound = new Howl({
  src: ["/sounds/castle.mp3"],
});

export class Game {
  private chess;
  private state;

  constructor(fen?: string) {
    this.chess = new Chess();
    if (fen) {
      this.load(fen);
    }
    this.state = this.getUpdate();
  }

  getChess() {
    return this.chess;
  }

  getFen() {
    return this.chess.fen();
  }

  getState() {
    return this.state;
  }

  getBoard() {
    return this.chess.board();
  }

  getUpdate() {
    const board = this.chess.board();
    const history = this.chess.history({ verbose: true });
    const conflict: Record<string, { white: boolean; black: boolean }> = {};
    board.flat().forEach((piece, index) => {
      const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][index % 8];
      const fileNum = ((index - (index % 8)) % 9) - 1;
      const file = fileNum < 0 ? 8 : fileNum;

      const name = `${rank}${file}` as Square;

      conflict[name] = {
        white: this.chess.isAttacked(name, "w"),
        black: this.chess.isAttacked(name, "b"),
      };
    });
    const update = {
      ascii: this.chess.ascii(),
      board,
      conflict,
      moves: this.chess.moves({ verbose: true }),
      turn: this.chess.turn(),
      inCheck: this.chess.inCheck(),
      isDraw: this.chess.isDraw(),
      isCheckmate: this.chess.isCheckmate(),
      isInsufficientMaterial: this.chess.isInsufficientMaterial(),
      isGameOver: this.chess.isGameOver(),
      isStalemate: this.chess.isStalemate(),
      isThreefoldRepetition: this.chess.isThreefoldRepetition(),
      fen: this.chess.fen(),
      history,
      navIndex: history.length - 1,
    };
    return update;
  }

  update() {
    this.state = this.getUpdate();
  }

  move(move: Pick<Move, "from" | "to" | "promotion">) {
    const result = this.chess.move(move);

    const didCapture = result.flags.includes("e") || result.flags.includes("c");

    if (this.chess.isGameOver()) {
      gameOverSound.play();
    } else if (this.chess.inCheck()) {
      checkSound.play();
    } else if (result.flags.includes("k") || result.flags.includes("q")) {
      castleSound.play();
    } else if (result.flags.includes("p")) {
      promoteSound.play();
    } else if (didCapture) {
      captureSound.play();
    } else {
      moveSound.play();
    }

    let captured: { piece: any; type: string; color: string } | null = null;
    if (didCapture) {
      captured = {
        piece: result.captured,
        type: result.flags.includes("e") ? "en-passant" : "capture",
        color: result.color === "w" ? "b" : "w",
      };
    }

    return captured;
  }

  getActiveMoves = (square: Square): Move[] => {
    return this.chess.moves({ square, verbose: true });
  };

  getMoves = (): Move[] => {
    return this.chess.moves({ verbose: true });
  };

  load = (fen: string) => {
    if (validateFen(fen)) {
      try {
        this.chess.load(fen);

        // Gather what pieces have been captured for each color
        const pieces = "rrnnbbqkpppppppp";
        const white = pieces.split("");
        const black = pieces.toUpperCase().split("");
        fen.split("").forEach((piece) => {
          if (piece === " ") {
            return;
          }
          const whiteIndex = white.findIndex((p) => p === piece);
          const blackIndex = black.findIndex((p) => p === piece);
          if (whiteIndex >= 0) {
            white.splice(whiteIndex, 1);
          }
          if (blackIndex >= 0) {
            black.splice(blackIndex, 1);
          }
        });
        return {
          blackCaptured: white,
          whiteCaptured: black,
        };
      } catch (err) {
        return {
          blackCaptured: [],
          whiteCaptured: [],
        };
      }
    } else {
      return {
        blackCaptured: [],
        whiteCaptured: [],
      };
    }
  };
}
