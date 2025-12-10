import React from "react";
import "./styles.scss";
import Modal from "@components/Modal";
import AppLinksModal from "@components/Modal/AppLinksModal";
import {
  setModal,
  $appLinksModalData,
  resetAppLinksModal,
} from "@components/Modal/AppLinksModal/store/data";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";

const FooterV2: React.FC = () => {
  const { modal } = useStore($appLinksModalData);
  const { t } = useTranslation();

  return (
    <>
      <div className="footerv2">
        <div className="left">
          <a
            href="https://credits.com/legal.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{t("terms_conditions")}</span>
          </a>
          <a
            href="https://credits.com/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ paddingLeft: "44px" }}
          >
            <span>{t("privacy_policy")}</span>
          </a>
        </div>
        <div className="right">
          <div className="store-button" onClick={() => setModal("google_play")}>
            <img src="/images/app-store/google-get.svg" />
          </div>
          <div
            className="store-button"
            onClick={() => setModal("app_store")}
            style={{ paddingLeft: "15px" }}
          >
            <img src="/images/app-store/apple-get.svg" />
          </div>
        </div>
      </div>
      <Modal top modal={Boolean(modal)} setModal={resetAppLinksModal}>
        <AppLinksModal />
      </Modal>
    </>
  );
};

export default FooterV2;
