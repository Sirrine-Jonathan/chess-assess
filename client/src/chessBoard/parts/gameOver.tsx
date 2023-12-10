import { useChessBoardContext } from "../gameContext";
import CheckButton from "./checkButton";
import clsx from "clsx";

const GameOver = () => {
  const { State } = useChessBoardContext();
  const getReason = () => {
    if (State.game.isGameOver) {
      if (State.game.isCheckmate) {
        return `Checkmate. ${
          State.game.turn === "w" ? "Black" : "White"
        } wins!`;
      } else if (State.game.isDraw) {
        return "Draw";
      } else if (State.game.isStalemate) {
        return "Stalemate";
      }
    }
    return null;
  };
  return (
    <div
      className={clsx([
        "stateDisplay",
        State.game.isGameOver ? "obscure" : "hide",
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
