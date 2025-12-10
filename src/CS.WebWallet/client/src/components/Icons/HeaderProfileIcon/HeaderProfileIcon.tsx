import React from "react";

const HeaderProfileIcon: React.FC = () => {
  return (
    <svg
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20.5" cy="20.5" r="20.5" fill="#3176DE" />
      <circle cx="20.6583" cy="11.5411" r="6.98643" fill="#CCDAF5" />
      <mask
        id="mask0_8293_34508"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="41"
        height="41"
      >
        <circle cx="20.5" cy="20.5" r="20.5" fill="white" />
      </mask>
      <g mask="url(#mask0_8293_34508)">
        <path
          d="M9.22644 25.6367C6.23627 28.4413 4.55642 32.245 4.55642 36.2112L4.55642 54.6641L36.4453 54.6641L36.4453 36.2112C36.4453 32.245 34.7655 28.4413 31.7753 25.6367C28.7851 22.8322 24.7296 21.2567 20.5009 21.2567C16.2721 21.2567 12.2166 22.8322 9.22644 25.6367Z"
          fill="#CCDAF5"
        />
      </g>
    </svg>
  );
};

export default HeaderProfileIcon;
