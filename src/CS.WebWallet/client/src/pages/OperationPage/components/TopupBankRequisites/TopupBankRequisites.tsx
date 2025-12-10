import React from "react";
import { useStore } from "effector-react";
import { useTranslation } from "react-i18next";
import { $data, getRequisites } from "@pages/OperationPage/OperationPage.store";
import { Col } from "@components/Layouts/RowLayout";

export interface TopupBankRequisitesProps {
  accountId?: string;
}

const TopupBankRequisites: React.FC<TopupBankRequisitesProps> = ({
  accountId,
}) => {
  const { t } = useTranslation();
  const { requisites } = useStore($data);

  React.useEffect(() => {
    if (!requisites && accountId) {
      getRequisites(accountId);
    }
  }, [requisites, accountId]);

  return (
    <>
      {requisites !== null && (
        <div className="details-fiat-modal">
          <Col className="bank-details-content">
            <Col className="bank-details-card">
              {requisites?.recipient !== undefined &&
              requisites.recipient !== "" ? (
                <>
                  <span>
                    <b>{t("Recipient")}:</b>
                  </span>
                  <span>{requisites?.recipient}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.iban !== undefined && requisites.iban !== "" ? (
                <>
                  <span>
                    <b>{t("IBAN")}:</b>
                  </span>
                  <span>{requisites?.iban}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.bic !== undefined && requisites.bic !== "" ? (
                <>
                  <span>
                    <b>{t("SWIFT_or_BIC")}:</b>
                  </span>
                  <span>{requisites?.bic}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.bankName !== undefined &&
              requisites.bankName !== "" ? (
                <>
                  <span>
                    <b>{t("bank_name")}:</b>
                  </span>
                  <span>{requisites?.bankName}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.bankAddress !== undefined &&
              requisites.bankAddress !== "" ? (
                <>
                  <span>
                    <b>{t("bank_address")}:</b>
                  </span>
                  <span>{requisites?.bankAddress}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.paymentPurpose !== undefined &&
              requisites.paymentPurpose !== "" ? (
                <>
                  <span>
                    <b>{t("payment_purpose")}:</b>
                  </span>
                  <span>{requisites?.paymentPurpose}</span>
                </>
              ) : (
                <></>
              )}
              {requisites?.info !== undefined && requisites.info !== "" ? (
                <>
                  <span>
                    <b>{t("info")}:</b>
                  </span>
                  <span>{requisites?.info}</span>
                </>
              ) : (
                <></>
              )}
            </Col>
          </Col>
        </div>
      )}
    </>
  );
};

export default TopupBankRequisites;
