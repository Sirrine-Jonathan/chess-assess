import type { Color } from "chess.js";
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
            {State.blackCaptured.map((piece, index) => (
              <span
                className="capturedPiece blackCapturedPiece"
                style={{
                  maxWidth: `${
                    100 /
                    (State.blackCaptured.length + State.whiteCaptured.length)
                  }%`,
                  ...(index + 1 === State.blackCaptured.length
                    ? { marginRight: "auto" }
                    : {}),
                }}
              >
                <Piece color={"b" as Color} type={piece} />
              </span>
            ))}

            {State.whiteCaptured.map((piece, index) => (
              <div
                className="capturedPiece whiteCapturedPiece"
                style={{
                  maxWidth: `${
                    100 /
                    (State.blackCaptured.length + State.whiteCaptured.length)
                  }%`,
                  ...(index === 0 ? { marginLeft: "auto" } : {}),
                }}
              >
                <Piece color={"w" as Color} type={piece} />
              </div>
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
