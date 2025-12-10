import React from "react";
import "./styles.scss";

interface ArrowProps {
  isOpened?: boolean;
}

const ArrowIcon: React.FC<ArrowProps> = (props: ArrowProps): JSX.Element => {
  const { isOpened } = props;
  return (
    <div className={`arrow ${isOpened && "rotation"}`}>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 1L7.00009 7L12.5 1"
          stroke="#828282"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ArrowIcon;
