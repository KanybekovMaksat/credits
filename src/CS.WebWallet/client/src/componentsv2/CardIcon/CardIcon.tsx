import React, { useMemo } from "react";
import { CardType } from "@enums/cardType";

import visa from "/v2/card-types/visa.svg";
import mastercard from "/v2/card-types/mastercard.svg";
import amex from "/v2/card-types/amex.svg";
import unionpay from "/v2/card-types/unionpay.svg";
import jcb from "/v2/card-types/jcb.svg";

interface CardIconType {
  cardType: number;
}

// duplicate name - rename another file
const CardIcon: React.FC<CardIconType> = ({ cardType }: CardIconType) => {
  const src = useMemo(() => {
    if (cardType === CardType.MasterCard.id) return mastercard;
    if (cardType === CardType.Amex.id) return amex;
    if (cardType === CardType.UnionPay.id) return unionpay;
    if (cardType === CardType.Jcb.id) return jcb;

    return visa;
  }, [cardType]);

  return <img src={src} width="100%" height="100%" />;
};

export default CardIcon;
