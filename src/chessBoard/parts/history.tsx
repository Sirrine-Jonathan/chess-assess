import { Left, Right } from "../pieces/svg";
import { useGame } from "../state/game/useGame";
import clsx from "clsx";

const History = () => {
  const { gameState, Actions } = useGame();
  return (
    <div className="historySection">
      <div className="historyNav">
        <button
          type="button"
          className="historyNavBtn historyNavBackward"
          disabled={!Actions.checkNav(-1)}
          onClick={() => Actions.nav(-1)}
        >
          <Left />
        </button>
        <button
          type="button"
          className="historyNavBtn historyNavForward"
          disabled={!Actions.checkNav(1)}
          onClick={() => Actions.nav(1)}
        >
          <Right />
        </button>
      </div>
      <div className="historyGrid">
        {gameState.history.map((move, index) => {
          const { lan } = move;

          return (
            <div className="historyGridCol">
              <div
                className={clsx(
                  index === gameState.navIndex && "active",
                  "navMove"
                )}
                onClick={() => {
                  Actions.navTo(index);
                }}
              >
                {lan}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
