import { Move, Square } from "chess.js";

const stockfishJs = new Worker("/nmrugg_stockfish_js/stockfish.js");

export class Bot {
  private level = 0;

  constructor(level = 0) {
    console.log("Bot constructor", level);
    this.postMessage(`Skill Level ${level}`);
    this.postMessage(`uci`);
    this.level = level;
  }

  getRandomMove(moves: Move[]) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  async getMove(fen: string, moves: Move[]) {
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

  postMessage(message: string) {
    console.log(`Sent: ${message}`);
    stockfishJs.postMessage(message);
  }

  async getBestMove(fen: string): Promise<Pick<Move, "from" | "to">> {
    return new Promise((resolve, reject) => {
      this.postMessage(`position fen ${fen}`);
      this.postMessage(`go depth 5`);

      stockfishJs.onerror = (error) => {
        console.error(`Stockfish error ${error}`);
        reject(error);
      };

      stockfishJs.onmessage = (message: MessageEvent<string>) => {
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
