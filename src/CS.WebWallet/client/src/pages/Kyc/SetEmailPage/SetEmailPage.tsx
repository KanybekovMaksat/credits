import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import {
  $emailKyc,
  confirmFirstCodeEv,
  firstCodeEv,
  newEmailReceivedEv,
  sendFirstCodeEv,
} from "@store/kyc/setEmail";
import { KycStatuses } from "@enums/kyc";
import { $kyc } from "@store/kyc/kyc";
import CodeInput from "@compv2/Inputs/CodeInput";
import { BlueFilledButton } from "@compv2/Buttons";

import "./setEmailPage.scss";

const SetEmailPage: FC = () => {
  const { t } = useTranslation();
  const { email } = useStore($kyc);
  const { smsSent, error, mail } = useStore($emailKyc);

  return (
    <div className="set-email-layout-container">
      <div className="set-email-layout-content">
        <div className="titles">
          <span className="modal-title">{t("layout_email_title")}</span>
          <div className="new_number">{t("layout_email_subtitle")}</div>
        </div>
        <input
          className="cs_input"
          value={mail ?? ""}
          style={{ marginBottom: "10px" }}
          onChange={(e) => newEmailReceivedEv(e.target.value)}
        />
        {smsSent === false && (
          <div className="action-buttons">
            <BlueFilledButton
              disabled={
                email?.status !== KycStatuses.Created.id &&
                email?.status !== KycStatuses.OnReview.id
              }
              onClick={() => sendFirstCodeEv()}
              text={t("layout_send_button")}
            />
          </div>
        )}
        {smsSent === true && (
          <>
            <div className="description" style={{ paddingBottom: "10px" }}>
              {t("layout_email_code_send")}
            </div>
            <CodeInput onChange={(e) => firstCodeEv(e)} />
            <div className="description" style={{ paddingBottom: "15px" }} />

            <div className="action-buttons">
              <BlueFilledButton
                onClick={() => confirmFirstCodeEv()}
                text={t("layout_confirm_button")}
              />
            </div>
          </>
        )}
        {error && (
          <div className="error_div" style={{ marginTop: "10px" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetEmailPage;
