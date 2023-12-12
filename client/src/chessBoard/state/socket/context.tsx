import { createContext } from "react";

export const initialState = {
  isConnected: false,
  role: "spectator" as SocketState["role"],
};

export const SocketContext = createContext<{
  socketState: SocketState;
  setSocketState: (socketState: SocketState) => void;
}>({
  socketState: initialState,
  setSocketState: (state: SocketState) => null,
});
