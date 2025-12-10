import React from "react";
import { useStore } from "effector-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  $data,
  initOptions,
  operationCheck,
  operationSubmit,
  resetOperation,
  setFromAmount,
  setFromOption,
  setOptions,
  setRespondent,
  setToAmount,
  setToOption,
} from "./OperationPage.store";
import { BlueFilledButton } from "@compv2/Buttons";
import { useTranslation } from "react-i18next";
import ElementSelector from "./components/ElementSelector";
import useQuery from "../../hooks/useQuery";
import OperationCheckInfo from "./components/OperationCheckInfo";
import CodeInput from "./components/CodeInput";
import CardSelector from "@compv2/CardSelector";
import BankRequisites from "./components/BankRequisites";
import BankRequisitesFull from "./components/BankRequisitesFull";
import WalletInput from "./components/WalletInput";
import { Direction, groups } from "./types";
import { $accounts, getAccountsSilent } from "@store/accounts";
import { AccountRow } from "@services/AccountsService";
import { toNum } from "@helpers/amountHelper";
import WalletQr from "./components/WalletQr";
import TopupBankRequisites from "./components/TopupBankRequisites";
import UseBonuses from "./components/UseBonuses";
import HistoryCard from "@components/HistoryCard";

import "./OperationPage.scss";
import BannerAnchor from "@compv2/Banners";
import BankRequisitesFullSwift from "./components/BankRequisitesFullSwift";

export interface OperationPageProps {
  from?: string;
  to?: string;
  direction?: Direction;
}

const getGroupsByDirection = (direction: Direction, accounts: AccountRow[]) => {
  const result: groups = { from: [], to: [] };
  switch (direction) {
    case Direction.TopUpCrypto:
      result.from.push({ name: "", options: [{ type: "walletRequisites" }] });
      result.to.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 10)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });
      break;
    case Direction.TopUpPrepaid:
      result.from.push({ name: "", options: [{ type: "appCard" }] });
      result.to.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 30)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });
      break;
    case Direction.TopUpRequisites:
      result.from.push({ name: "", options: [{ type: "requisites" }] });
      result.to.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 30)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });
      break;
    case Direction.WithdrawCrypto:
      result.from.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 10 && toNum(e.amount) > 0)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });

      result.to.push({ name: "", options: [{ type: "wallet" }] });
      break;
    case Direction.WithdrawPrepaid:
      result.from.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 30 && toNum(e.amount) > 0)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });

      result.to.push({ name: "", options: [{ type: "appCard" }] });
      break;
    case Direction.WithdrawRequisites:
    case Direction.Swift:
      result.from.push({
        name: "",
        options: accounts
          .filter((e) => e.type === 30 && toNum(e.amount) > 0)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });

      result.to.push({
        name: "",
        options: [
          {
            type:
              direction === Direction.Swift
                ? "fullRequisitesSwift"
                : "requisites",
          },
        ],
      });
      break;
    case Direction.Exchange:
      result.from.push({
        name: "",
        options: accounts
          .filter((e) => e.operations.exchange?.length > 0)
          .map((e) => ({ type: "account", accountId: e.accountId })),
      });

      result.to.push({
        name: "",
        options:
          accounts
            .find((e) => e.operations.exchange?.length > 0)
            ?.operations.exchange.map((e) => ({
              type: "account",
              accountId: e.to,
            })) ?? [],
      });
      break;
  }

  return { ...result, ...{ direction } };
};

