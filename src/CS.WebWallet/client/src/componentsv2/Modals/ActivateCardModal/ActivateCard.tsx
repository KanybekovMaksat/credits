import React from "react";
import { useTranslation } from "react-i18next";
import "./activateCardModal.scss";
import { BlueFilledButton } from "@compv2/Buttons";
import BorderedButton from "@compv2/Buttons/BorderedButton";
import {
  $activateCard,
  activateCardModalHidden,
  activationFinished,
  confirmCodeReceived,
  startActivation,
} from "@store/activateCard";
import { useStore } from "effector-react";
import CodeInput from "@compv2/Inputs/CodeInput";
import ConfirmationIcon from "@components/Icons/ConfirmationIcon/ConfirmationIcon";

const ActivateCardModal: React.FC = () => {
  const { t } = useTranslation();
  const {
    step,
    startActivationPending,
    confirmActivationPending,
    error,
    codeLength,
  } = useStore($activateCard);
  return (
    <div className="activate-card-modal">
      <span className="modal-title">
        {t("card_issued_activate_modal_title")}
      </span>
      {step === 0 && (
        <>
          <span className="modal-description">
            {t("card_issued_activate_modal_description")}
          </span>
          <div className="error_div">{error}</div>
          <div className="activate-actions">
            <BlueFilledButton
              text={t("Yes")}
              onClick={() => startActivation()}
              isLoading={startActivationPending}
            />
            <BorderedButton
              text={t("No")}
              onClick={() => activateCardModalHidden()}
            />
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <span className="modal-description">
            {t("card_issued_activate_modal_need_confirm")}
          </span>
          <div className="code-input">
            <CodeInput onChange={confirmCodeReceived} />
          </div>
          <div className="error_div">{error}</div>
          <div className="activate-actions">
            <BlueFilledButton
              text={t("Confirm")}
              onClick={() => startActivation()}
              isLoading={confirmActivationPending}
              disabled={codeLength < 6}
            />
            <BorderedButton
              text={t("Cancel")}
              onClick={() => activateCardModalHidden()}
            />
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <span className="modal-description">
            {t("card_issued_activate_modal_success")}
          </span>
          <div className="code-input">
            <ConfirmationIcon />
          </div>
          <div className="activate-actions">
            <BlueFilledButton
              text={t("close")}
              onClick={() => activationFinished()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ActivateCardModal;
