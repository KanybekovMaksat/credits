import React, { FC, HTMLProps } from "react";
import "./styles.scss";

interface BlueTextButtonProps extends HTMLProps<HTMLButtonElement> {
  width?: number;
  bordered?: boolean;
  height?: number;
}

const BlueTextButton: FC<BlueTextButtonProps> = ({
  width,
  children,
  bordered,
  height,
  ...props
}) => {
  return (
    <button
      style={{
        width: `${width}px` || "170px",
        height: `${height}px` || "fit-content",
      }}
      {...props}
      type="button"
      className={`blue-text-button ${bordered && "bordered"}`}
    >
      <span>{children}</span>
    </button>
  );
};

export default BlueTextButton;
