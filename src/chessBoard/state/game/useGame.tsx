import type { Square, PieceSymbol, Move, Color } from "chess.js";
import {
  useEffect,
  useRef,
  useReducer,
  createContext,
  type ReactNode,
} from "react";
import React, { useContext, useMemo } from "react";
import { ActionTypeNames } from "./reducer";
import { useSelection } from "../selection/useSelection";
import { reducer } from "./reducer";
import { writeFen, GameType } from "../../../utils";

import type { Dispatch } from "react";
import { DEFAULT_POSITION } from "chess.js";
import { ActionType } from "./reducer";

import { Game } from "./game";
import { Bot } from "./bot";

const game = new Game();
let bot: InstanceType<typeof Bot>;

export const botDelay = 1000;

export const initialState: GameState = {
  playerColor: "w",
  ascii: "",
  board: [],
  conflict: null,
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
  nav: [],
  skillLevel: 20, // 0 - 20
  type: GameType.Trainer,
};

const GameContext = createContext<{
  gameState: GameState;
  dispatch: Dispatch<ActionType>;
}>({
  gameState: initialState,
  dispatch: () => null,
});

export const GameProvider = ({
  fen,
  color,
  level,
  children,
}: {
  fen: string;
  color: Color;
  type: GameType;
  level: number;
  children: ReactNode;
}) => {
  const needsLoading = useRef(true);

  if (needsLoading.current && fen) {
    game.load(fen);
    needsLoading.current = false;
  }

  const [gameState, dispatch] = useReducer(reducer, {
    ...initialState,
    playerColor: color,
    skillLevel: level,
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
  const { selectionState, selectionActions } = useSelection();

  useEffect(() => {
    const activeSquare = selectionState.activePiece?.from;
    const activeMoves = activeSquare ? game.getActiveMoves(activeSquare) : [];
    actions.setActiveMoves(activeMoves);
  }, [selectionState.activePiece]);

  const actions = useMemo(() => {
    return {
      move: (move: Pick<Move, "to" | "from">) => {
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
      computerMove: async () => {
        const fen = game.getFen();
        if (!bot) {
          console.log("initializing bot", gameState.skillLevel);
          bot = new Bot(gameState.skillLevel);
        }
        let move = await bot.getMove(fen, game.getMoves());
        if (move) {
          const captured = game.move(move);
          return { captured, move };
        }
        return false;
      },
      performUpdate: () => {
        const update = game.getUpdate();
        writeFen(update.fen);
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
      setLastMove: (move: Pick<Move, "to" | "from">) => {
        dispatch({
          type: ActionTypeNames.SetLastMove,
          payload: move,
        });
      },
    };
  }, [gameState, dispatch]);

  return { gameState, Actions: actions };
};
