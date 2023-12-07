import { useChessBoardContext } from "../gameContext";
import { KW, KB } from "../pieces/svg";
import clsx from "clsx";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Turn = () => {
  const { State } = useChessBoardContext();
  const isMobile = useWindowDimensions().width <= 768;
  return (
    <div className={clsx(["turnDisplay", isMobile && "isMobile"])}>
      <div
        className={clsx([
          "turnIconBorder",
          State.game.turn === "w" && "isTurn",
        ])}
      >
        <KW className={clsx(["turnIcon turnIconWhite"])} />
      </div>
      <div
        className={clsx([
          "turnIconBorder",
          State.game.turn === "b" && "isTurn",
        ])}
      >
        <KB className={clsx(["turnIcon turnIconBlack"])} />
      </div>
    </div>
  );
};

export default Turn;
