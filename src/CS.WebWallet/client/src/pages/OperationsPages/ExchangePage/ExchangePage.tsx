import React from "react";
import OperationPage from "@pages/OperationPage";
import { Direction } from "@pages/OperationPage/types";

const ExchangePage: React.FC = () => {
  return (
    <div className="profile-payments-page">
      <OperationPage direction={Direction.Exchange} />
    </div>
  );
};

export default ExchangePage;
