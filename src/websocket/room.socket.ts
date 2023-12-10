import { Socket } from "socket.io";
import SocketInterface from "./socketInterface";
import Websocket from "./websocket";
import { Chess, validateFen } from "chess.js";

class RoomSocket implements SocketInterface {
  private chess;
  private socket;
  private io: Websocket;
  private rooms = {};

  constructor(io: Websocket) {
    this.io = io;
  }

  handleConnection(socket: Socket) {
    socket.emit("ping", true);
    console.log("connected: ", socket.id, "to room");

    this.chess = new Chess();
    this.socket = socket;

    socket.on("joinroom", function (room) {
      console.log(`${socket.id} joining`, room);
      // only allow certain characters in room names
      // to prevent messing with socket.io internal rooms
      if (!/[^\w.]/.test(room)) {
        this.join(room);
      }
      if (typeof this.rooms[room] === "undefined") this.rooms[room] = {};
      this.rooms[room].count = this.rooms[room].total
        ? this.rooms[room].total + 1
        : 1;
      socket.to(room).emit("joined room", this.rooms[room].count);
      socket.to(room).emit("update", this.update());
    });
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
    return update;
  }

  middlewareImplementation(socket: Socket, next) {
    return next();
  }
}

export default RoomSocket;
