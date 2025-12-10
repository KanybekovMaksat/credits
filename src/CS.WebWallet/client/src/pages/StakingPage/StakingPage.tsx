/* eslint-disable prettier/prettier */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $showcase } from "@store/showcase";
import { $data, getDeposits } from "./staking.store";
import { BlueFilledButton } from "@compv2/Buttons";

import "./StakingPage.scss";
import Loader from "@components/Loader";
import { dayMonthYear } from "@helpers/datehelper";
import { ClientDeposit } from "@services/DepositsService";
import BannerAnchor from "@compv2/Banners";

export interface StakingRowProps {
  deposit: ClientDeposit;
}

const StakingRow: React.FC<StakingRowProps> = ({ deposit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <li
      key={deposit.id}
      onClick={() => navigate(`/accounts/${deposit.depositAccount.id}`)}
    >
      <div>
        <img className="stake-icon" src={deposit.depositAccount.icon} />
      </div>
      <div className="info-row">
        <div
          style={{
            fontSize: "20px",
            fontWeight: 500,
          }}
        >
          {deposit.depositAccount.amount.formated} {deposit.depositAccount.code}
        </div>
        <div
          style={{
            color: deposit.status !== 4 ? "#27ae60" : "#111",
            marginTop: "5px",
          }}
        >
          {"+"}
          {deposit.interestPaid.formated} {deposit.interestAccount.code}
        </div>
      </div>
      <div className="info-row with-end">
        <div>
          {t(
            deposit.status !== 4 ? "staking.nextInterest" : "staking.closedAt"
          )}
        </div>
        <div>
          {deposit.nextInterestAmount.formated}{" "}
          {deposit.nextInterestAmount.currency}
        </div>
        <div>
          {dayMonthYear(
            deposit.status !== 4 ? deposit.nextInterestDate : deposit.expireDate
          )}
        </div>
      </div>
    </li>
  );
};

const StakingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deposits } = useStore($showcase);
  const { depositInfo, showClosed, loading } = useStore($data);

  React.useEffect(() => {
    if (!depositInfo) getDeposits({ showClosed });
  }, [depositInfo]);

  const closed = (depositInfo?.deposits ?? []).filter(
    (e) => e.status === 4 || e.status === 3
  );

  return (
    <>
      <div className="page-title">{t("staking.page.header")}</div>

      <BannerAnchor placement={0} anchor="staking" />
      <ul className="stakings-list">
        {(deposits ?? []).map((e) => (
          <li key={e.id} className="staking-item">
            <div className="stake-icon">
              <img src={e.icon} />
            </div>
            <div className="stake-description">
              <span className="header-title">{e.title}</span>
              <span className="header-description">{e.text}</span>
            </div>
            <div className="stake-action">
              {!e.requested && (
                <BlueFilledButton
                  text={t("Open")}
                  onClick={() => navigate(`/staking/${e.id}`)}
                  disabled={false}
                />
              )}
              {e.requested && (
                <div className="stake-message">{t(e.message)}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="deposits">
        {loading && (
          <div
            style={{
              margin: "20px",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        )}
        {!loading && depositInfo && depositInfo.deposits?.length > 0 && (
          <ul className="deposit-item">
            {depositInfo.deposits
              .filter((e) => e.status !== 4)
              .map((e) => (
                <StakingRow deposit={e} key={e.id} />
              ))}
          </ul>
        )}
        <BannerAnchor placement={1} anchor="staking" />
        {!loading && depositInfo && closed.length > 0 && (
          <>
            <br />
            <h3>{t("staking.page.closed.title")}</h3>
            <br />
            <ul className="deposit-item">
              {closed.map((e) => (
                <StakingRow deposit={e} key={e.id} />
              ))}
            </ul>
          </>
        )}
        <BannerAnchor placement={2} anchor="staking" />
      </div>
    </>
  );
};

export default StakingPage;
