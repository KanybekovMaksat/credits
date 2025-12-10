import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useTranslation } from "react-i18next";

interface BuyButtonProps {
  link: string;
}

const BuyButton: React.FC<BuyButtonProps> = (
  props: BuyButtonProps
): JSX.Element => {
  const { link } = props;
  const { t } = useTranslation();

  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="buy-button"
      onClick={() => {
        navigate(link);
      }}
    >
      {`+ ${t("buy_button")}`}
    </button>
  );
};

export default BuyButton;
