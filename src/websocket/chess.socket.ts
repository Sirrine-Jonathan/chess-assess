import { Socket } from "socket.io";
import SocketInterface from "./socketInterface";
import { Chess, validateFen } from "chess.js";
import Bot from "../libs/bot";

class ChessSocket implements SocketInterface {
  private chess;
  private bot;
  private socket;

  handleConnection(socket: Socket) {
    socket.emit("ping", true);

    this.chess = new Chess();
    this.bot = new Bot();
    this.socket = socket;

    this.update();

    // handle
    socket.on("moving", (square) => {
      const activeMoves = this.chess.moves({ square, verbose: true });
      socket.emit("showActiveMoves", activeMoves);
    });

    // Handle updates after a requests a move
    socket.on("move", (playerMove) => {
      // try move and report capture results
      let moveFailed = false;
      try {
        const capture = this.move(playerMove);
        if (capture) {
          this.socket.emit("capture", capture);
        }

        this.socket.emit("moveEnded", playerMove);
      } catch (err) {
        console.log("failed move");
        console.error(err);
        moveFailed = true;
      } finally {
        this.update();
      }

      // make compouter move and report capture results
      if (!moveFailed) {
        const move = this.bot.pickRandomMove(
          this.chess.moves({ verbose: true })
        );

        if (move) {
          // delay move response for a bit
          setTimeout(() => {
            try {
              const computerMove = {
                from: move.from,
                to: move.to,
              };
              const capture = this.move(computerMove);
              if (capture) {
                this.socket.emit("capture", capture);
              }
              this.socket.emit("moveEnded", computerMove);
            } catch (err) {
              console.log("failed compouter move");
              console.error(err);
            } finally {
              this.update();
            }
          }, 1500);
        }
      }
    });

    // Load a game via fen
    socket.on("load", (fen) => {
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
          socket.emit("loadSuccess", {
            blackCaptured: white,
            whiteCaptured: black,
          });
          this.update();
        } catch (err) {}
      } else {
        socket.emit("loadSuccess", {
          blackCaptured: [],
          whiteCaptured: [],
        });
      }
    });

    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  move(move) {
    const result = this.chess.move(move);
    if (result.flags.includes("e") || result.flags.includes("c")) {
      return {
        piece: result.captured,
        type: result.flags.includes("e") ? "en-passant" : "capture",
        color: result.color === "w" ? "b" : "w",
      };
    }
    return null;
  }

  update() {
    const board = this.chess.board();
    const conflict = {};
    board.flat().forEach((piece, index) => {
      const rank = ["a", "b", "c", "d", "e", "f", "g", "h"][index % 8];
      const fileNum = ((index - (index % 8)) % 9) - 1;
      const file = fileNum < 0 ? 8 : fileNum;

      const name = `${rank}${file}`;

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
      history: this.chess.history({ verbose: true }),
    };
    this.socket.emit("update", update);
  }

  middlewareImplementation(socket: Socket, next) {
    return next();
  }
}

export default ChessSocket;
