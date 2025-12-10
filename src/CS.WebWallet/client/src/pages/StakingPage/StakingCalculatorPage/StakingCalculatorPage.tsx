import React from "react";
import { useParams, Link } from "react-router-dom";
import { useStore, useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import {
  $calculator,
  createRequest,
  initCtor,
  setAgg,
  setUpdates,
} from "./calculator.store";
import { $showcase } from "@store/showcase";
import { BlueFilledButton } from "@compv2/Buttons";
import BlueBorderedButton from "@compv2/Buttons/BlueBorderedButton";
import { DepPeriod } from "@services/DepositsService";
import { dayMonthYear } from "@helpers/datehelper";
import { toNum } from "@helpers/amountHelper";
import TabList from "@components/Tabs/components/TabList";
import Checkbox from "@compv2/Inputs/Checkbox";
import StakingInterest from "@compv2/Icons/StakingInterest";
import StakingWithdraw from "@compv2/Icons/StakingWithdraw";
import StakingInner from "@compv2/Icons/StakingInner";
import CryptoNumber from "@compv2/Inputs/CryptoNumber";
import CurrencySelect, { CurrencyItem } from "./CurrencySelect";
import "./StakingCalculatorPage.scss";
import { $accounts } from "@store/accounts";

export interface PeriodSelectProps {
  periods: DepPeriod[];
  defaultPeriod?: DepPeriod;
  onPeriodChange?: (period: DepPeriod) => void;
}
const PeriodSelect: React.FC<PeriodSelectProps> = (
  props: PeriodSelectProps
) => {
  const { t } = useTranslation();
  const { periods, defaultPeriod, onPeriodChange } = props;

  const tabList = React.useMemo(() => {
    const tabs = (periods ?? []).map((e, i) => (
      <span key={i} style={{ minWidth: "75px" }}>
        {e.count} {t(`staking.period_${e.period}`)}
      </span>
    ));

    return (
      <TabList
        tabs={tabs}
        activeTab={
          defaultPeriod
            ? periods.findIndex(
                (e) =>
                  e.count === defaultPeriod.count &&
                  e.period === defaultPeriod.period
              )
            : 0
        }
        setActiveTab={(e) => onPeriodChange?.(periods[e])}
      />
    );
  }, [periods]);

  return <div>{tabList}</div>;
};

const DepositInfo: React.FC = () => {
  const { t } = useTranslation();
  const { deposit, caseId, agreement } = useStore($calculator);
  const { deposits } = useStore($showcase);

  React.useEffect(() => {
    const current = deposits.find((e) => e.id === caseId);
    if (current && !current.needToAcceptEULA && !agreement) {
      setAgg(true);
    }
  }, [deposits]);

  const currentCase = deposits.find((e) => e.id === caseId);

  if (!deposit) return <></>;
  return (
    <>
      <div className="staking-results">
        <div className="result-row">
          <div style={{ color: "green", fontSize: "20px", fontWeight: 600 }}>
            {deposit.annualPercent} %
          </div>
          <div>
            {t("staking.until")} <b>{dayMonthYear(deposit.toDate)}</b>
          </div>
        </div>
        <div className="result-row">
          <div>{t("staking.your_deposit")}</div>
          <div>{t("staking.your_profit")}</div>
        </div>
        <div className="result-row" style={{ fontWeight: 600 }}>
          <div>
            {deposit.fullAmount} {deposit.currency.code}
          </div>
          <div>
            {deposit.interestAmount} {deposit.currency.code}
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: "12px", marginTop: "5px", color: "#555" }}>
          * {t("staking.note")}
        </div>
        {currentCase?.needToAcceptEULA && (
          <div style={{ margin: "10px 0" }}>
            <Checkbox value={agreement} onChange={(e) => setAgg(e)}>
              <>
                {t("staking.agreement")}{" "}
                <Link
                  to={currentCase.eulaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("terms_conditions")}
                </Link>
              </>
            </Checkbox>
          </div>
        )}
      </div>
    </>
  );
};