const OperationPage: React.FC<OperationPageProps> = (props) => {
  const { from, to, direction } = props;
  const { t } = useTranslation();
  const query = useQuery();
  const navigation = useNavigate();
  const { accountId, op } = useParams();
  const fromId = query.get("from") ?? accountId ?? from;
  const toId = query.get("to") ?? to;
  const opDirection = direction ?? (Number(query.get("op") ?? op) as Direction);
  const { all } = useStore($accounts);

  const {
    loading,
    canContinue,
    error,
    check,
    respondent,
    options,
    fromOption,
    toOption,
    fromAmount,
    toAmount,
  } = useStore($data);

  React.useEffect(() => {
    if (all.length === 0) getAccountsSilent();
  }, [all]);

  React.useEffect(() => {
    return () => resetOperation();
  }, []);

  React.useEffect(() => {
    if (fromId && fromId !== fromOption?.accountId) {
      initOptions({ fromId, direction: opDirection });
      return;
    }
    if (toId && toId !== toOption?.accountId && !fromId) {
      initOptions({ toId, direction: opDirection });
      return;
    }
    if (!toId && !fromId && opDirection !== Direction.None) {
      const options = getGroupsByDirection(opDirection, all);

      setOptions(options);
      setFromOption(options.from[0].options[0]);
      setToOption(options.to[0].options[0]);
      return;
    }
  }, [fromId, toId, opDirection, all]);

  const requisites = React.useMemo(() => {
    switch (fromOption?.type) {
      case "appCard":
        return (
          <CardSelector
            disabled={loading}
            currentCardId={null}
            cardChanged={(e) =>
              setRespondent({
                ...respondent,
                ...{ cardId: e },
              })
            }
          />
        );
      case "walletRequisites":
        return <WalletQr />;
      case "requisites":
        return <TopupBankRequisites accountId={toOption?.accountId} />;
    }

    switch (toOption?.type) {
      case "fullRequisites":
        return <BankRequisitesFull />;
      case "fullRequisitesSwift":
        return <BankRequisitesFullSwift />;
      case "wallet":
        return <WalletInput />;
      case "appCard":
        return (
          <CardSelector
            disabled={loading}
            currentCardId={null}
            cardChanged={(e) =>
              setRespondent({
                ...respondent,
                ...{ cardId: e },
              })
            }
          />
        );
      case "requisites":
        return <BankRequisites />;
    }

    return <></>;
  }, [fromOption, toOption, loading]);

  const showAmount =
    fromOption?.type !== "walletRequisites" &&
    fromOption?.type !== "requisites";

  const swap = () => {
    initOptions({
      fromId: toOption.accountId,
      toId: fromOption.accountId,
      direction: Direction.Exchange,
    });
    setFromAmount(0);
    setToAmount(0);
  };

  const max = () => {
    const amount = toNum(
      all.find((e) => e.accountId === fromOption.accountId)?.amount ?? 0
    );
    setFromAmount(amount);
  };

  const historyType = () => {
    switch (direction) {
      case Direction.WithdrawCrypto:
        return 1;
      case Direction.Exchange:
        return 4;
    }

    return undefined;
  };

  return (
    <div className="app-page">
      <div className="page-content">
        <BannerAnchor placement={0} anchor="operations" />
        <div className="form-card">
          <div>
            {opDirection === Direction.Exchange && (
              <div className="sub-actions">
                <span onClick={() => max()}>MAX</span>
              </div>
            )}
            <ElementSelector
              loading={loading}
              item={fromOption}
              options={options.from}
              source={showAmount}
              onElementChange={(e) => {
                if (opDirection === Direction.Exchange) {
                  resetOperation();
                  navigation(`/operation/${e.accountId}/7`);
                  return;
                }
                setFromOption(e);
              }}
              onValueChange={(e) => {
                if (e !== undefined) setFromAmount(e);
              }}
              value={fromAmount}
            />
          </div>
          {opDirection === Direction.Exchange && (
            <div className="options-swap" onClick={() => swap()}></div>
          )}
          <div>
            <ElementSelector
              loading={loading}
              item={toOption}
              options={options.to}
              source={opDirection === Direction.Exchange}
              onElementChange={(e) => setToOption(e)}
              onValueChange={(e) => {
                if (e !== undefined) setToAmount(e);
              }}
              value={toAmount}
            />
          </div>

          <div className="account-requisites">{requisites}</div>
          {error && (
            <div className="error_div" style={{ marginBottom: "10px" }}>
              {error}
            </div>
          )}
          <UseBonuses />
          <OperationCheckInfo />
          <CodeInput />
          {showAmount && (
            <BlueFilledButton
              onClick={() => (check ? operationSubmit() : operationCheck())}
              text={t("Continue")}
              isLoading={loading}
              disabled={!canContinue}
            />
          )}
        </div>
        <BannerAnchor placement={1} anchor="operations" />
        <div
          className="page-title"
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          {t("History")}
        </div>
        <HistoryCard
          accountId={fromId ?? fromOption?.accountId ?? toOption.accountId}
          operationType={historyType()}
        />

        <BannerAnchor placement={2} anchor="operations" />
      </div>
    </div>
  );
};

export default OperationPage;
