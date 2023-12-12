import { useGame } from "../state/game/useGame";

const History = () => {
  const { gameState } = useGame();
  return (
    <div className="historySection">
      {gameState.history.map((move, index) => {
        const ind = index + 1;
        if (ind % 2 === 0 && ind < gameState.history.length) {
          return null;
        }
        const whiteMove = gameState.history?.[index];
        const blackMove = gameState.history?.[index + 1];

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
