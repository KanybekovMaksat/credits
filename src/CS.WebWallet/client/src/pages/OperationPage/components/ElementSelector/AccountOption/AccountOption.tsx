import React, { ReactElement } from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $accounts } from "@store/accounts";
import { normalizeNumber } from "../../../../../helpers/amountHelper";
import { SelectorOption } from "../../../types";
import { AccountRow } from "@services/AccountsService";
import CardIcon from "@components/Icons/CardIcon";
import BankIcon from "@components/Icons/BankIcon/BankIcon";
import WalletIcon from "@components/Icons/WalletIcon/WalletIcon";
import "./styles.scss";

export interface AccountOptionProps {
  option: SelectorOption;
  inputHandler: (account: SelectorOption) => (event: React.MouseEvent) => void;
}

const renderOption = (
  name: string,
  amount: string,
  ticker: string,
  icon?: string,
  iconElement?: ReactElement | null
) => {
  return (
    <>
      <div style={{ textAlign: "center" }}>
        {!iconElement && <img alt="-" src={icon} />}
        {!!iconElement && iconElement}
      </div>
      <div className="account-props">
        <span className="account-name">{name}</span>
        <span className="sub-amount">
          {amount && normalizeNumber(amount)} <span>{ticker}</span>
        </span>
      </div>
    </>
  );
};

export const getContent = (
  t: any,
  option: SelectorOption,
  account?: AccountRow
) => {
  if (option.accountId && account)
    return renderOption(
      account.text,
      account.amount,
      account.ticker,
      account.icon
    );

  let icon = null;
  let name = "";

  switch (option.type) {
    case "appCard":
      name = t("account.option.appCard");
      icon = <CardIcon width={32} />;
      break;
    case "requisites":
      name = t("account.option.requisites");
      icon = <BankIcon width={32} />;
      break;
    case "fullRequisites":
      name = t("account.option.fullRequisites");
      icon = <BankIcon width={32} />;
      break;
    case "fullRequisitesSwift":
      name = t("account.option.fullRequisitesSwift");
      icon = <BankIcon width={32} />;
      break;
    case "wallet":
      name = t("account.option.wallet");
      icon = <WalletIcon width={32} height={32} />;
      break;
    case "walletRequisites":
      name = t("account.option.walletRequisites");
      icon = <WalletIcon width={32} height={32} />;
      break;
  }

  return renderOption(name, "", "", undefined, icon);
};

const AccountOption: React.FC<AccountOptionProps> = (
  props: AccountOptionProps
): JSX.Element => {
  const { option, inputHandler } = props;
  const { t } = useTranslation();
  const { all } = useStore($accounts);
  const account = option.accountId
    ? all.find((e) => e.accountId === option.accountId)
    : undefined;

  return (
    <button
      type="button"
      onClick={inputHandler(option)}
      className="account-option-item"
    >
      {getContent(t, option, account)}
    </button>
  );
};

export default AccountOption;
