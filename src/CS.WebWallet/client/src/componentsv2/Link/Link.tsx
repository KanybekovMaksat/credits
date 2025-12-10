import React from "react";
import "./styles.scss";

export interface LinkProps {
  onClick?: () => void;
  text: string;
}

const Link: React.FC<LinkProps> = (props: LinkProps) => {
  return (
    <a onClick={props.onClick} className="v2-link">
      {props.text}
    </a>
  );
};

export default Link;
