import React, { ReactElement, useState } from "react";
import "./styles.scss";
import TabList from "./components/TabList";
import TabContent from "./components/TabContent";

interface TabsProps {
  defaultActiveTab?: number;
  children?: ReactElement | ReactElement[];
}

const Tabs: React.FC<TabsProps> = ({ children, defaultActiveTab = 0 }) => {
  const [activeTab, setActiveTab] = useState<number>(defaultActiveTab);

  const tabsNames = children
    ? React.Children.map(children, (child: ReactElement) => child?.props.tab)
    : [];

  return (
    <div className="tabs">
      <TabList
        tabs={tabsNames}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="tab_content_area">
        {children &&
          React.Children.map(children, (child: ReactElement, index) => {
            return (
              <TabContent contentId={index} activeTab={activeTab}>
                {child?.props.children}
              </TabContent>
            );
          })}
      </div>
    </div>
  );
};

export default Tabs;
