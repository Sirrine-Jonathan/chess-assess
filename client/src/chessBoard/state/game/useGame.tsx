import type { Square, PieceSymbol } from "chess.js";
import { useEffect } from "react";
import { useContext, useMemo } from "react";
import { GameContext } from "./context";
import { ActionTypeNames } from "./reducer";
import { useSelection } from "../selection/useSelection";
import { Game } from "./game";
import { Bot } from "./bot";

const game = new Game();
const bot = new Bot();

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
        console.log(update.ascii);
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
