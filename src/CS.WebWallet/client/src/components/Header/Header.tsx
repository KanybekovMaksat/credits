import React from "react"
import Profile from "@components/Header/components/Profile"
import Bonus from "@components/Header/components/Bonus"
import LanguageSelector from "@compv2/LanguageSelector"
import "./header.scss"
import { Link } from "react-router-dom"
import CreditsLogoIcon from "@components/Icons/CreditsLogoIcon"

const Header: React.FC = () => {
  return (
    <header>
      <Link to={"/accounts"}>
        <button type="button" className="logo">
          <img src="https://vyacheslavvolkhin.github.io/wallet/img/main/logo.svg" alt="" />
          <div className="logo-title">Credits</div>
          {/* <CreditsLogoIcon /> */}
        </button>
      </Link>
      <Bonus />
      <div className="right-box">
        <Profile />
        {/* <LanguageSelector /> */}
      </div>
    </header>
  )
}

export default Header

// import React from "react";
// import Profile from "@components/Header/components/Profile";
// import Bonus from "@components/Header/components/Bonus";
// import LanguageSelector from "@compv2/LanguageSelector";
// import "./header.scss";

// const Header: React.FC = () => {
//   return (
//     <header>
//       <Bonus />
//       <Profile />
//       <LanguageSelector />
//     </header>
//   );
// };

// export default Header;
