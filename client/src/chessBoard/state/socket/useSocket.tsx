import { connect } from "./connect";
import { useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "./context";

const { socket, room } = connect();

const useSocket = () => {
  const { socketState, setSocketState } = useContext(SocketContext);

  useEffect(() => {
    if (!socketState.isConnected) {
      socket.connect();
    }

    function onConnect() {
      setSocketState({ ...socketState, isConnected: true });
    }

    function onDisconnect() {
      setSocketState({ ...socketState, isConnected: false });
    }

    // function onUpdate(update: GameUpdate) {
    //   Actions.performUpdate(update);

    //   const fenPart = encodeURIComponent(update.fen);
    //   const computerUrl = [window.location.origin, "computer", fenPart].join(
    //     "/"
    //   );

    //   const roomUrl = [window.location.origin, "room", room].join("/");

    //   window.history.replaceState(null, "", room ? roomUrl : computerUrl);
    // }

    // function onCapture(event: CaptureEvent) {
    //   Actions.setColorCaptured(event);
    // }

    // function onLoadSuccess(details: {
    //   blackCaptured: PieceSymbol[];
    //   whiteCaptured: PieceSymbol[];
    // }) {
    //   Actions.setLoadDetails(details);
    // }

    // function onShowActiveMoves(moves: Move[]) {
    //   Actions.setActiveMoves(moves);
    // }

    // function onMoveEnded(move: Move) {
    //   Actions.setActivePiece(null);
    //   Actions.setActiveMoves([]);
    //   Actions.setLastMove(move);
    // }

    function onPing(id) {
      console.log("connection id", id);
    }

    function onPlayerJoined(joinedAs) {
      console.log(`${joinedAs} joined`);
    }

    function onJoined(role) {
      console.log(`joined as ${role}`);
      setSocketState({ ...socketState, role });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ping", onPing);
    socket.on("player_joined", onPlayerJoined);
    socket.on("joined", onJoined);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("ping", onPing);
      socket.off("player_joined", onPlayerJoined);
      socket.off("joined", onJoined);
    };
  });

  return { socket, room, ...socketState };
};

export { useSocket };
