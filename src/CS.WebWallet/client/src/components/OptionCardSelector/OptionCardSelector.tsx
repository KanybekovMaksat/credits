import React from "react";
import "./styles.scss";
import { Card } from "@services/CardsService";
import { useTranslation } from "react-i18next";

export interface OptionProps {
  card: Card;
  inputHandler: (card: Card) => (event: React.MouseEvent) => void;
}

const Option: React.FC<OptionProps> = (props: OptionProps): JSX.Element => {
  const { card, inputHandler } = props;
  const { t } = useTranslation();

  return (
    <button type="button" onClick={inputHandler(card)} className="card-option">
      <span>
        {t("card_number")} *{card.maskedPan}
      </span>
    </button>
  );
};

export default Option;
