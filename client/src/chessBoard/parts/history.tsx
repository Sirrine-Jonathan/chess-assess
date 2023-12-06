import { useChessBoardContext } from "../gameContext";

const History = () => {
  const { State } = useChessBoardContext();
  return (
    <div className="historySection">
      {State.history.map((move, index) => {
        const ind = index + 1;
        const firstHref =
          window.location.origin +
          "/" +
          encodeURIComponent(State.history[index].fen);
        const secondHref =
          window.location.origin +
          "/" +
          encodeURIComponent(State.history[index + 1].fen);
        return ind % 2 !== 0 && ind < State.history.length ? (
          <div className="historyRow">
            <div>
              <a href={firstHref}>{State.history[index].lan}</a>
            </div>
            <div>
              <a href={secondHref}>{State.history[index + 1].lan}</a>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default History;
