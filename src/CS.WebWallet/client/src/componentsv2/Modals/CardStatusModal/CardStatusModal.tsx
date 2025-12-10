import React, { useMemo } from "react";
import { useStore } from "effector-react";
import {
  $verifyCard,
  cardStatusModalHidden,
  cvcVerifyReceived,
  verifyCardApproved,
} from "@store/card";
import { useTranslation } from "react-i18next";
import "./cardStatus.scss";
import { CardStatus } from "@enums/cardStatus";
import BlueFilledButton from "../../Buttons/BlueFilledButton";
import SecurityCodeInput from "@compv2/Modals/NewCardModal/SecurityCodeInput";

const CardStatusModal: React.FC = () => {
  const { cardStatusModal, cardList, isVerifying } = useStore($verifyCard);
  const { t } = useTranslation();
  //const [cvv, setCvv] = useState<string | undefined>(undefined);
  //const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentStatus = useMemo(() => {
    const card = cardList.find((f) => f.id === cardStatusModal);

    if (card === undefined) {
      return CardStatus.NotVerified;
    }

    // TODO : normal enum search
    const status = card.status;
    if (status === CardStatus.NotVerified.id) return CardStatus.NotVerified;
    if (status === CardStatus.Verified.id) return CardStatus.Verified;
    if (status === CardStatus.Expired.id) return CardStatus.Expired;
    if (status === CardStatus.Blocked.id) return CardStatus.Blocked;
    if (status === CardStatus.Moderation.id) return CardStatus.Moderation;
    return CardStatus.NotVerified;
  }, [cardStatusModal]);

  const verify = () => {
    verifyCardApproved();
  };

  const footer = () => {
    const card = cardList.find((f) => f.id === cardStatusModal);
    if (card !== undefined && card.status === CardStatus.NotVerified.id) {
      return (
        <>
          <div className="status-description">
            {t("card_modal_description_not_verified")}
          </div>
          <SecurityCodeInput onChange={(e) => cvcVerifyReceived(e)} />
          <BlueFilledButton
            isLoading={isVerifying}
            onClick={() => verify()}
            text={t("Continue")}
          />
        </>
      );
    }
    return (
      <>
        <div className="status-description">
          {t("card_modal_description_status_other")}
        </div>
        <BlueFilledButton
          onClick={() => cardStatusModalHidden()}
          text={t("Continue")}
        />
      </>
    );
  };

  return (
    <div className="card_status_modal">
      <span className="modal-title">{t("card_modal_warning_title")}</span>
      <div className="status-description">
        <span>{t("card_modal_about_status")}</span>
        <span className="card_status">{currentStatus.title}</span>
      </div>
      {footer()}
    </div>
  );
};

export default CardStatusModal;
