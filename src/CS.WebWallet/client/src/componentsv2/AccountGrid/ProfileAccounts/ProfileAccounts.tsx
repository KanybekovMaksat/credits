import React from "react";
import { useTranslation } from "react-i18next";
import { AccountRow } from "@services/AccountsService";
import { toNum } from "@helpers/amountHelper";
import Divider from "@components/Divider";
import AssetRow from "./AssetRow";
import "./styles.scss";

interface ProfileAccountsV2Props {
  assets: AccountRow[];
  hideZeroBalances?: boolean;
}

const ProfileAccounts: React.FC<ProfileAccountsV2Props> = ({
  assets,
  hideZeroBalances,
}) => {
  const { t } = useTranslation();

  if (assets.length === 0) {
    return <></>;
  }
  const topAssets = hideZeroBalances
    ? assets.filter((e) => toNum(e.amount) > 0)
    : assets;

  const collapsed =
    hideZeroBalances &&
    topAssets.length > 0 &&
    topAssets.length !== assets.length
      ? assets.filter((e) => toNum(e.amount) <= 0)
      : [];

  return (
    <div className="profile_accounts">
      <ul>
        {(topAssets.length > 0 ? topAssets : assets).map((el, index) => {
          return (
            <li key={el.accountId}>
              <AssetRow asset={el} />
              {index !== topAssets.length - 1 && (
                <Divider className="cs_divider" />
              )}
            </li>
          );
        })}
      </ul>
      {collapsed.length > 0 && (
        <div className="collapser">
          <input
            type="checkbox"
            onChange={(e) => console.log(e.target.checked)}
          />
          <i></i>
          <div className="label">{t("zero_balance")}</div>
          <ul>
            {collapsed.map((el, index) => {
              return (
                <li key={el.accountId}>
                  <AssetRow asset={el} />
                  {index !== collapsed.length - 1 && (
                    <Divider className="cs_divider" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileAccounts;
