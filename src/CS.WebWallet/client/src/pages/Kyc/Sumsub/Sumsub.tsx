import React from "react";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useStore } from "effector-react";
import { $sumsub } from "@store/kyc/sumsub";
import { useNavigate } from "react-router-dom";

const KycSumsub: React.FC = (): JSX.Element => {
  const { token, customToken } = useStore($sumsub);
  const navigate = useNavigate();

  const sumSubToken = customToken ?? token;
  if (!sumSubToken) {
    navigate("/");
    return <></>;
  }

  return (
    <div style={{ width: "100%" }}>
      <SumsubWebSdk
        accessToken={sumSubToken}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expirationHandler={() => {
          return console.log("expiration");
        }}
        onMessage={(e: string) => {
          if (
            e === "idCheck.onApplicantSubmitted" ||
            e === "idCheck.onApplicantResubmitted"
          )
            navigate("/sumsub-finish/checking");
        }}
      />
    </div>
  );
};

export default KycSumsub;
