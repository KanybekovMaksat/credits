import React, { FC } from "react";
import BlueTextButton from "@components/BlueTextButton";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $emailKyc,
  confirmFirstCodeEv,
  firstCodeEv,
  newEmailReceivedEv,
  sendFirstCodeEv,
} from "@store/kyc/setEmail";
import "./edit-settings-modal.scss";
import CodeInput from "@compv2/Inputs/CodeInput";

const SetEmail: FC = () => {
  const { smsSent, error, mail } = useStore($emailKyc);

  const { t } = useTranslation();

  return (
    <div className="edit_settings_modal">
      <span className="modal-title">{t("set_email_title")}</span>
      <div className="new_number">{t("set_email_new")}</div>
      <input
        className="cs_input"
        defaultValue={mail ?? ""}
        style={{ marginBottom: "10px" }}
        onChange={(e) => newEmailReceivedEv(e.target.value)}
      />
      {smsSent === false && (
        <>
          <BlueTextButton
            width={130}
            height={45}
            bordered
            onClick={() => sendFirstCodeEv()}
          >
            {t("send")}
          </BlueTextButton>
        </>
      )}
      {smsSent === true && (
        <>
          <div className="description">{t("change_phone_send_email")}</div>
          <div className="new_number">{t("change_phone_code_email")}</div>
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
      {error && <div className="error_div">{error}</div>}
    </div>
  );
};

export default SetEmail;
