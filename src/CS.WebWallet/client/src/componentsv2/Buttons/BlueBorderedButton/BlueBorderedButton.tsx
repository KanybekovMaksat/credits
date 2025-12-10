import React, { CSSProperties } from "react";
import "./styles.scss";
import { Oval } from "react-loader-spinner";

export interface BlueBorderedButtonProps {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}

const BlueBorderedButton: React.FC<BlueBorderedButtonProps> = (
  props: BlueBorderedButtonProps
) => {
  const {
    isLoading,
    text,
    disabled,
    onClick,
    type = "button",
    style = undefined,
  } = props;

  return (
    <button
      onClick={onClick}
      className="blue-bordered-button"
      disabled={disabled || isLoading}
      type={type}
      style={style}
    >
      {text}
      <div className="button-loader">
        {isLoading && (
          <Oval
            height={20}
            width={20}
            color="white"
            secondaryColor="#AFAFAFFF"
            ariaLabel="loading"
          />
        )}
      </div>
    </button>
  );
};

export default BlueBorderedButton;
