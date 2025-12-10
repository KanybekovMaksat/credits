import React, { ReactElement, ReactNode } from "react";

interface TabPaneProps {
  tab: string | number | ReactNode;
  key?: React.Key;
  children: ReactElement;
}

const TabPane: React.FC<TabPaneProps> = ({ tab, key, children }) => {
  return React.cloneElement(children as ReactElement, {
    key: key,
    tab: tab,
  });
};

export default TabPane;
