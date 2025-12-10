import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SumsubWebSdk from "@sumsub/websdk-react";

const SumSubPage: React.FC = (): JSX.Element => {
  const [token, setToken] = useState<string>();
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const tkn = queryParams.get("token");
    if (tkn) {
      setToken(tkn);
    }
  }, [queryParams]);

  const messageReceiver = (e: any) => {
    if (e === "idCheck.onApplicantSubmitted") {
      navigate("/sumsub-finish");
    }
  };
  //  return <span>Loading</span>;
  return token ? (
    <div style={{ width: "100%" }}>
      <SumsubWebSdk
        accessToken={token}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expirationHandler={() => {
          return console.log("expiration");
        }}
        onMessage={messageReceiver}
      />
    </div>
  ) : (
    <span>Loading</span>
  );
};

export default SumSubPage;
