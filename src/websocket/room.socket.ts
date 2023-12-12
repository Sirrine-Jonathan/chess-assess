import { Socket } from "socket.io";
import SocketInterface from "./socketInterface";

class RoomSocket implements SocketInterface {
  private rooms = {};

  addPersonToRoom = (room, id) => {
    if (!this.rooms[room]) {
      this.rooms[room] = { white: null, black: null, spectators: [] };
    }
    console.log(`${id} joining ${room}`, this.rooms[room]);
    if (this.rooms[room].white && this.rooms[room].black) {
      this.rooms[room].spectators.push(id);
      return "spectator";
    } else if (this.rooms[room].white && !this.rooms[room].black) {
      this.rooms[room].black = id;
      return "black";
    } else if (!this.rooms[room].white && this.rooms[room].black) {
      this.rooms[room].white = id;
      return "white";
    } else {
      if (Math.random() < 0.5) {
        this.rooms[room].white = id;
        return "white";
      } else {
        this.rooms[room].black = id;
        return "black";
      }
    }
  };

  handleConnection(socket: Socket) {
    socket.emit("ping", socket.id);

    const room = socket.handshake.query.room;
    console.log("connected:", socket.id);

    if (!Array.isArray(room) && !/[^\w.]/.test(room)) {
      socket.join(room);
      const joinedAs = this.addPersonToRoom(room, socket.id);
      console.log("room", this.rooms[room]);
      socket.emit("joined", joinedAs);
      socket.to(room).emit("player_joined", joinedAs);
    }

    socket.on("move", (move) => {
      socket.to(room).emit("opponent_moved", move);
    });
  }

  middlewareImplementation(socket: Socket, next) {
    return next();
  }
}

export default RoomSocket;
