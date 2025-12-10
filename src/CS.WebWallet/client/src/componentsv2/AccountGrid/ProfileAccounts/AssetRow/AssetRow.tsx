import React, { useMemo } from "react";
import "./styles.scss";
import { AccountRow } from "@services/AccountsService";
import { useNavigate } from "react-router-dom";
import { AccountType } from "@enums/accountType";

interface AssetRowProps {
  asset: AccountRow;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset }) => {
  const navigate = useNavigate();

  const accountLink = useMemo(() => {
    if (asset.type === AccountType.Finance.id) {
      return `/wallet/${asset.accountId}`;
    }
    return `/accounts/${asset.accountId}`;
  }, [asset]);

  const { icon, ticker, text, amount, currencyAmount, alerts } = asset;

  return (
    <div className="asset_row" onClick={() => navigate(accountLink)}>
      <div className="asset_icon">
        <img src={icon} alt="icon" />
      </div>
      <div className="asset">
        <span className="asset_ticker">{ticker}</span>
        <span className="asset_name">{text}</span>
      </div>
      {alerts && alerts.length > 0 && (
        <img className="account_alert_icon" src={"/icons/alert.svg"} />
      )}

      <div className="asset_amount">
        <div>
          {amount} {ticker}
        </div>
        <div className="currency_amount">$ {currencyAmount}</div>
      </div>
    </div>
  );
};

export default AssetRow;