const StakingForm: React.FC = () => {
  const { t } = useTranslation();
  const { all } = useUnit($accounts);
  const { ctor, request, loading, agreement } = useStore($calculator);

  const currencyOptions = React.useMemo(() => {
    return (ctor?.currencies ?? []).map(
      (e) => ({ id: e.id, code: e.code, icon: e.iconUrl } as CurrencyItem)
    );
  }, [ctor]);

  if (!request) return <></>;

  const lower = (request?.amount ?? 0) < (ctor?.minAmount.amount ?? 0);
  const higher = (request?.amount ?? 0) > (ctor?.maxAmount.amount ?? 0);
  const balance =
    toNum(
      all.find(
        (e) =>
          (e.type === 10 || e.type === 30) &&
          e.currencyId === request?.currencyId
      )?.amount ?? 0
    ) < (ctor?.minAmount.amount ?? 0);

  const hasError = lower || higher || balance;

  return (
    <div className="page-content">
      <div
        className="form-card"
        style={{ width: "650px", marginBottom: "10px" }}
      >
        <div className="staking-top">
          <div className="staking-top-item">
            <CurrencySelect
              currencies={currencyOptions}
              disabled={loading}
              onCurrencyChange={(e) => setUpdates({ currencyId: e.id })}
            />
          </div>
          <div className="staking-top-item">
            <CryptoNumber
              onChange={(e) => setUpdates({ amount: Number(e) })}
              placeholder="0.00"
              precision={8}
              error={hasError}
              disabled={loading}
              value={request?.amount ?? 0}
            />
            <div className="amount-hint">
              <div>
                {t("staking.min")}: <b>{ctor?.minAmount.amount}</b>.{" "}
                {t("staking.max")}: <b>{ctor?.maxAmount.amount}</b>
              </div>
              {lower && (
                <div className="form-error">
                  {t("staking.min.error")} {ctor?.minAmount.amount}{" "}
                  {ctor?.minAmount.currency}
                </div>
              )}
              {higher && (
                <div className="form-error">
                  {t("staking.max.error")} {ctor?.maxAmount.amount}{" "}
                  {ctor?.maxAmount.currency}
                </div>
              )}
              {balance && (
                <div className="form-error">
                  {t("staking.balance.error")} {ctor?.minAmount.amount}{" "}
                  {ctor?.minAmount.currency}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="form-card"
        style={{ width: "650px", marginBottom: "10px" }}
      >
        <div>
          <PeriodSelect
            defaultPeriod={ctor?.deposit.period}
            periods={ctor?.periods ?? []}
            onPeriodChange={(e) => setUpdates({ period: e })}
          />
        </div>
        <div className="staking-flag">
          <StakingInner />
          <div className="flag-label">{t("staking.allow_replenish")}</div>
          <div className="switch-wrapper">
            <input
              type="checkbox"
              className="switch"
              checked={request?.allowReplenish}
              disabled={ctor?.allowReplenish.isLocked}
              onChange={(e) => setUpdates({ allowReplenish: e.target.checked })}
            />
          </div>
        </div>
        <div>
          <div className="staking-flag">
            <StakingWithdraw />
            <div className="flag-label">{t("staking.allow_withdraw")}</div>
            <div className="switch-wrapper">
              <input
                type="checkbox"
                className="switch"
                checked={request?.allowWithdraw}
                disabled={ctor?.allowWithdraw.isLocked}
                onChange={(e) =>
                  setUpdates({ allowWithdraw: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
        <div>
          <div className="staking-flag">
            <StakingInterest />
            <div className="flag-label">{t("staking.leave_interest")}*</div>
            <div className="switch-wrapper">
              <input
                type="checkbox"
                className="switch"
                checked={request?.interestOnDepositAccount}
                disabled={ctor?.interestOnDepositAccount.isLocked}
                onChange={(e) =>
                  setUpdates({ interestOnDepositAccount: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
        <DepositInfo />
      </div>
      <div className="staking-actions">
        <BlueBorderedButton
          onClick={() => setUpdates({ isDefault: true })}
          text={t("staking.show_default")}
          isLoading={loading}
        />
        <BlueFilledButton
          onClick={() => createRequest()}
          text={t("Continue")}
          isLoading={loading}
          disabled={!agreement || hasError}
        />
      </div>
    </div>
  );
};

const StakingCalculatorPage: React.FC = () => {
  const { id } = useParams<string>();
  const { caseId } = useStore($calculator);

  React.useEffect(() => {
    const shcId = Number(id);
    if (caseId === 0 && shcId) {
      initCtor({ showcaseItemId: shcId });
    }
  }, [caseId, id]);

  return (
    <div>
      <StakingForm />
    </div>
  );
};

export default StakingCalculatorPage;
