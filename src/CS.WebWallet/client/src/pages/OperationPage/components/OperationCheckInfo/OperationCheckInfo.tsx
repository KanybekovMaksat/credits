import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $data } from "../../OperationPage.store";
import { toNum } from "@helpers/amountHelper";

import "./OperationCheckInfo.scss";

const OperationCheckInfo: React.FC = () => {
  const { t } = useTranslation();
  const { check } = useStore($data);

  if (!check) return <></>;
  const amount =
    toNum(check.amountFrom.size) +
    (check.amountFrom.id === check.amountTo.id ? toNum(check.fee.size) : 0);

  return (
    <div className="operation-info">
      <div className="operation-header f12">
        {t("operation.check.description")}
      </div>
      <table>
        <tbody>
          <tr>
            <td width="155px">{t("operation.check.amount-to-pay")}:</td>
            <td>
              {amount} {check.amountFrom.ticker}
            </td>
          </tr>
          <tr>
            <td>{t("Fee")}:</td>
            <td>
              {Number(check.fee.size) === 0 && t("operation.check.no-fee")}
              {Number(check.fee.size) > 0 && (
                <>
                  {check.fee.size} {check.fee.ticker} (
                  {t("operation.check.included")})
                </>
              )}
            </td>
          </tr>
          {check.rate.base !== check.rate.quoted && (
            <tr>
              <td>{t("operation.check.rate")}:</td>
              <td>
                1 {check.rate.base} ≈ {check.rate.rate} {check.rate.quoted}
              </td>
            </tr>
          )}

          <tr>
            <td>{t("operation.check.execution-label")}:</td>
            <td>{t("operation.check.immediately-label")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OperationCheckInfo;
