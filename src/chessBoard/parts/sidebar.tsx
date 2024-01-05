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
      </div>
      <Controls />
    </div>
  );
};

export default Sidebar;
