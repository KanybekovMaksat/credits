import React from "react";
import "./styles.scss";

export interface BorderedButtonProps {
  onClick?: () => void;
  text: string;
}
const BorderedButton: React.FC<BorderedButtonProps> = (props) => {
  const { onClick, text } = props;
  return (
    <button className="bordered-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default BorderedButton;
