import React, { useMemo, useState } from "react";
import "./styles.scss";
import { $cards, addNewCardFx } from "@store/card";
import { useTranslation } from "react-i18next";
import CardNumberInput from "@compv2/Modals/NewCardModal/CardNumberInput";
import ExpirationDateInput from "@compv2/Modals/NewCardModal/ExpirationDateInput";
import BlueFilledButton from "../../Buttons/BlueFilledButton";
import { useStore } from "effector-react";

const NewCardModal: React.FC = () => {
  const { isSavingCard } = useStore($cards);
  const { t } = useTranslation();

  const [cardNumber, setCardNumber] = useState<string>();
  const [expiryDate, setExpiryDate] = useState<string>();
  const [holder, setHolder] = useState<string>();

  const isEnabledContinue = useMemo(() => {
    return (
      cardNumber !== undefined &&
      cardNumber !== "" &&
      expiryDate !== undefined &&
      expiryDate !== "" &&
      holder !== undefined &&
      holder !== ""
    );
  }, [cardNumber, expiryDate, holder]);
  const saveCard = async () => {
    if (cardNumber && expiryDate && holder) {
      const [month, year] = expiryDate?.split("/");
      await addNewCardFx({
        expireMonth: month,
        expireYear: `20${year}`,
        number: cardNumber.replace(/\s/, ""),
        holderName: holder.toUpperCase(),
      });
    }
  };

  return (
    <div className="new-card-modal">
      <span className="modal-title">{t("Add a payment card")}</span>
      <div className="card-info-container">
        <div className="card-info-container-element">
          <CardNumberInput onChange={setCardNumber} />
        </div>
        <div className="card-info-container-element">
          <input
            style={{ textTransform: "uppercase" }}
            placeholder={t("card_holder")}
            value={holder}
            onKeyPress={(event: any) => {
              if (/[^a-zA-Z\s]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(e: any) => setHolder(e.target.value)}
          />
        </div>
        <div className="card-cvv">
          <div className="card-info-container-element">
            <ExpirationDateInput onChange={setExpiryDate} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "25px",
          justifyContent: "center",
        }}
      >
        <BlueFilledButton
          isLoading={isSavingCard}
          disabled={!isEnabledContinue}
          onClick={() => saveCard()}
          text={t("Continue")}
        />
      </div>
    </div>
  );
};

export default NewCardModal;
