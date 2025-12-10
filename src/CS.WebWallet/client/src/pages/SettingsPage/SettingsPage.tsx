import React from "react";
import "./styles.scss";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import { $emailKyc } from "@store/kyc/email";
import Modal from "@components/Modal";
import {
  $settings,
  editEmailCanceled,
  editEmailStarted,
  editPhoneCanceled,
  editPhoneStarted,
  setEmailCanceled,
  setEmailStarted,
} from "./settings.store";
import EditEmail from "./EditEmail";
import EditPhone from "./EditPhone";
import { $phoneKyc } from "@store/kyc/phone";
import WhiteButton from "@components/WhiteButton";
import { profileStatusColor } from "@components/ProfileStatusTag/ProfileStatusTag";
import SetEmail from "./SetEmail";

const SettingsPage: React.FC = () => {
  const { editPhoneVisible, editEmailVisible, setMailVisible } =
    useStore($settings);

  const { currentEmail, status } = useStore($emailKyc);
  const { originalPhone, phoneStatus } = useStore($phoneKyc);
  const { t } = useTranslation();

  const statusText = (status: number) => {
    return status !== 2 ? (
      <div className={`status ${profileStatusColor(0)}`}>
        <span>{t("settings_page_not_verified")}</span>
      </div>
    ) : (
      <div className={`status ${profileStatusColor(2)}`}>
        <span>{t("settings_page_verified")}</span>
      </div>
    );
  };

  return (
    <div className="profile-settings-page">
      <div className="page-title">{t("settings_title")}</div>
      <div className="form-card" style={{ width: "100%", maxWidth: "800px" }}>
        <div className="row-edit">
          <div>{t("settings_phone")}</div>
          <div>{originalPhone}</div>
          <div className="row-end">
            {statusText(phoneStatus)}
            <WhiteButton onClick={editPhoneStarted}>{t("change")}</WhiteButton>
          </div>
        </div>
        <div style={{ paddingTop: "10px" }} />
        <div className="row-edit">
          <div>{t("settings_email")}</div>
          <div>{currentEmail}</div>
          <div className="row-end">
            {statusText(status)}
            <WhiteButton
              onClick={() => {
                if (status === 2) {
                  editEmailStarted();
                } else {
                  setEmailStarted();
                }
              }}
            >
              {t(status === 2 ? "change" : "set")}
            </WhiteButton>
          </div>
        </div>
      </div>
      <Modal modal={editPhoneVisible} setModal={editPhoneCanceled}>
        <EditPhone />
      </Modal>
      <Modal modal={editEmailVisible} setModal={editEmailCanceled}>
        <EditEmail />
      </Modal>
      <Modal modal={setMailVisible} setModal={setEmailCanceled}>
        <SetEmail />
      </Modal>
    </div>
  );
};

export default SettingsPage;
