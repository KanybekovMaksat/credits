import React, { ReactChild } from "react";
import "./styles.scss";

type className =
  | "justify_end"
  | "justify_start"
  | "justify_space_between"
  | "wrap"
  | string;

interface RowProps {
  children?: ReactChild | ReactChild[] | undefined;
  className?: className;
  style?: React.CSSProperties;
  width?: string;
  height?: string;
}

const Row: React.FC<RowProps> = (props: RowProps) => {
  const { children, className, style, width, height } = props;
  return (
    <div
      className={`row ${className ? className : ""}`}
      style={{ ...style, width, height }}
    >
      {children}
    </div>
  );
};

export default Row;
