import React from "react";
import "./styles.scss";
import { Col, Row } from "@components/Layouts/RowLayout";
import closeIcon from "/icons/closeModal.svg";
import { useTranslation } from "react-i18next";

interface DownloadCreditsProps {
  setModal: (value: boolean) => void;
}

const DownloadCredits: React.FC<DownloadCreditsProps> = (
  props: DownloadCreditsProps
) => {
  const { t } = useTranslation();
  const { setModal } = props;

  const appStoreLink = "https://apps.apple.com/ru/credits/id1502902555";
  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=com.credits.Wallet";

  return (
    <Col className="download-credits-modal">
      <div className="close-icon" onClick={() => setModal(false)}>
        <img src={closeIcon} alt="close" />
      </div>
      <h1>{t("download_credits")}</h1>
      <span className="download-info">{t("change_email_promo")}</span>
      <Row className="store-links-img">
        <a href={googlePlayLink} target="_blank" rel="noopener noreferrer">
          <img src="/images/google-play/google-play.png" alt="google play" />
        </a>
        <a href={appStoreLink} target="_blank" rel="noopener noreferrer">
          <img src="/images/app-store/app-store.png" alt="app store" />
        </a>
      </Row>
      <Row className="store-links-qr">
        <img src="/images/app-store/qr-code-google.png" alt="google play" />
        <img src="/images/app-store/qr-code-apple.png" alt="app store" />
      </Row>
      <Row className="store-links">
        <a href={googlePlayLink} target="_blank" rel="noopener noreferrer">
          {t("or_click_google")}
        </a>
        <a href={appStoreLink} target="_blank" rel="noopener noreferrer">
          {t("or_click_apple")}
        </a>
      </Row>
    </Col>
  );
};

export default DownloadCredits;
