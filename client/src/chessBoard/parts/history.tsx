import { useChessBoardContext } from "../gameContext";

const History = () => {
  const { State } = useChessBoardContext();
  return (
    <div className="historySection">
      {State.game.history.map((move, index) => {
        const ind = index + 1;
        if (ind % 2 === 0 && ind < State.game.history.length) {
          return null;
        }
        const whiteMove = State?.game.history?.[index];
        const blackMove = State?.game.history?.[index + 1];

        if (!whiteMove || !blackMove) {
          return null;
        }

        const { lan: wLan } = whiteMove;
        const { lan: bLan } = blackMove;

        if (!wLan || !bLan) {
          throw new Error("Server did not return all needed parts in history");
        }

        // const blackMoveHref = wFen
        //   ? window.location.origin + "/" + encodeURIComponent(wFen)
        //   : null;
        // const whiteMoveHref = bFen
        //   ? window.location.origin + "/" + encodeURIComponent(bFen)
        //   : null;

        return (
          <div key={`${wLan}:${bLan}`} className="historyRow">
            <div>
              <span>{wLan}</span>
            </div>
            <div>
              <span>{bLan}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
