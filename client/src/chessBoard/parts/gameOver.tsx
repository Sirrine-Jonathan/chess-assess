import { useChessBoardContext } from "../gameContext";

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
  return (
    <div className="stateDisplay">
      {State.isGameOver ? (
        <div className="gameOver">
          <div className="gameOverTitle">GameOver</div>
          <div className="gameOverReason">{getReason()}</div>
        </div>
      ) : null}
    </div>
  );
};

export default GameOver;
