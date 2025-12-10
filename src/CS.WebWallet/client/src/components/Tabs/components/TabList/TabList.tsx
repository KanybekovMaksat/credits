import React from "react";
import "./styles.scss";
import Tab from "./components/Tab";

interface TabListProps {
  tabs: (string | number | JSX.Element)[];
  activeTab: number;
  setActiveTab: (val: number) => void;
}

const TabList: React.FC<TabListProps> = (props: TabListProps) => {
  const { tabs, activeTab, setActiveTab } = props;
  const [current, setTab] = React.useState(activeTab);

  const changeTab = (e: number) => {
    setTab(e);
    setActiveTab(e);
  };

  return (
    <div className="tab_list_wrapper">
      <div className="tab_list">
        {tabs.map((tabContent, index) => (
          <Tab
            tabId={index}
            key={index}
            activeTab={current}
            setActiveTab={(e) => changeTab(e)}
          >
            {tabContent}
          </Tab>
        ))}
      </div>
    </div>
  );
};

export default TabList;
