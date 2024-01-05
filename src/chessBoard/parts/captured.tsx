import { Color, PieceSymbol } from "chess.js";
import Piece from "../pieces/Piece";
import { useGame } from "../state/game/useGame";
import { useOptions } from "../state/options/useOptions";
import { getGameType, getLevel, GameType } from "../../utils";
import clsx from "clsx";

const type = getGameType();
const enemy =
  type === GameType.Trainer ? "Trainer" : `Stockfish level ${getLevel()}`;

export const WhiteCaptured = ({ isTop }: { isTop?: boolean }) => {
  const { gameState, Actions } = useGame();
  const black = gameState.playerColor === "b" ? "You" : enemy;

  const score = Actions.getPoints();
  const advantage = score.white - score.black;
  const advantageStr = advantage > 0 ? ` +${advantage}` : "";

  return (
    <div className={clsx("captureArea", isTop && "captureArea--top")}>
      <div className="capturerName">
        Black{advantageStr}, defending {Actions.getNumberOfDefended().black}{" "}
        squares
      </div>
      <div>
        {gameState.whiteCaptured.map((piece) => (
          <Piece color={"w" as Color} type={piece} />
        ))}
      </div>
    </div>
  );
};

export const BlackCaptured = ({ isTop }: { isTop?: boolean }) => {
  const { gameState, Actions } = useGame();
  const white = gameState.playerColor === "w" ? "You" : enemy;

  const score = Actions.getPoints();
  const advantage = score.black - score.white;
  const advantageStr = advantage > 0 ? ` +${advantage}` : "";

  return (
    <div className={clsx("captureArea", isTop && "captureArea--top")}>
      <div className="capturerName">
        White{advantageStr}, defending {Actions.getNumberOfDefended().white}{" "}
        squares
      </div>
      <div>
        {gameState.blackCaptured.map((piece) => (
          <Piece color={"b" as Color} type={piece} />
        ))}
      </div>
    </div>
  );
};
