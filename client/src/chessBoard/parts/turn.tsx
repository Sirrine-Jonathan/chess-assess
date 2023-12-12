import { useIsMobile } from "../../hooks/useIsMobile";
import { KW, KB } from "../pieces/svg";
import clsx from "clsx";
import { useGame } from "../state/game/useGame";

const Turn = () => {
  const { gameState } = useGame();
  const isMobile = useIsMobile();
  return (
    <div className={clsx(["turnDisplay", isMobile && "isMobile"])}>
      <div
        className={clsx(["turnIconBorder", gameState.turn === "w" && "isTurn"])}
      >
        <KW className={clsx(["turnIcon turnIconWhite"])} />
      </div>
      <div
        className={clsx(["turnIconBorder", gameState.turn === "b" && "isTurn"])}
      >
        <KB className={clsx(["turnIcon turnIconBlack"])} />
      </div>
    </div>
  );
};

export default Turn;
