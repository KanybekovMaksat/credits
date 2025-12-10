import React, { ReactElement } from "react";
import "./styles.scss";

interface TabContentProps {
  contentId: number;
  children?: string | number | ReactElement | ReactElement[];
  activeTab: number;
}

const TabContent: React.FC<TabContentProps> = (props: TabContentProps) => {
  const { children, contentId, activeTab } = props;

  const hidden = contentId !== activeTab;
  const styles = {
    display: hidden ? "none" : "",
  };
  return (
    <div className="tabs_content" aria-hidden={hidden} style={styles}>
      {!hidden && children}
    </div>
  );
};

export default TabContent;
