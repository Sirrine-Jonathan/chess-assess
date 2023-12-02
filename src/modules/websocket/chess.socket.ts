import { Socket } from "socket.io";
import MySocketInterface from "./mySocketInterface";
import { Chess, validateFen } from "chess.js";

class ChessSocket implements MySocketInterface {
  private chess;
  private game;
  private socket;

  handleConnection(socket: Socket) {
    socket.emit("ping", true);

    this.chess = new Chess();
    this.socket = socket;

    this.update();

    socket.on("moving", (square) => {
      socket.emit("showMoves", {
        moves: this.chess.moves({ square, verbose: true }),
      });
    });

    socket.on("moves", () => {
      socket.emit("showMoves", {
        moves: this.getPlayersMoves("w"),
        enemyMoves: this.getPlayersMoves("b"),
      });
    });

    socket.on("load", (fen) => {
      let loadSuccess = false;
      if (validateFen(fen)) {
        try {
          this.chess.load(fen);
          socket.emit("loadSuccess", true);
          this.update();
        } catch (err) {}
      }
      socket.emit("loadSuccess", loadSuccess);
    });

    socket.on("move", (event) => {
      let failed = false;
      try {
        const moveResult = this.chess.move(event);
        if (moveResult.flags.includes("e") || moveResult.flags.includes("c")) {
          socket.emit("capture", {
            piece: moveResult.captured,
            type: moveResult.flags.includes("e") ? "en-passant" : "capture",
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
        setTimeout(() => {
          const moveResult = this.chess.move({ from: move.from, to: move.to });
          if (moveResult.flags.includes("e") || moveResult.flags.includes("c")) {
            socket.emit("capture", {
              piece: moveResult.captured,
              type: moveResult.flags.includes("e") ? "en-passant" : "capture",
              color: moveResult.color === 'w' ? 'b' : 'w';
            });
          }
          this.update();
        }, 1500);
      }
    });
    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  getPlayersMoves(player) {
    let moves = [];
    try {
      const fen = this.chess.fen();
      const splitFen = fen.split(" ");
      splitFen[1] = player;
      const newFen = splitFen.join(" ");
      const temp = new Chess(newFen);
      moves = temp.moves({ verbose: true });
    } catch (err) {
      console.error(err);
    }
    return moves;
  }

  update() {
    this.socket.emit("update", {
      board: this.chess.board(),
      moves: this.getPlayersMoves("w"),
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
