import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $data, setRespondent } from "../../OperationPage.store";

import "./walletInput.scss";

const WalletInput: React.FC = () => {
  const { t } = useTranslation();
  const { respondent, loading } = useStore($data);

  return (
    <div className="address-input">
      <input
        type="text"
        placeholder={t("Wallet address, email or phone number")}
        disabled={loading}
        onChange={(e) =>
          setRespondent({
            ...respondent,
            ...{ externalId: e.target.value },
          })
        }
      />
    </div>
  );
};

export default WalletInput;
