import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import CodeInput from "@compv2/Inputs/CodeInput";
import { $otp, codeChanged, confirmCode } from "@store/otp";
import { BlueFilledButton } from "@compv2/Buttons";
import "./otpCardModal.scss";

const OtpCodeModal: React.FC = () => {
  const { t } = useTranslation();
  const { sent, loading } = useStore($otp);

  return (
    <div className="otp-modal">
      <span className="modal-title">{t("otp_modal_title")}</span>
      <CodeInput onChange={codeChanged} />
      <BlueFilledButton
        text={t("Confirm")}
        onClick={confirmCode}
        //disabled={continueDisabled}
        isLoading={loading}
      />

      {sent === "done" && (
        <div className="error_div">Confirmation code failed</div>
      )}
    </div>
  );
};

export default OtpCodeModal;
