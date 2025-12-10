import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $emailKyc,
  confirmFirstCodeEv,
  confirmSecondCodeEv,
  firstCodeEv,
  newEmailReceivedEv,
  secondCodeEv,
  sendFirstCodeEv,
} from "@store/kyc/email";
import "./edit-settings-modal.scss";
import CodeInput from "@compv2/Inputs/CodeInput";
import BlueTextButton from "@components/BlueTextButton";

const EditEmail: FC = () => {
  const { smsSent, firstSmsApproved, error, status, mail } =
    useStore($emailKyc);

  const { t } = useTranslation();

  return (
    <div className="edit_settings_modal">
      <span className="modal-title">{t("chane_email_title")}</span>
      <div className="new_number">
        {status === 1 ? t("change_email_new") : t("change_email_current")}
      </div>
      <input
        className="cs_input"
        style={{ marginBottom: "10px" }}
        defaultValue={mail ?? ""}
        onChange={(e) => newEmailReceivedEv(e.target.value)}
      />
      <div className="description">{t("change_email_send_sms")}</div>
      {firstSmsApproved === false && smsSent === false && (
        <div style={{ marginBottom: "10px" }}>
          <BlueTextButton
            width={130}
            height={45}
            bordered
            onClick={() => sendFirstCodeEv()}
          >
            {t("send")}
          </BlueTextButton>
        </div>
      )}
      {firstSmsApproved === false && smsSent && (
        <>
          <div className="new_number">{t("change_email_code")}</div>
          <CodeInput onChange={(e) => firstCodeEv(e)} />
          <div className="description" style={{ paddingBottom: "15px" }} />
          <BlueTextButton
            width={130}
            height={45}
            bordered
            onClick={() => confirmFirstCodeEv()}
          >
            {t("Continue")}
          </BlueTextButton>
        </>
      )}

      {firstSmsApproved && (
        <>
          <div className="description" style={{ paddingBottom: "15px" }} />
          <div className="new_number">{t("change_email_newemail_code")}</div>
          <CodeInput
            onChange={(e) => secondCodeEv(e)}
            placeholder="settings_input_code_placeholder"
          />
          <div className="description" style={{ paddingBottom: "15px" }} />
          <BlueTextButton
            width={130}
            height={45}
            bordered
            onClick={() => confirmSecondCodeEv()}
          >
            {t("Confirm")}
          </BlueTextButton>
        </>
      )}
      {error && <div className="error_div">{error}</div>}
    </div>
  );
};

export default EditEmail;
