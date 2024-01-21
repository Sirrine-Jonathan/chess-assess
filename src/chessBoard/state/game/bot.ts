import { Move, Square, Chess, PieceSymbol, Piece } from "chess.js";
import { Game } from "./game";

export class Bot {
  private level = 0;
  private stockfishJs: Worker;

  constructor(level = 0) {
    console.log("Bot constructor", level);
    this.stockfishJs = new Worker("/nmrugg_stockfish_js/stockfish.js");
  }

  async checkStockfish() {
    return new Promise((resolve, reject) => {
      this.postMessage("isready");
      this.stockfishJs.onmessage = (event) => {
        if (event.data === "readyok") {
          console.log(`Received: ${event.data}`);
          resolve(true);
        }
        this.stockfishJs.onerror = (error) => {
          console.log(`Received: ${error}`);
          reject(false);
        };
      };
    });
  }

  setSkill(level: number) {
    if (this.level !== level) {
      this.postMessage("uci");
      this.postMessage(`Skill Level ${level}`);
      this.level = level;
    }
  }

  getRandomMove(moves: Move[]) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  async getMove(fen: string, game: Game) {
    const moves = game.getMoves();
    console.log(`getMove at level ${this.level}`, fen, moves);
    if (this.level < 0) {
      console.log("getMove => random", "level < 0");
      return Promise.resolve(this.getRandomMove(moves));
    } else {
      try {
        console.log("getMove => stockfish", "level > 0");
        return this.getBestMove(fen);
      } catch (err) {}
      console.log("Failed: getMove => random", "level > 0");
      return Promise.resolve(this.getRandomMove(moves));
    }
  }

  async getBetterMove(fen: string, game: Game) {
    const betterMove = calculateBestMove(fen);
    const actualMove = betterMove?.includes("x")
      ? betterMove
      : this.getRandomMove(game.getMoves());
    console.log("BETTER MOVE", betterMove, "playing", actualMove);
    return actualMove;
  }

  postMessage(message: string) {
    console.log(`Sent: ${message}`);
    if (this.stockfishJs) {
      this.stockfishJs.postMessage(message);
    } else {
      console.warn("stockfish is not initialized");
    }
  }

  async getBestMove(fen: string): Promise<Pick<Move, "from" | "to">> {
    return new Promise((resolve, reject) => {
      this.postMessage(`position fen ${fen}`);
      this.postMessage(`go depth 5`);

      this.stockfishJs.onerror = (error) => {
        console.error(`Stockfish error ${error}`);
        reject(error);
      };

      this.stockfishJs.onmessage = (message: MessageEvent<string>) => {
        console.log(`Received: ${message.data}`);
        if (message.data.includes("bestmove")) {
          const arr = message.data.split(" ");
          const move = arr[1];
          const from = (move.charAt(0) + move.charAt(1)) as Square;
          const to = (move.charAt(2) + move.charAt(3)) as Square;
          const best = { from, to };
          resolve(best);
        }
      };
    });
  }
}

const calculateBestMove = function (fen: string) {
  const game = new Chess();
  game.load(fen);
  const moves = game.moves();
  let bestMove = null;
  //use any negative large number
  let bestValue = -9999;

  for (let i = 0; i < moves.length; i++) {
    const newGameMove = moves[i];
    game.move(newGameMove);

    //take the negative as AI plays as black
    const boardValue = -evaluateBoard(game.board());
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = newGameMove;
    }
  }

  return bestMove;
};

const evaluateBoard = function (board: Board) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
    }
  }
  return totalEvaluation;
};

const getPieceValue = function (piece: Piece | null) {
  if (piece === null) {
    return 0;
  }
  const getAbsoluteValue = function (piece: PieceSymbol) {
    if (piece === "p") {
      return 10;
    } else if (piece === "r") {
      return 50;
    } else if (piece === "n") {
      return 30;
    } else if (piece === "b") {
      return 30;
    } else if (piece === "q") {
      return 90;
    } else if (piece === "k") {
      return 900;
    }
    throw "Unknown piece type: " + piece;
  };

  const absoluteValue = getAbsoluteValue(piece.type);
  return piece.color === "w" ? absoluteValue : -absoluteValue;
};
