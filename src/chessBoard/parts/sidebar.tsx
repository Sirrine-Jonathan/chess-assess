import type { Color } from "chess.js";
import React from "react";
import { Controls } from "./controls";
import Turn from "./turn";
import History from "./history";
import Piece from "../pieces/Piece";
import { useGame } from "../state/game/useGame";

const Sidebar = () => {
  const { gameState } = useGame();
  return (
    <div className="sidebar">
      <div className="information sidebarSection ">
        <Turn />
        <div className="sidebarSubSection sidebarCaptureArea">
          <div className="captureArea capturedPieces">
            {gameState.blackCaptured.map((piece, index) => (
              <span
                className="capturedPiece blackCapturedPiece"
                style={{
                  maxWidth: `${
                    100 /
                    (gameState.blackCaptured.length +
                      gameState.whiteCaptured.length)
                  }%`,
                  ...(index + 1 === gameState.blackCaptured.length
                    ? { marginRight: "auto" }
                    : {}),
                }}
              >
                <Piece color={"b" as Color} type={piece} />
              </span>
            ))}

            {gameState.whiteCaptured.map((piece, index) => (
              <div
                className="capturedPiece whiteCapturedPiece"
                style={{
                  maxWidth: `${
                    100 /
                    (gameState.blackCaptured.length +
                      gameState.whiteCaptured.length)
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
    </div>
  );
};

export default Sidebar;
