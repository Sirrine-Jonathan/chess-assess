import { Controls } from "./controls";
import Turn from "./turn";
import History from "./history";

const Sidebar = () => {
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
