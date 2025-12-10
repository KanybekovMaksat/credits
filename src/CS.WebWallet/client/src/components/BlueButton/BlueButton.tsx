import React, { ButtonHTMLAttributes, FC } from "react";
import { Oval } from "react-loader-spinner";
import "./styles.scss";

interface BlueButtonProps
  extends React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactElement | string;
  width?: number;
  height?: number;
  loading?: boolean;
}
/**
 * @deprecated The method should not be used
 */
const BlueButton: FC<BlueButtonProps> = ({
  children,
  width,
  height,
  loading,
  ...props
}) => {
  return (
    <button
      {...props}
      className="blue-button"
      style={{ ...props.style, width: width, height: height }}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <div className="loading_btn">
          <span>Loading</span>
          <Oval
            height={height ? height / 2 : 20}
            width={height ? height / 2 : 20}
            color="white"
            secondaryColor="#AFAFAFFF"
            ariaLabel="loading"
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default BlueButton;
