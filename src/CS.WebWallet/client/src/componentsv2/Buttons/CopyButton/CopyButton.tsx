import React from "react";
import "./copyButton.scss";

export interface CopyButtonProps {
  onClick: () => void;
}
const CopyButton: React.FC<CopyButtonProps> = (props) => {
  return <button className="copy-button" onClick={() => props.onClick()} />;
};

export default CopyButton;
