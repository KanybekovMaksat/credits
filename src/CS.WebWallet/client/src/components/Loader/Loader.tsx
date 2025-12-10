import React, { FC } from "react";
import { Oval } from "react-loader-spinner";
import "./loader.scss";

const Loader: FC = () => {
  return (
    <div className="loader">
      <Oval
        height="50"
        width="50"
        color="#367EDB"
        secondaryColor="grey"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
