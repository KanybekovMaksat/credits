import React, { useState } from "react";
import "./styles.scss";
import { Col, Row } from "@components/Layouts/RowLayout";
import { AccountRow } from "@services/AccountsService";
import closeIcon from "/icons/closeModal.svg";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { copyToClipboard } from "@helpers/clipboard";
import TopupBankRequisites from "@pages/OperationPage/components/TopupBankRequisites";

export interface DetailsModalProps {
  setModal: () => void;
  account: AccountRow | null;
}

const copyAddress = async (text: string, callback: any) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text ?? "");
  } else {
    copyToClipboard(text);
  }

  callback(true);
  setTimeout(() => callback(false), 800);
};

const CryptoDetails: React.FC<DetailsModalProps> = ({ account, setModal }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <Col className="details-modal">
      <div className="close-icon" onClick={() => setModal()}>
        <img src={closeIcon} alt="close" width={24} height={50} />
      </div>
      <>
        {copied && (
          <div className="copy-notification">{t("address_copied")}</div>
        )}
      </>
      <Col className="details-content">
        <Col style={{ width: "100%" }}>
          <span className="grey-text">
            {account?.name} {t("public_address")}:
          </span>
          <Row className="address">
            <span className="public-address">{account?.externalKey}</span>
            <div
              className="copy-button"
              onClick={() => copyAddress(account?.externalKey ?? "", setCopied)}
            />
          </Row>
        </Col>
        <span className="grey-text bottom">
          {t("this_account_to_receive", [account?.ticker])}
        </span>
      </Col>
      <Row className="qr-code">
        <QRCode size={208} value={account?.externalKey ?? ""} />
      </Row>
    </Col>
  );
};

const DetailsModal: React.FC<DetailsModalProps> = (
  props: DetailsModalProps
) => {
  const { account, setModal } = props;
  if (!account) {
    return <></>;
  }

  return (
    <div style={{ minWidth: "450px" }}>
      {account.isCrypto ? (
        <CryptoDetails account={account} setModal={setModal} />
      ) : (
        <TopupBankRequisites accountId={account.accountId} />
      )}
    </div>
  );
};

export default DetailsModal;
