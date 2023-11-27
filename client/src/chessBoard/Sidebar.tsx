import Content from "./Controls";
import Turn from "./parts/turn";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="information sidebarSection">
        <Turn />
      </div>
      <Content />
    </div>
  );
};

export default Sidebar;
