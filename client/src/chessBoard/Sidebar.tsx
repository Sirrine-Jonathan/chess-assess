import type { PieceColor } from "./chessTypes";
import Controls from "./Controls";
import Turn from "./parts/turn";
import History from "./parts/history";
import Piece from "./pieces/Piece";
import { useChessBoardContext } from "./gameContext";

const Sidebar = () => {
  const { State } = useChessBoardContext();
  return (
    <div className="sidebar">
      <div className="information sidebarSection ">
        <Turn />
        <div className="sidebarSubSection sidebarCaptureArea">
          <div className="captureArea capturedPieces">
            {State.blackCaptured.map((piece) => (
              <Piece color={"b" as PieceColor} type={piece} />
            ))}
          </div>
          <div className="captureArea enemyCapturedPieces">
            {State.whiteCaptured.map((piece) => (
              <Piece color={"w" as PieceColor} type={piece} />
            ))}
          </div>
        </div>
      </div>
      <Controls />
      <History />
    </div>
  );
};

export default Sidebar;
