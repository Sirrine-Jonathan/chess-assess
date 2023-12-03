import { useChessBoardContext } from "../gameContext";
import ResetButton from "./resetButton";
import clsx from "clsx";

const GameOver = () => {
  const { State } = useChessBoardContext();
  const getReason = () => {
    if (State.isGameOver) {
      if (State.isCheckmate) {
        return `Checkmate. ${State.turn === "w" ? "Black" : "White"} wins!`;
      } else if (State.isDraw) {
        return "Draw";
      } else if (State.isStalemate) {
        return "Stalemate";
      }
    }
    return null;
  };
  if (!State.isGameOver) {
    return null;
  }
  return (
    <div className={clsx(["stateDisplay"])}>
      <div className="gameOver">
        <div className="gameOverTitle">Game Over</div>
        <div className="gameOverReason">{getReason()}</div>
        <div className="centerRow">
          <ResetButton />
        </div>
      </div>
    </div>
  );
};

export default GameOver;
