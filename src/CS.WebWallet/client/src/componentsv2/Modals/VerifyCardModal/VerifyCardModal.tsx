import React from "react";
import { useTranslation } from "react-i18next";

const VerifyCardModal: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="verify_card_modal">
      <span className="modal-title">{t("Add a payment card")}</span>
      <span className="modal-description">
        {t(
          "Due to country’s regulation we need to verify your card. It's free. We charge 1 EUR and return it immediately."
        )}
      </span>
    </div>
  );
};

export default VerifyCardModal;
