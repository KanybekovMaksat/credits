import React from "react";
import { IssuedCardStatusEnum } from "@enums/cardStatus";
import { useTranslation } from "react-i18next";
import { ObjTextByValue } from "@enums/common";
import "./issuedCardStatus.scss";

interface IssuedCardStatusProps {
  status: number;
}

const IssuedCardStatus: React.FC<IssuedCardStatusProps> = ({
  status,
}: IssuedCardStatusProps) => {
  const { t } = useTranslation();

  const colorByStatus = () => {
    if (status === 0) {
      return "gray";
    }
    if (status === 1) {
      return "yellow";
    }
    if (status === 2) {
      return "green";
    }
    return "red";
  };

  return (
    <div className="issued-cards-status">
      <span className={colorByStatus()}>
        {t(ObjTextByValue(IssuedCardStatusEnum, status))}
      </span>
    </div>
  );
};

export default IssuedCardStatus;
