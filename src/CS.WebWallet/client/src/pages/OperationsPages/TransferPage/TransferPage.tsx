import React from "react";
import OperationPage from "../../OperationPage";
import { Direction } from "../../OperationPage/types";

const TransferPage: React.FC = (): JSX.Element => {
  return (
    <div className="profile-payments-page">
      <OperationPage direction={Direction.WithdrawCrypto} />
    </div>
  );
};

export default TransferPage;
