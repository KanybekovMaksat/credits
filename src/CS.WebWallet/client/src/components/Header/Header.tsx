import React from "react";
import Profile from "@components/Header/components/Profile";
import Bonus from "@components/Header/components/Bonus";
import LanguageSelector from "@compv2/LanguageSelector";
import "./header.scss";

const Header: React.FC = () => {
  return (
    <header>
      <Bonus />
      <Profile />
      <LanguageSelector />
    </header>
  );
};

export default Header;
