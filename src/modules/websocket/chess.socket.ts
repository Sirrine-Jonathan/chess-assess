import { Socket } from "socket.io";
import MySocketInterface from "./mySocketInterface";
import { Chess, validateFen } from "chess.js";

class ChessSocket implements MySocketInterface {
  private chess;
  private socket;

  handleConnection(socket: Socket) {
    socket.emit("ping", true);

    this.chess = new Chess();
    this.socket = socket;

    this.update();

    socket.on("moving", (square) => {
      socket.emit("showMoves", this.getPiecePosition(square));
    });

    socket.on("move", () => {
      socket.emit("showPosition", {
        position: this.getPlayerPosition("w"),
        enemyPosition: this.getPlayerPosition("b"),
      });
    });

    socket.on("load", (fen) => {
      let loadSuccess = false;
      if (validateFen(fen)) {
        try {
          this.chess.load(fen);
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

    socket.on("move", (event) => {
      let failed = false;
      try {
        const moveResult = this.chess.move(event);
        if (moveResult.flags.includes("e") || moveResult.flags.includes("c")) {
          socket.emit("capture", {
            piece: moveResult.captured,
            type: moveResult.flags.includes("e") ? "en-passant" : "capture",
            color: moveResult.color === "w" ? "b" : "w",
          });
        }
      } catch (err) {
        console.log("failed move", event);
        console.error(err);
        failed = true;
      }

      this.update();

      if (!failed) {
        const enemyMoves = this.chess.moves({ verbose: true });
        const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        if (move) {
          setTimeout(() => {
            const moveResult = this.chess.move({
              from: move.from,
              to: move.to,
            });
            if (
              moveResult.flags.includes("e") ||
              moveResult.flags.includes("c")
            ) {
              socket.emit("capture", {
                piece: moveResult.captured,
                type: moveResult.flags.includes("e") ? "en-passant" : "capture",
                color: moveResult.color === "w" ? "b" : "w",
              });
            }
            this.update();
          }, 1500);
        }
      }
    });
    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  filterDefenseMove(move) {
    if (move.piece === "p") {
      const fromArr = move.from.split("");
      const toArr = move.to.split("");
      const fromFile = fromArr[0];
      const toFile = toArr[0];
      const fromRank = fromArr[1];
      const toRank = toArr[1];
      return fromFile === toFile && Math.abs(toRank - fromRank) <= 1;
    }
    return true;
  }

  getPiecePosition(square) {
    const moves = this.chess.moves({ square, verbose: true });
    const defending = moves.filter(this.filterDefenseMove);
    return { moves, defending };
  }

  getPlayerPosition(player: "b" | "w") {
    let moves = [];
    let defending = [];
    try {
      const fen = this.chess.fen();
      const splitFen = fen.split(" ");
      splitFen[1] = player;
      const newFen = splitFen.join(" ");
      const temp = new Chess(newFen);
      moves = temp.moves({ verbose: true });
      defending = moves.filter(this.filterDefenseMove);
    } catch (err) {
      console.error(err);
    }
    return { moves, defending };
  }

  update() {
    this.socket.emit("update", {
      board: this.chess.board(),
      position: this.getPlayerPosition("w"),
      enemyPosition: this.getPlayerPosition("b"),
      ascii: this.chess.ascii(),
      turn: this.chess.turn(),
      history: this.chess.history({ verbose: true }),
      inCheck: this.chess.inCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isDraw: this.chess.isDraw(),
      isInsufficientMaterial: this.chess.isInsufficientMaterial(),
      isGameOver: this.chess.isGameOver(),
      isStalemate: this.chess.isStalemate(),
      isThreefoldRepetition: this.chess.isThreefoldRepetition(),
      fen: this.chess.fen(),
    });
  }

  middlewareImplementation(socket: Socket, next) {
    //Implement your middleware for orders here
    return next();
  }
}

export default ChessSocket;
