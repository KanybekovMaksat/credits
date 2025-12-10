import React, { useCallback, useEffect, useMemo } from "react";
import "./cardview.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $card,
  $newPasswordFlow,
  cardIdReceived,
  hideCard,
  newPasswordReceived,
  newPasswordSubmit,
  passwordModalOpen,
  showCard,
} from "@store/issuedCards";

import CardIcon from "@compv2/CardIcon";
import HistoryCard from "@components/HistoryCard";
import WhiteButton from "@components/WhiteButton";
import Loader from "@components/Loader";
import StatementByPeriod from "@components/Modal/StatementByPeriod";

import eyeShow from "/icons/eye-show.svg";
import eyeHide from "/icons/eye-hide.svg";

import {
  $accountDetails,
  statementModalChanged,
} from "../AccountDetailsPage/accountDetailsPage.store";
import CopyButton from "@compv2/Buttons/CopyButton";
import { IssuedCardStatusEnum } from "@enums/cardStatus";
import { activateCardModalShow } from "@store/activateCard";
import { copyToClipboard } from "../../helpers/clipboard";
import Modal from "@components/Modal";
import { AccountRow } from "@services/AccountsService";
import BlueTextButton from "@components/BlueTextButton";
import { $accounts } from "@store/accounts";

const CardViewPage: React.FC = () => {
  const { cardId } = useParams<string>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { all } = useStore($accounts);
  useEffect(() => {
    if (cardId) {
      cardIdReceived(cardId);
    }
    return () => hideCard();
  }, [cardId]);

  const { statementModal } = useStore($accountDetails);
  const { current, visible, loading, passwordModal } = useStore($card);
  const { newPassword, passwordErrors } = useStore($newPasswordFlow);

  const copy = (text: string | undefined) => {
    if (text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        return;
      }
      copyToClipboard(text);
    }
  };

  const actionButtons = useMemo(() => {
    const res: JSX.Element[] = [];
    if (current === undefined || current === null) {
      return res;
    }

    if (current.status === IssuedCardStatusEnum.Inactive.id) {
      res.push(
        <WhiteButton
          key="topup"
          icon="/icons/start.svg"
          onClick={() => activateCardModalShow(current.id)}
        >
          {t("card_issued_button_activate")}
        </WhiteButton>
      );
    }

    if (current.status === IssuedCardStatusEnum.Active.id) {
      const account = all.find(
        (e) => e.accountId === current.internalAccountId
      );
      res.push(
        <WhiteButton
          key="topup"
          icon="/icons/topup.svg"
          onClick={() => navigate(`/operation?to=${current.internalAccountId}`)}
        >
          {t("account.topUp")}
        </WhiteButton>
      );

      if ((account?.operations.transfer ?? []).length > 0)
        res.push(
          <WhiteButton
            key="send"
            icon="/icons/send.svg"
            onClick={() =>
              navigate(`/operation?from=${current.internalAccountId}`)
            }
          >
            {t("account.transfer")}
          </WhiteButton>
        );
      res.push(
        <WhiteButton
          key="set_password"
          icon="/icons/lock.svg"
          onClick={() => passwordModalOpen()}
        >
          {t("card_set_password")}
        </WhiteButton>
      );
    }

    if (current.status > 1) {
      res.push(
        <WhiteButton
          key="statements"
          icon="/icons/statements.svg"
          onClick={statementModalChanged}
        >
          {t("account_view_statements")}
        </WhiteButton>
      );
    }

    return res;
  }, [current, all, t]);

  const cardPanel = useMemo(() => {
    if (loading) return <Loader />;

    return (
      <>
        <div className="pan">
          {current?.pan}
          {visible && <CopyButton onClick={() => copy(current?.pan)} />}
        </div>
        <div className="holder">
          {current?.holder}
          {visible && <CopyButton onClick={() => copy(current?.holder)} />}
        </div>
        <div className="expire">
          {current?.expiryMonth} / {current?.expiryYear}
          {visible && (
            <CopyButton
              onClick={() =>
                copy(`${current?.expiryMonth} / ${current?.expiryYear}`)
              }
            />
          )}
        </div>
        <div className="cvv">
          {current?.pin ?? "••••"}
          {visible && <CopyButton onClick={() => copy(current?.pin)} />}
        </div>
        <div className="icon">
          {current?.type && <CardIcon cardType={current?.type} />}
        </div>
        <div
          className="show-hide"
          onClick={() => (visible ? hideCard() : showCard())}
        >
          {visible ? (
            <>
              <img src={eyeHide} /> Hide
            </>
          ) : (
            <>
              <img src={eyeShow} /> Show
            </>
          )}
        </div>
      </>
    );
  }, [loading, current, visible]);

  const errors = useCallback(() => {
    if (passwordErrors.length > 0) {
      return (
        <div className="password-validation">
          {passwordErrors.map((m) => (
            <span key={m}>{t(m)}</span>
          ))}
        </div>
      );
    }
    return <></>;
  }, [passwordErrors]);
  return (
    <>
      <div className="card-view-page form-card">
        <div className="asset-balance">
          <span className="current-balance">{t("account_view_balance")}</span>
          <div className="description">
            <span className="amount">{`${current?.balance.amount} ${current?.balance.symbol}`}</span>
            <span className="fiat-amount">{` ${current?.balance.fiatBalance.amount} ${current?.balance.fiatBalance.symbol}`}</span>
          </div>
        </div>
        <div className="card-front">{cardPanel}</div>
        <div className="actions">{actionButtons}</div>
      </div>
      <div className="page-title">{t("History")}</div>
      <HistoryCard accountId={current?.internalAccountId} />
      <Modal modal={statementModal} setModal={statementModalChanged}>
        <StatementByPeriod
          setModal={() => statementModalChanged()}
          account={
            { accountId: current?.internalAccountId ?? "" } as AccountRow
          }
        />
      </Modal>
      <Modal modal={passwordModal} setModal={() => passwordModalOpen()}>
        <div className="edit_settings_modal password-modal">
          <span className="modal-title">{t("set_password_modal_title")}</span>
          <div className="new_number">
            {t("set_password_modal_input_title")}
          </div>
          <input
            className="cs_input"
            style={{ marginBottom: "10px" }}
            onChange={(e) => newPasswordReceived(e.target.value)}
            type="password"
          />
          <>{errors()}</>
          <BlueTextButton
            width={130}
            height={45}
            bordered
            disabled={
              newPassword === undefined ||
              newPassword.length === 0 ||
              passwordErrors.length > 0
            }
            onClick={() => newPasswordSubmit()}
          >
            {t("set_password_modal_button")}
          </BlueTextButton>
        </div>
      </Modal>
    </>
  );
};
export default CardViewPage;
