import { Controls } from "./controls";
import { LayerQuickControls } from "./LayerQuickControls";
import History from "./history";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="information sidebarSection ">
        <LayerQuickControls />
      </div>
      <Controls />
      <History />
    </div>
  );
};

export default Sidebar;
