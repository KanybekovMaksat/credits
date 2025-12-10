import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $cards, cardModalShown, getCardListFx } from "@store/card";
import BlueBorderedButton from "@compv2/Buttons/BlueBorderedButton";
import mastercard from "/v2/card-types/mastercard.svg";
import visa from "/v2/card-types/visa.svg";
import arrowDown from "/v2/icons/arrow.svg";
import "./styles.scss";

export interface CardSelectorProps {
  disabled?: boolean;
  currentCardId: string | null;
  cardChanged: (cardId: string) => void;
}

const CardSelector: React.FC<CardSelectorProps> = (
  props: CardSelectorProps
) => {
  const { disabled, cardChanged, currentCardId } = props;
  const { t } = useTranslation();
  const { cardList, cardsLoaded } = useStore($cards);
  const [isCardOpen, setCardOpen] = useState<boolean>(false);
  const [cardId, setCardId] = useState<string | null>(currentCardId);

  useEffect(() => {
    if (cardsLoaded === false) {
      getCardListFx();
    }
  }, [cardList]);

  useEffect(() => {
    if (!currentCardId && cardsLoaded && cardList?.length > 0)
      selectCard(cardList[0].id);
  }, [currentCardId]);

  const currentCardText = useMemo(() => {
    if (cardId && cardList) {
      const card = cardList.find((f) => f.id === cardId);
      if (card) {
        return (
          <div className="selected-card-number">
            <img
              src={
                card.maskedPan.startsWith("5")
                  ? "/v2/card-types/mastercard.svg"
                  : "/v2/card-types/visa.svg"
              }
            />
            {t("card_number")} {card.maskedPan}
          </div>
        );
      }
      return <></>;
    }
    return <></>;
  }, [cardId, cardList]);

  const selectCard = (id: string) => {
    cardChanged(id);
    setCardId(id);
    setCardOpen(false);
  };

  return (
    <div className="card-selector-v2">
      <div className="card-selector-header">
        <span>{t("add_visa_or_master")}</span>
        <div className="card-icons">
          <img src={mastercard} style={{ marginRight: "5px" }} />
          <img src={visa} />
        </div>
      </div>

      <div className="card-selector-input">
        <div
          className={`current-card ${disabled ? "disabled" : ""}`}
          onClick={() => {
            if (!disabled) setCardOpen(!isCardOpen);
          }}
        >
          {currentCardText} {disabled}
          {!disabled && (
            <div className="card-select-arrow">
              <img src={arrowDown} />
            </div>
          )}
        </div>

        {isCardOpen && (
          <div className="current-card-options">
            <ul>
              {cardList?.map((card) => (
                <li
                  className={cardId === card.id ? "selected" : ""}
                  key={card.id}
                  onClick={() => {
                    selectCard(card.id);
                  }}
                >
                  <img
                    src={
                      card.maskedPan.startsWith("5")
                        ? "/v2/card-types/mastercard.svg"
                        : "/v2/card-types/visa.svg"
                    }
                  />
                  {t("card_number")} {card.maskedPan}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!disabled && (
          <div className="card-selector-add-card">
            <BlueBorderedButton
              onClick={() => cardModalShown()}
              style={{ width: "55px", height: "51px" }}
              text={"+"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSelector;
