import { Socket } from "socket.io";
import SocketInterface from "./socketInterface";
import Websocket from "./websocket";
import { Chess, validateFen } from "chess.js";
import Bot from "../libs/bot";

class ChessSocket implements SocketInterface {
  private chess;
  private bot;
  private socket;
  private io: Websocket;

  handleConnection(socket: Socket) {
    // handle

    // Handle updates after a requests a move
    socket.on("move", (playerMove) => {});

    // Load a game via fen
    socket.on("load", (fen) => {});

    socket.on("disconnect", async () => {
      console.log("Disconnected", socket.id);
      socket.emit("ping", false);
    });
  }

  middlewareImplementation(socket: Socket, next) {
    return next();
  }
}

export default ChessSocket;
