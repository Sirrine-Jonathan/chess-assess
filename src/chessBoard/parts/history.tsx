import { useGame } from "../state/game/useGame";

const History = () => {
  const { gameState } = useGame();
  return (
    <div className="historySection">
      {gameState.history.map((move) => {
        const { lan } = move;

        return <div>{lan}</div>;
      })}
    </div>
  );
};

export default History;
