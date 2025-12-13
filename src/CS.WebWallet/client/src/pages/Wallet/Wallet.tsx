import React, { useMemo } from "react";
import "./styles.scss";
import { useStore } from "effector-react";

import { useTranslation } from "react-i18next";
import { $accounts } from "@store/accounts";
import BigNumber from "bignumber.js";
import { ProfileAccounts } from "@compv2/AccountGrid";
import { $showcase } from "@store/showcase";
import ShowcaseGrid from "@compv2/ShowcaseGrid";
import IssuedCards from "@compv2/IssuedCards";
import { $issuedCards } from "@store/issuedCards";
import BannerAnchor from "@compv2/Banners";

const Wallet: React.FC = () => {
  const { fiat } = useStore($accounts);
  const cards = useStore($issuedCards);
  const { bank, cardProducts } = useStore($showcase);
  const { t } = useTranslation();

  const totalBalance = useMemo(() => {
    const all = [...fiat];
    if (!all || all.length === 0) {
      return {
        balance: "0",
        currencyName: "",
      };
    }
    const issuedCardsBalance = (cards ?? []).reduce((acc, cur) => {
      return acc.plus(cur.balance.fiatBalance.amount.replace(/\s/gm, ""));
    }, new BigNumber(0));

    const balance = all.reduce((acc, cur) => {
      return acc.plus(cur.currencyAmount.replace(/\s/gm, ""));
    }, new BigNumber(issuedCardsBalance));

    const { currencyName } = all[0];
    return {
      balance,
      currencyName,
    };
  }, [fiat]);

  return (
    <section className="accounts_page">
      <div className="accounts_balance_area">
        <span className="balance">{`$ ${totalBalance.balance}`}</span>
        <span className="balance_sign">{t("Total balance of all assets")}</span>
      </div>

      <BannerAnchor placement={0} anchor="fiat-accounts" />
      <ProfileAccounts assets={fiat} />
      <ShowcaseGrid showcaseItems={bank} />
      <BannerAnchor placement={1} anchor="fiat-accounts" />
      <IssuedCards />
      <ShowcaseGrid showcaseItems={cardProducts} />
      <BannerAnchor placement={2} anchor="fiat-accounts" />
    </section>
  );
};

export default Wallet;