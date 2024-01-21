import { Controls } from "./controls";
import { LayerQuickControls } from "./LayerQuickControls";
import History from "./history";
import { Opening } from './opening'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="information sidebarSection ">
        <LayerQuickControls />
        <Opening />
      </div>
      <Controls />
      <History />
    </div>
  );
};

export default Sidebar;
