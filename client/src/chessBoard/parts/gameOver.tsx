import { useGame } from "../state/game/useGame";
import CheckButton from "./checkButton";
import clsx from "clsx";

const GameOver = () => {
  const { gameState } = useGame();
  const getReason = () => {
    if (gameState.isGameOver) {
      if (gameState.isCheckmate) {
        return `Checkmate. ${gameState.turn === "w" ? "Black" : "White"} wins!`;
      } else if (gameState.isDraw) {
        return "Draw";
      } else if (gameState.isStalemate) {
        return "Stalemate";
      }
    }
    return null;
  };
  return (
    <div
      className={clsx([
        "stateDisplay",
        gameState.isGameOver ? "obscure" : "hide",
      ])}
    >
      <div className="gameOver">
        <div className="gameOverTitle">Game Over</div>
        <div className="gameOverReason">{getReason()}</div>
        <div className="centerRow">
          <CheckButton
            label="New Game"
            onClick={() => {
              window.location.href = window.origin;
            }}
            classes="gameOverResetButton dark"
          />
        </div>
      </div>
    </div>
  );
};

export default GameOver;
