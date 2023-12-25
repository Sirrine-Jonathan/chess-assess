import { Color } from "chess.js";
import Piece from "../pieces/Piece";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import { getGameType, getLevel, GameType } from "../../utils";
import clsx from "clsx";

const type = getGameType();
const enemy =
  type === GameType.Trainer ? "Trainer" : `Stockfish level ${getLevel()}`;

export const WhiteCaptured = ({ isTop }: { isTop?: boolean }) => {
  const { gameState } = useGame();
  const { Options } = useOptions();
  const black = gameState.playerColor === "b" ? "You" : enemy;

  const above =
    gameState.playerColor === "w" ? Options.flipBoard : !Options.flipBoard;

  return (
    <div className={clsx("captureArea", isTop && "captureArea--top")}>
      <div className="capturerName">Black: {black}</div>
      <div>
        {gameState.whiteCaptured.map((piece) => (
          <Piece color={"w" as Color} type={piece} />
        ))}
      </div>
    </div>
  );
};

export const BlackCaptured = ({ isTop }: { isTop?: boolean }) => {
  const { gameState } = useGame();
  const { Options } = useOptions();
  const white = gameState.playerColor === "w" ? "You" : enemy;

  const above =
    gameState.playerColor === "b" ? Options.flipBoard : !Options.flipBoard;

  return (
    <div className={clsx("captureArea", isTop && "captureArea--top")}>
      <div className="capturerName">White: {white}</div>
      <div>
        {gameState.blackCaptured.map((piece) => (
          <Piece color={"b" as Color} type={piece} />
        ))}
      </div>
    </div>
  );
};
