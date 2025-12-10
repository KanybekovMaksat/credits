import React from "react";
import "./styles.scss";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = (props: DividerProps) => {
  const { className } = props;
  return <div className={className ? className : "row-divider"} />;
};

export default Divider;
