import React, { ReactChild } from "react";
import "./styles.scss";

type className =
  | "justify_end"
  | "justify_start"
  | "justify_space_between"
  | string;

interface ColProps {
  children?: ReactChild | ReactChild[] | undefined;
  className?: className;
  style?: React.CSSProperties;
  width?: string;
  height?: string;
}

const Col: React.FC<ColProps> = (props: ColProps) => {
  const { children, className, style, width, height } = props;
  return (
    <div
      className={`col ${className ? className : ""}`}
      style={{ ...style, width, height }}
    >
      {children}
    </div>
  );
};

export default Col;
