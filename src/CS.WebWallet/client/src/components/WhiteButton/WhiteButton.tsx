import React, { FC } from "react";
import "./styles.scss";

interface WhiteButtonProps {
  icon?: string;
  children?: string;
  onClick?: () => void;
}

const WhiteButton: FC<WhiteButtonProps> = ({ children, icon, onClick }) => {
  return (
    <button
      className="white-button"
      onClick={() => {
        onClick ? onClick() : true;
      }}
    >
      {icon ? (
        <img height="16px" src={icon} alt="button" className="button-icon" />
      ) : (
        <></>
      )}
      {children && <span className="white-button-text">{children}</span>}
    </button>
  );
};

export default WhiteButton;
