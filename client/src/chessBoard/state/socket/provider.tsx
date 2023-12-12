import type { ReactNode } from "react";
import { useState, useMemo } from "react";
import { initialState, SocketContext } from "./context";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socketState, setSocketState] = useState<SocketState>(initialState);

  const contextValue = useMemo(
    () => ({
      socketState,
      setSocketState,
    }),
    [socketState, setSocketState]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
