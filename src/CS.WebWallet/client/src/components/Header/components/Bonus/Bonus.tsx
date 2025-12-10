import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import { $accounts } from "@store/accounts";
import "./bonus.scss";

const Bonus: React.FC = () => {
  const { t } = useTranslation();
  const { all } = useStore($accounts);

  const bonusAccount = all?.find((e) => e.type === 60);
  if (!bonusAccount) return <></>;

  return (
    <div className="bonus-header">
      {t("header.bonus.prefix")} {bonusAccount.amount}{" "}
      {t("header.bonus.postfix")}
    </div>
  );
};

export default Bonus;
