import type { Square, PieceSymbol } from "chess.js";
import { useEffect, useRef, useReducer, type ReactNode } from "react";
import { useContext, useMemo } from "react";
import { ActionTypeNames } from "./reducer";
import { useSelection } from "../selection/useSelection";
import { reducer } from "./reducer";

import type { Dispatch } from "react";
import { DEFAULT_POSITION } from "chess.js";
import { createContext } from "react";
import { ActionType } from "./reducer";

import { Game } from "./game";
import { Bot } from "./bot";

const game = new Game();
const bot = new Bot();

export const initialState: GameState = {
  playerColor: "w",
  ascii: "",
  board: [],
  conflict: {},
  moves: [],
  turn: "w",
  inCheck: false,
  isCheckmate: false,
  isDraw: false,
  isInsufficientMaterial: false,
  isGameOver: false,
  isStalemate: false,
  isThreefoldRepetition: false,
  fen: DEFAULT_POSITION,
  history: [],
  whiteCaptured: [],
  blackCaptured: [],
  lastMove: null,
  activeMoves: [],
  isComputerGame: true,
  botDelay: 1000,
};

const GameContext = createContext<{
  gameState: GameState;
  dispatch: Dispatch<ActionType>;
}>({
  gameState: initialState,
  dispatch: () => null,
});

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
  fen: string;
  role: GameRole;
  isComputerGame: boolean;
  children: ReactNode;
}) => {
  const needsLoading = useRef(true);

  if (needsLoading.current && fen) {
    console.log("loading once");
    game.load(fen);
    needsLoading.current = false;
  }

  const [gameState, dispatch] = useReducer(reducer, {
    ...initialState,
    playerColor: getPlayerColor(role),
    isComputerGame,
    ...game.getUpdate(),
  });

  const contextValue = useMemo(
    () => ({ gameState, fen, dispatch }),
    [gameState, fen, dispatch]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export const useGame = () => {
  const { gameState, dispatch } = useContext(GameContext);
  const { selectionState } = useSelection();

  useEffect(() => {
    const activeSquare = selectionState.activePiece?.from;
    const activeMoves = activeSquare ? game.getActiveMoves(activeSquare) : [];
    actions.setActiveMoves(activeMoves);
  }, [selectionState.activePiece]);

  const actions = useMemo(() => {
    return {
      move: (move: BaseMove) => {
        const finalMove = { ...move } as {
          to: Square;
          from: Square;
          promotion: "p" | "n" | "b" | "r" | "q" | "k";
        };

        const fromPiece = gameState.board
          .flat()
          .find((place) => place && move.from === place.square);
        if (fromPiece?.type === "p") {
          const file = move.to.split("")[1];
          if (file === "8" || file === "1") {
            finalMove.promotion = "q";
          }
        }
        const captured = game.move(finalMove);
        return captured;
      },
      computerMove: () => {
        const move = bot.pickRandomMove(game.getMoves());
        if (move) {
          const captured = game.move(move);
          return { captured, move };
        }
        return false;
      },
      performUpdate: () => {
        const update = game.getUpdate();
        if (gameState.isComputerGame) {
          const fenPart = encodeURIComponent(update.fen);
          const computerUrl = [
            window.location.origin,
            "computer",
            fenPart,
          ].join("/");
          window.history.replaceState(null, "", computerUrl);
        }
        dispatch({
          type: ActionTypeNames.PerformUpdate,
          payload: update,
        });
      },
      setColorCaptured: (event: CaptureEvent) => {
        const { whiteCaptured, blackCaptured } = gameState;
        let capturedCopy =
          event.color === "w" ? [...whiteCaptured] : [...blackCaptured];
        capturedCopy = [...capturedCopy, event.piece];
        dispatch({
          type: ActionTypeNames.SetColorCaptured,
          payload: {
            color: event.color,
            captured: capturedCopy,
          },
        });
      },
      setLoadDetails: (details: {
        blackCaptured: PieceSymbol[];
        whiteCaptured: PieceSymbol[];
      }) => {
        dispatch({
          type: ActionTypeNames.SetCaptured,
          payload: details,
        });
      },
      setActiveMoves: (moves: Move[]) => {
        dispatch({
          type: ActionTypeNames.SetActiveMoves,
          payload: moves,
        });
      },
      setLastMove: (move: BaseMove) => {
        dispatch({
          type: ActionTypeNames.SetLastMove,
          payload: move,
        });
      },
    };
  }, [gameState, dispatch]);

  return { gameState, Actions: actions };
};
