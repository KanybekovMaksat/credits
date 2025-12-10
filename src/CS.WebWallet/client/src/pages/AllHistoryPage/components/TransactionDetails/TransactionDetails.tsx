import React, { FC, useMemo } from "react";
import BlueTextButton from "@components/BlueTextButton";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import {
  formatLocalDateTime,
  localDayOfWeek,
} from "../../../../helpers/datehelper";
import DocumentStatus from "@components/References/DocumentStatus";
import DocumentType from "@components/References/DocumentType";
import copyIcon from "/icons/copyIcon.svg";
import Loader from "@components/Loader";
import { normalizeNumber } from "../../../../helpers/amountHelper";
import { HistoryTypes } from "@services/HistoryService";
import { $historyData } from "@store/history.store";

import "./styles.scss";

interface TransactionDetailsProps {
  setModal: (value: boolean) => void;
  currency?: string;
}

const TransactionDetails: FC<TransactionDetailsProps> = ({ setModal }) => {
  const { current } = useStore($historyData);
  const { t } = useTranslation();

  const amountV2 = useMemo(() => {
    const rowSign = current?.income ? "+" : "-";
    const sum = normalizeNumber(current?.sum?.amount);

    return `${rowSign} ${sum} ${current?.sum?.ticker}`;
  }, [current]);

  if (!current) {
    return <Loader />;
  }

  return (
    <div className="transaction-details">
      <BlueTextButton
        style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
        onClick={() => setModal(false)}
      >
        Close
      </BlueTextButton>
      <h3 className="title">{t("transaction.details.transaction")}</h3>
      <div className="container">
        <div className="date">
          {localDayOfWeek(current?.date) +
            " " +
            formatLocalDateTime(current?.date)}
        </div>
        <div className="amount">{amountV2}</div>
      </div>
      <div className="container" style={{ marginTop: "20px" }}>
        <div className="row" style={{ paddingTop: 0 }}>
          <div className="label">{t("transaction.details.status")}</div>
          <div className="value">
            {<DocumentStatus value={current.status} />}
          </div>
        </div>
        <div className="row">
          <div className="label">{t("transaction.details.type")}</div>
          <div className="value">{<DocumentType value={current.type} />}</div>
        </div>
        {current.type === HistoryTypes.Transfer && (
          <>
            <div className="row">
              <div className="label-width-icon">
                <div className="label">{t("transaction.details.wallet")}</div>
                <img
                  src={copyIcon}
                  alt="copy"
                  onClick={() =>
                    current?.transfer?.wallet &&
                    navigator.clipboard.writeText(current.transfer.wallet)
                  }
                />
              </div>
              <div className="value">{current.transfer?.wallet}</div>
            </div>
            <div className="row">
              <div className="label">{t("transaction.details.account")}</div>
              <div className="value">{current.transfer?.account}</div>
            </div>
          </>
        )}
        {current.type === HistoryTypes.Withdraw && (
          <div className="row">
            <div className="label">{t("transaction.details.recipient")}</div>
            <div className="value">
              {current.withdraw?.recipient ??
                (current.withdraw?.card &&
                  "**" + current.withdraw.card.slice(-4))}
            </div>
          </div>
        )}
        {current.type === HistoryTypes.Topup && (
          <div className="row">
            <div className="label">{t("transaction.details.card")}</div>
            <div className="value">
              {current.topUp?.card && "**" + current.topUp.card.slice(-4)}
            </div>
          </div>
        )}
        {current.type === HistoryTypes.Exchange && (
          <>
            <div className="row">
              <div className="label">{t("transaction.details.payed")}</div>
              <div className="value">
                {normalizeNumber(current.exchange?.payed?.amount)}{" "}
                {current.exchange?.payed?.ticker}
              </div>
            </div>
          </>
        )}

        {current.type === HistoryTypes.BankTransfer && (
          <>
            <div className="row">
              <div className="label">{t("transaction.details.iban")}</div>
              <div className="value">{current.bankTransfer?.iban}</div>
            </div>
            {current.bankTransfer?.name && (
              <div className="row">
                <div className="label">{t("transaction.details.name")}</div>
                <div className="value">{current.bankTransfer?.name}</div>
              </div>
            )}
          </>
        )}

        <div className="row" style={{ paddingBottom: 0, border: "none" }}>
          <div className="label">{t("transaction.details.fee")}</div>
          <div className="value">
            {`${normalizeNumber(current.fee?.amount)} ${current.fee?.ticker}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
