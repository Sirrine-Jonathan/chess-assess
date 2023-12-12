import { useReducer, useMemo, useEffect, type ReactNode } from "react";
import { reducer } from "./reducer";
import { initialState, GameContext } from "./context";

const getPlayerColor = (role: GameRole) => {
  if (role === "black") {
    return "b";
  }
  if (role === "white") {
    return "w";
  }
  return null;
};

export const GameProvider = ({
  fen,
  role,
  isComputerGame,
  children,
}: {
  fen?: string;
  role: GameRole;
  isComputerGame: boolean;
  children: ReactNode;
}) => {
  const [gameState, dispatch] = useReducer(reducer, {
    ...initialState,
    playerColor: getPlayerColor(role),
    isComputerGame,
  });

  const contextValue = useMemo(
    () => ({ gameState, dispatch }),
    [gameState, dispatch]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
