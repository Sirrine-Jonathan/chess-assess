import { Socket } from "socket.io";
import MySocketInterface from "./mySocketInterface";
import { Chess, validateFen } from "chess.js";
import { aiMove, Game } from "js-chess-engine";

class ChessSocket implements MySocketInterface {
  private chess;
  private game;
  private socket;

  handleConnection(socket: Socket) {
    socket.emit("ping", true);

    this.chess = new Chess();
    this.game = new Game();
    this.socket = socket;

    this.update();

    socket.on("moving", (square) => {
      socket.emit("showMoves", {
        moves: this.chess.moves({ square, verbose: true }),
      });
    });

    socket.on("moves", () => {
      socket.emit("showMoves", {
        moves: this.getPlayersMoves(),
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
        this.chess.move(event);
      } catch (err) {
        console.log("failed move", event);
        console.error(err);
        failed = true;
      }

      this.update();
    });
    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  getPlayersMoves(player = "w") {
    const fen = this.chess.fen();
    const splitFen = fen.split(" ");
    splitFen[1] = player;
    const newFen = splitFen.join(" ");
    console.log("newFen", newFen);
    validateFen(newFen);
    const temp = new Chess(newFen);
    return temp.moves({ verbose: true });
  }

  update() {
    this.socket.emit("update", {
      board: this.chess.board(),
      moves: this.getPlayersMoves(),
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
    console.log(this.chess.ascii());
  }

  middlewareImplementation(socket: Socket, next) {
    //Implement your middleware for orders here
    return next();
  }
}

export default ChessSocket;
