import React from "react";

interface ProfileArrowProps {
  isOpened: boolean;
}

const ArrowIcon: React.FC<ProfileArrowProps> = (
  props: ProfileArrowProps
): JSX.Element => {
  const { isOpened } = props;
  return (
    <div className={`arrow ${isOpened && "rotation"}`}>
      <svg
        width="9"
        height="16"
        viewBox="0 0 9 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1L8 8L1 15"
          stroke="#4F4F4F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ArrowIcon;
