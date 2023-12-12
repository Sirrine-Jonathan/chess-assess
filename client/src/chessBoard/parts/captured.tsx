import { Color } from "chess.js";
import Piece from "../pieces/Piece";
import { useGame } from "../state/game/useGame";

export const WhiteCaptured = () => {
  const { gameState } = useGame();
  return (
    <div className="captureArea">
      {gameState.whiteCaptured.map((piece) => (
        <Piece color={"w" as Color} type={piece} />
      ))}
    </div>
  );
};

export const BlackCaptured = () => {
  const { gameState } = useGame();
  return (
    <div className="captureArea">
      {gameState.blackCaptured.map((piece) => (
        <Piece color={"b" as Color} type={piece} />
      ))}
    </div>
  );
};
