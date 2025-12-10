import React from "react";
import "./styles.scss";

interface TabProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  tabId: number;
  activeTab: number;
  setActiveTab: (val: number) => void;
}

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const { children, tabId, activeTab, setActiveTab } = props;

  return (
    <button
      type="button"
      className={`tab ${activeTab === tabId ? "active" : ""}`}
      onClick={() => setActiveTab(tabId)}
    >
      {children}
    </button>
  );
};

export default Tab;
