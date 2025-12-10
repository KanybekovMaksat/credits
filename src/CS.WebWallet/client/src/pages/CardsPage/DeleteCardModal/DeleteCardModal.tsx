import React, { useMemo } from "react";
import "./styles.scss";
import Divider from "@components/Divider";
import BlueTextButton from "@components/BlueTextButton";
import BlueButton from "@components/BlueButton/BlueButton";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $cards, deleteCardConfirmed, deleteCardIdUpdated } from "@store/card";

const DeleteCardModal: React.FC = () => {
  const { t } = useTranslation();
  const { cardList, deleteId } = useStore($cards);
  const card = useMemo(() => {
    return cardList.find((f) => f.id === deleteId);
  }, [cardList]);

  return (
    <div className="delete_card_modal">
      <span className="delete_title">
        {card && `${t("delete_card")} **${card.maskedPan}?`}
      </span>
      <Divider />
      <div className="button_row">
        <BlueButton width={170} onClick={() => deleteCardConfirmed()}>
          {t("yes")}
        </BlueButton>
        <BlueTextButton onClick={() => deleteCardIdUpdated(null)}>
          {t("Cancel")}
        </BlueTextButton>
      </div>
    </div>
  );
};

export default DeleteCardModal;
