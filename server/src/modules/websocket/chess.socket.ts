import { Socket } from "socket.io";
import MySocketInterface from "./mySocketInterface";
import { Chess } from "chess.js";

class ChessSocket implements MySocketInterface {
  private chess;

  handleConnection(socket: Socket) {
    this.chess = new Chess();
    console.log(this.chess.moves());

    socket.emit("ping", true);
    socket.emit("update", {
      board: this.chess.board(),
      moves: this.chess.moves({ verbose: true }),
      ascii: this.chess.ascii(),
      turn: this.chess.turn(),
    });

    socket.on("dragStart", (event) => {
      console.log("dragStart", event);
      const moves = this.chess.moves({ square: "e2", verbose: true });
      socket.emit("showMoves", { moves });
    });

    socket.on("dragEnd", (event) => {
      try {
        this.chess.move(event);
      } catch (err) {
        console.log("failed move", event);
        console.error(err);
      }

      socket.emit("update", {
        board: this.chess.board(),
        moves: this.chess.moves({ color: "w", verbose: true }),
        ascii: this.chess.ascii(),
        turn: this.chess.turn(),
      });
      console.log(this.chess.ascii());
    });
    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  middlewareImplementation(socket: Socket, next) {
    //Implement your middleware for orders here
    return next();
  }
}

export default ChessSocket;
