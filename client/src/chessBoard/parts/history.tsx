import { useChessBoardContext } from "../gameContext";

const History = () => {
  const { State } = useChessBoardContext();
  return (
    <div className="historySection">
      {State.history.map((move, index) => {
        const ind = index + 1;
        return ind % 2 !== 0 && ind < State.history.length ? (
          <div className="historyRow">
            <div>{State.history[index].lan}</div>
            <div>{State.history[index + 1].lan}</div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default History;
