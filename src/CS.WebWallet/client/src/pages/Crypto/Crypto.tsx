import React, { useMemo } from "react";
import { useStore } from "effector-react";

import { useTranslation } from "react-i18next";
import { $accounts } from "@store/accounts";
import BigNumber from "bignumber.js";
import { ProfileAccounts } from "@compv2/AccountGrid";
import ShowcaseGrid from "@compv2/ShowcaseGrid";
import { $showcase } from "@store/showcase";
import "./styles.scss";
import BannerAnchor from "@compv2/Banners";

const Crypto: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { prepaid, crypto, shares } = useStore($accounts);
  const { fiat: fiatShowcaseItems, crypto: cryptoShowcaseItems } =
    useStore($showcase);

  const totalBalance = useMemo(() => {
    const res = [...crypto, ...prepaid, ...shares];
    if (!res || res.length === 0) {
      return {
        balance: "",
        currencyName: "",
      };
    }
    const balance = res.reduce((acc, cur) => {
      return acc.plus(cur.currencyAmount.replace(/\s/gm, ""));
    }, new BigNumber(0));
    const { currencyName } = res[0];
    return {
      balance,
      currencyName,
    };
  }, [crypto, prepaid]);

  return (
    <section className="accounts_page">
      <div className="accounts_balance_area">
        <span className="balance">{`$ ${totalBalance.balance}`}</span>
        <span className="balance_sign">{t("Total balance of all assets")}</span>
      </div>
      <BannerAnchor placement={0} anchor="crypto-accounts" />
      <ProfileAccounts assets={prepaid} />
      <ShowcaseGrid showcaseItems={fiatShowcaseItems} />
      <BannerAnchor placement={1} anchor="crypto-accounts" />
      <ShowcaseGrid showcaseItems={cryptoShowcaseItems} />
      <ProfileAccounts assets={shares} />
      <BannerAnchor placement={2} anchor="crypto-accounts" />
      <ProfileAccounts assets={crypto} hideZeroBalances />
    </section>
  );
};

export default Crypto;
