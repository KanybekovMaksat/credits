import React, { useEffect, useMemo } from "react";
import { useStore } from "effector-react";
import "./accountDetailsPage.scss";

import HistoryCard from "@components/HistoryCard";
import {
  $accountDetails,
  accountIdReceived,
  detailsModalChanged,
  statementModalChanged,
} from "./accountDetailsPage.store";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import WhiteButton from "@components/WhiteButton";
import StatementByPeriod from "@components/Modal/StatementByPeriod";
import Modal from "@components/Modal";
import { DetailsModal } from "@components/Modal/Details";
import { AccountRow } from "@services/AccountsService";
import { $data, closeDeposit } from "@pages/StakingPage/staking.store";

const AccountDetailsPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { account, statementModal, detailsModal } = useStore($accountDetails);
  const { depositInfo } = useStore($data);
  const { id } = useParams<string>();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      accountIdReceived(id);
    }
  }, [id]);

  const getOperationButtons = (account: AccountRow): JSX.Element[] => {
    const result: JSX.Element[] = [];
    if (account.operations.topUp && account.operations.topUp.length > 0) {
      result.push(
        <WhiteButton
          key="topUp"
          icon="/icons/topup.svg"
          onClick={() => navigate(`/operation/?to=${account.accountId}`)}
        >
          {t("account.topUp")}
        </WhiteButton>
      );
    }

    if (account.operations.transfer && account.operations.transfer.length > 0) {
      result.push(
        <WhiteButton
          key="transfer"
          icon="/icons/send.svg"
          onClick={() => navigate(`/operation/?from=${account.accountId}`)}
        >
          {t("account.transfer")}
        </WhiteButton>
      );
    }

    if (account.operations.exchange && account.operations.exchange.length > 0) {
      result.push(
        <WhiteButton
          key="exchange"
          icon="/icons/exchange.svg"
          onClick={() => navigate(`/operation/?from=${account.accountId}&op=7`)}
        >
          {t("account.exchange")}
        </WhiteButton>
      );
    }

    if (account.type === 80) {
      const deposit = (depositInfo?.deposits ?? []).find(
        (e) => e.depositAccount.id === account.accountId
      );
      if (deposit && deposit.status !== 4 && deposit.status !== 3)
        result.push(
          <WhiteButton
            key="close"
            icon="/icons/lock.svg"
            onClick={() => closeDeposit(deposit.id)}
          >
            {t("account.close")}
          </WhiteButton>
        );
    }

    return result;
  };

  const actionButtons = useMemo(() => {
    if (account === null) {
      return [];
    }

    const res: JSX.Element[] = getOperationButtons(account);

    res.push(
      <WhiteButton
        key="details"
        icon="/icons/details.svg"
        onClick={detailsModalChanged}
      >
        {t("account.details")}
      </WhiteButton>
    );

    res.push(
      <WhiteButton
        key="statements"
        icon="/icons/statements.svg"
        onClick={statementModalChanged}
      >
        {t("account.statements")}
      </WhiteButton>
    );
    return res;
  }, [account, t]);

  return (
    <div className="account-view-page">
      <div className="asset-header">
        <div className="asset-name">
          <div>
            <img
              className="asset-icon"
              src={account?.icon}
              alt={account?.name}
              height="61px"
              width="61px"
            />
          </div>
          <div className="right-side">
            <div className="names">
              <span className="ticker">{account?.ticker}</span>
              <span className="full-name">
                {account?.text ?? account?.name}
              </span>
            </div>
            <div className="external-key">
              <span>
                {t("account_view_external_key")} {account?.externalKey}
              </span>
            </div>
          </div>
        </div>
        <div className="asset-name-divider"></div>
        {account?.alerts && account?.alerts.length > 0 && (
          <div className="account-alert">
            {account.alerts.map((val: any) => (
              <p key={val.level}>{val.message}</p>
            ))}
          </div>
        )}
        <div>
          <span className="current-balance">{t("account_view_balance")}</span>
          <div className="description">
            <span className="amount">{`${account?.amount} ${account?.name}`}</span>
            <span className="fiat-amount">{` ${account?.currencyAmount} ${account?.currencyName}`}</span>
          </div>
        </div>
        <div className="asset-actions">{actionButtons}</div>
      </div>

      <div className="page-title">{t("History")}</div>
      <HistoryCard accountId={account?.accountId ?? id} />

      <Modal modal={detailsModal} setModal={detailsModalChanged} top>
        <DetailsModal setModal={detailsModalChanged} account={account} />
      </Modal>

      <Modal modal={statementModal} setModal={statementModalChanged}>
        <StatementByPeriod
          setModal={() => statementModalChanged()}
          account={account}
        />
      </Modal>
    </div>
  );
};

export default AccountDetailsPage;
