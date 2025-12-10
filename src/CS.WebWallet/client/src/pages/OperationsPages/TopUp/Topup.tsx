import React from "react";
import { useTranslation } from "react-i18next";
import "./topup-main.scss";
import TopUpOption from "./TopUpOption";

import crypto from "/v2/topup/crypto.png";
import card from "/v2/topup/card.png";
import bank from "/v2/topup/bank.png";

const TopUp: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="topup-main">
      <div className="page-title">{t("topup_from_prepared")}</div>
      <div className="options-container">
        <TopUpOption
          title={t("topup_main_crypto")}
          subtitle={t("topup_main_crypto_subtitle")}
          image={crypto}
          path="/topup/crypto"
        />
        <TopUpOption
          title={t("topup_main_debit_card")}
          subtitle={t("topup_main_debit_card_subtitle")}
          image={card}
          path="/topup/prepaid"
        />
        <TopUpOption
          title={t("topup_main_bank")}
          subtitle={t("topup_main_bank_subtitle")}
          image={bank}
          path="/topup/prepaidBank"
        />
      </div>
    </div>
  );
};

export default TopUp;
