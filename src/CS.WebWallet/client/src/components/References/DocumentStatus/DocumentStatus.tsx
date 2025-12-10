import React, { FC } from "react";
import "./styles.scss";
import { HistoryStatuses } from "@services/HistoryService";
import { useTranslation } from "react-i18next";

interface DocumentStatusProps {
  value: number;
}

const DocumentStatus: FC<DocumentStatusProps> = ({ value }) => {
  const { t } = useTranslation();
  const statusText = (status: number) => {
    switch (status) {
      case HistoryStatuses.Unknown:
        return "doc_status_undefined";
      case HistoryStatuses.Pending:
        return "doc_status_pending";
      case HistoryStatuses.Success:
        return "doc_status_success";
      case HistoryStatuses.Failed:
        return "doc_status_canceled";
      default:
        return "doc_status_undefined";
    }
  };

  const statusColor = (status: number) => {
    switch (status) {
      case HistoryStatuses.Unknown:
        return "gray";
      case HistoryStatuses.Pending:
        return "yellow";
      case HistoryStatuses.Success:
        return "green";
      case HistoryStatuses.Failed:
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className={`document_status ${statusColor(value)}`}>
      {t(statusText(value))}
    </div>
  );
};

export default DocumentStatus;
