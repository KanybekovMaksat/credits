import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import QRCode from "react-qr-code";
import CopyButton from "@compv2/Buttons/CopyButton";
import { $accounts } from "@store/accounts";
import { $data } from "../../OperationPage.store";
import { copyToClipboard } from "@helpers/clipboard";
import "./walletQr.scss";

const WalletQr: React.FC = () => {
  const { t } = useTranslation();
  const { all } = useStore($accounts);
  const { toOption } = useStore($data);

  const account = React.useMemo(() => {
    return all.find((e) => e.accountId === toOption.accountId);
  }, [toOption]);

  const copy = async (text: string | undefined) => {
    if (text) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        copyToClipboard(text);
      }
    }
  };

  return (
    <div className="wallet-qr-from">
      <div>
        <span className="grey-text">
          {account?.name} {t("public_address")}:
        </span>
        <div className="public-address-actions">
          <div className="public-address">{account?.externalKey}</div>
          <CopyButton onClick={() => copy(account?.externalKey)} />
        </div>
      </div>
      <div className="qr">
        <QRCode size={208} value={account?.externalKey ?? ""} />
      </div>
    </div>
  );
};

export default WalletQr;
