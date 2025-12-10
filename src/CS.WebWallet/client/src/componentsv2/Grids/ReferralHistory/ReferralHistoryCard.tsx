import React from "react";

import "./styles.scss";
import { formatLocalDateTime } from "../../../helpers/datehelper";
import { useStore } from "effector-react";
import { $referral } from "@store/partner";
import { ReferralHistory } from "@services/ReferralService";

const ReferralHistoryCard: React.FC = (): JSX.Element => {
  const { history } = useStore($referral);

  const refStatus = (status: number) => {
    let cls = "ref-pending";
    let txt = "Pending";
    if (status === 1) {
      cls = "ref-approved";
      txt = "Approved";
    }
    if (status === 2) {
      cls = "ref-rejected";
      txt = "Rejected";
    }
    return <span className={cls}>{txt}</span>;
  };

  const renderRow = (row: ReferralHistory) => {
    return (
      <tr key={row.id}>
        <td className="time" style={{ width: "150px" }}>
          {formatLocalDateTime(row.created)}
        </td>
        <td className="referral" style={{ width: "150px" }}>
          {row.referralToken}
        </td>
        <td className="ref-status">{refStatus(row.referralStatus)}</td>
        {/*<td className="utm">{JSON.stringify(row.params)}</td>*/}
      </tr>
    );
  };

  return (
    <section className="referral-history">
      <table className="titles-table">
        <thead className="thead_wallet">
          <tr>
            <th className="time">Time</th>
            <th className="currency">Referral (User)</th>
            <th className="type">Status</th>
            {/*<th className="transaction_status">Utm Source</th>*/}
          </tr>
        </thead>

        <tbody>
          {history.length > 0 && history.map((row: any) => renderRow(row))}
        </tbody>
      </table>
    </section>
  );
};

export default ReferralHistoryCard;
