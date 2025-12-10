import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $tariffs, tariffRequested } from "@store/tariffs";
import { toNum } from "@helpers/amountHelper";
import { BlueFilledButton } from "@compv2/Buttons";

import "./TariffsPage.scss";
import { customTokenReceived } from "@store/kyc/sumsub";

const periods = ["none", "days", "week", "month", "quarter", "year"];

const TariffsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { all, isLoading } = useStore($tariffs);

  const getPeriod = (period: number): string => {
    return t(`tariff.${periods[period]}`);
  };

  return (
    <div className="tariffs-list">
      {(all ?? []).map((e) => (
        <div
          key={e.id}
          className={`tariffs-item ${e.isCurrent ? "" : "filled"}`}
        >
          <div>
            <div className="tariffs-item-header">
              <div className="tariffs-item-title">
                {e.icon && <img src={e.icon} alt="" />}
                {e.name}
              </div>
              <div
                className={`tariffs-item-price ${
                  toNum(e.feeAmount) === 0 ? "free" : ""
                }`}
              >
                {toNum(e.feeAmount) === 0
                  ? t("tariff.free")
                  : `${e.feeAmount}/${getPeriod(e.paymentPeriod)}`}
              </div>
            </div>
            <div className="tariffs-item-row">
              <pre>{e.description}</pre>
            </div>
            <div className="tariffs-item-row">
              <pre>{e.summary}</pre>
            </div>
            {e.link && (
              <div className="tariffs-item-row">
                <Link to={e.link}>{t("tariff.all.options")}</Link>
              </div>
            )}
          </div>
          <div className="tariff-item-footer">
            {e.isCurrent ? (
              <div className="tariff-current">{t("tariff.is.current")}</div>
            ) : (
              <BlueFilledButton
                text={!!e.message ? e.message : t("tariff.activate")}
                disabled={!e.canBeRequested}
                isLoading={isLoading}
                onClick={() => {
                  if (
                    !e.requiredKycStages ||
                    e.requiredKycStages.length === 0
                  ) {
                    tariffRequested(e.id);
                    return;
                  }
                  const kycStage = e.requiredKycStages.find(
                    (e) => !!e.kycToken
                  );

                  if (!kycStage) {
                    navigate("/settings");
                    return;
                  }
                  customTokenReceived(kycStage.kycToken);
                  navigate("/kyc/sumsub");
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TariffsPage;
