import { useChessBoardContext } from "../gameContext";
import useIsMobile from "../hooks/useIsMobile";
import { KW, KB } from "../pieces/svg";
import clsx from "clsx";

const Turn = () => {
  const { State } = useChessBoardContext();
  const isMobile = useIsMobile();
  return (
    <div className={clsx(["turnDisplay", isMobile && "isMobile"])}>
      <div className={clsx(["turnIconBorder", State.turn === "w" && "isTurn"])}>
        <KW className={clsx(["turnIcon turnIconWhite"])} />
      </div>
      <div className={clsx(["turnIconBorder", State.turn === "b" && "isTurn"])}>
        <KB className={clsx(["turnIcon turnIconBlack"])} />
      </div>
    </div>
  );
};

export default Turn;
