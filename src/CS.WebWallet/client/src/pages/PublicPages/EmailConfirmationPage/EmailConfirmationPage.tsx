import React, { FC, useEffect, useState } from "react";
import ConfirmationIcon from "@components/Icons/ConfirmationIcon/ConfirmationIcon";
import CancellationIcon from "@components/Icons/CancellationIcon/CancellationIcon";
import "./styles.scss";
import { useSearchParams } from "react-router-dom";
import Loader from "@components/Loader";

const EmailConfirmationPage: FC = () => {
  const [codeParam] = useSearchParams();
  const [success] = useState<string>("");
  const [loading] = useState<boolean>(true);
  const code = codeParam.get("code");
  const uid = codeParam.get("uid");

  useEffect(() => {
    if (code && uid) {
      // TODO : KYC REFACTOR
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="email_confirmation_page">
      {success === "true" ? (
        <div className="verified">
          <span>Your email is verifed</span>
          <div className="icon">
            <ConfirmationIcon />
          </div>
        </div>
      ) : (
        <div className="error">
          <span> Something went wrong</span>
          <div className="icon">
            <CancellationIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmationPage;
