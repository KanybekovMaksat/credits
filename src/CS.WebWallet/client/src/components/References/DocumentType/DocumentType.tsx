import React, { FC } from "react";
import { HistoryTypes } from "@services/HistoryService";
import { useTranslation } from "react-i18next";

interface DocumentTypeProps {
  value: number;
}

const DocumentType: FC<DocumentTypeProps> = ({ value }) => {
  const { t } = useTranslation();
  const typeText = (type: number) => {
    switch (type) {
      case HistoryTypes.Unknown:
        return "unknown";
      case HistoryTypes.Transfer:
        return "Transfer";
      case HistoryTypes.Withdraw:
        return "Withdraw";
      case HistoryTypes.TopUp:
        return "Top up";
      case HistoryTypes.Exchange:
        return "Exchange";
      case HistoryTypes.BuyCrypto:
        return "Buy Crypto";
      case HistoryTypes.BankTransfer:
        return "bank_transfer";
      case HistoryTypes.BankTransferCommission:
        return "bank_transfer_commission";
      case HistoryTypes.CardSpend:
        return "card_spend";
      case HistoryTypes.Deposit:
        return "deposit_interest";
      default:
        return "Unknown";
    }
  };

  return <div>{t(typeText(value))}</div>;
};

export default DocumentType;
