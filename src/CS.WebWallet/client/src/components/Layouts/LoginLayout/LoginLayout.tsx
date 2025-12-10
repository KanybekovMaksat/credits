import React, { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./styles.scss";
import CreditsLogoIcon from "@components/Icons/CreditsLogoIcon";
import FooterV2 from "@compv2/FooterV2";
import LanguageSelector from "@compv2/LanguageSelector";
import Loader from "@components/Loader";
import { navigationReceived } from "@store/navigation.store";

const LoginLayout: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  useEffect(() => {
    navigationReceived(navigate);
  }, [navigate]);

  return (
    <Suspense fallback={<Loader />}>
      <div className="auth-page">
        <div className="header">
          <CreditsLogoIcon />
          <LanguageSelector />
        </div>
        <Outlet />
        <FooterV2 />
      </div>
    </Suspense>
  );
};

export default LoginLayout;
