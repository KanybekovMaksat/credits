import React, { FC } from "react";

interface CrossIconProps {
  color?: string;
}

const CrossIcon: FC<CrossIconProps> = ({ color }) => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.863525 1.28711L10.8966 11.3202M0.863525 11.3202L10.8967 1.28711"
        stroke={color ? color : "#367EDB"}
        strokeWidth="2"
      />
    </svg>
  );
};

export default CrossIcon;
