import { Controls } from "./controls";
import Turn from "./turn";
import History from "./history";
import { useGame } from "../state/game/useGame";

const Sidebar = () => {
  const { gameState } = useGame();
  return (
    <div className="sidebar">
      <div className="information sidebarSection ">
        <Turn />
      </div>
      <Controls />
      <History />
    </div>
  );
};

export default Sidebar;
