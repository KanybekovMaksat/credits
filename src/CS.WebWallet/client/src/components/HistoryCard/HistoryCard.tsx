import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import { HistoryRow } from "@services/HistoryService";
import DocumentStatus from "@components/References/DocumentStatus";
import DocumentType from "@components/References/DocumentType";
import Loader from "@components/Loader";
import { localTime } from "../../helpers/datehelper";
import { normalizeNumber } from "../../helpers/amountHelper";
import TransactionDetails from "../../pages/AllHistoryPage/components/TransactionDetails";
import Modal from "@components/Modal";
import WhiteButton from "@components/WhiteButton";
import "./styles.scss";
import {
  $historyData,
  getHistory,
  setCurrent,
  setDetailsModal,
} from "@store/history.store";
import Messages from "@compv2/Messages";

interface HistoryCardProps {
  operationType?: number;
  accountId?: string;
}

const groupByDate = (rows: any[]) => {
  const map = new Map();
  rows.forEach((item) => {
    const key = moment.utc(item.date).local().format("dddd, D MMM");
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const HistoryCard: React.FC<HistoryCardProps> = ({
  operationType,
  accountId,
}): JSX.Element => {
  const { t } = useTranslation();
  const { history, loading, detailsOpen } = useStore($historyData);

  React.useEffect(() => {
    getHistory({
      pageIndex: 1,
      pageSize: 100,
      filter: { operationType, accountId },
    });
  }, [operationType, accountId]);

  const groupedTransactions = groupByDate(history);

  const renderRow = (row: HistoryRow) => {
    const rowSign = row.income ? "+" : "-";
    const sum = normalizeNumber(row.sum?.amount);

    const amount = `${rowSign}${sum} ${row.sum?.ticker}`;
    const color = row.income ? "green" : "red";

    return (
      <tr key={row.id}>
        <td className="time">{localTime(row.date)}</td>
        <td className="amount" style={{ color: color, fontWeight: 500 }}>
          {amount}
        </td>
        <td className="gray type">
          <DocumentType value={row.type} />
        </td>
        <td className="gray transaction_status">
          <DocumentStatus value={row.status} />
        </td>
        <td className="details" align="right">
          <WhiteButton
            icon="/icons/details.svg"
            onClick={() => {
              setCurrent(row);
              setDetailsModal(true);
            }}
          ></WhiteButton>
        </td>
      </tr>
    );
  };

  const renderDays = (key: any, index: number): JSX.Element => {
    const rows = groupedTransactions.get(key);

    return (
      <section
        key={key}
        className="history-card"
        style={{ marginTop: `${index === 0 ? "0" : "10px"}` }}
      >
        <h1 className="day">{key}</h1>
        <table className="titles-table">
          <thead className="thead_wallet">
            <tr>
              <th className="time">{t("time")}</th>
              <th className="amount">{t("Amount")}</th>
              <th className="type">{t("type")}</th>
              <th className="transaction_status">{t("status")}</th>
              <th className="details" />
            </tr>
            <tr className="delimiter">
              <td colSpan={6} />
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 && rows.map((row: any) => renderRow(row))}
          </tbody>
        </table>
      </section>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Messages messageTags={["debitCardAttention"]} />
      {groupedTransactions.size > 0 ? (
        <div className="all_history_cards">
          {Array.from(groupedTransactions.keys()).map((key, index) =>
            renderDays(key, index)
          )}
        </div>
      ) : (
        <section className="history-card" style={{ marginTop: "0" }}>
          <h1 className="day">{moment().format("dddd, D MMM")}</h1>
          <table className="titles-table" cellPadding={5}>
            <thead>
              <tr>
                <th className="time">{t("time")}</th>
                <th className="currency">{t("Currency")}</th>
                <th className="amount">{t("Amount")}</th>
                <th className="type">{t("type")}</th>
                <th className="transaction_status">{t("status")}</th>
                <th />
              </tr>
            </thead>
          </table>
          <div className="no-transactions">{t("empty_history")}</div>
        </section>
      )}
      <Modal modal={detailsOpen} setModal={() => setDetailsModal(false)}>
        <TransactionDetails setModal={setDetailsModal} />
      </Modal>
    </>
  );
};

export default HistoryCard;
