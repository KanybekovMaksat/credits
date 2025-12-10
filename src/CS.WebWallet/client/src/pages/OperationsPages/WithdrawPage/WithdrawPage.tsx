import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Col, Row } from "@components/Layouts/RowLayout";
import ForwardBlueArrow from "@components/Icons/ForwardBlueArrow";
import Divider from "@components/Divider";
import "./styles.scss";

const WithdrawPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="withdraw-page">
      <div className="page-title">{t("Withdraw")}</div>
      <Col className="withdraw">
        <Col width="100%">
          <Link to="/withdraw/prepaid">
            <Row className="first-row">
              <span className="title">{t("To Debit or Credit card")}</span>
              <ForwardBlueArrow />
            </Row>
          </Link>
          <span>{t("witdraw_card_execution_time")}</span>
        </Col>
        <Divider />
        <Col width="100%">
          <Link to="/withdraw/prepaidBank">
            <Row className="first-row">
              <span className="title">{t("To bank account")}</span>
              <ForwardBlueArrow />
            </Row>
          </Link>
          <span>{t("SEPA transfer")}</span>
          <span>{t("withdraw_bank_execution_time")}</span>
        </Col>
        <Divider />
        <Col width="100%">
          <Link to="/withdraw/prepaidSwift">
            <Row className="first-row">
              <span className="title">{t("To bank account via SWIFT")}</span>
              <ForwardBlueArrow />
            </Row>
          </Link>
          <span>{t("Swift transfer")}</span>
          <span>{t("withdraw_bank_execution_time")}</span>
        </Col>
      </Col>
    </section>
  );
};

export default WithdrawPage;
