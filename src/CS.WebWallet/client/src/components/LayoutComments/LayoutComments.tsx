import React, {FC} from "react";
import "./styles.scss";
import {Row} from "@components/Layouts/RowLayout";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useStore} from "effector-react";
import {$kyc} from "@store/kyc/kyc";
import {KycStatuses} from "@enums/kyc";

const LayoutComments: FC = () => {
  const {note, wizardNeeds, minimalStatus, email} = useStore($kyc);
  const {t} = useTranslation();
  const items = [];
  
  if (email === null || email.status !== KycStatuses.Approved.id)
    items.push(
      <Row key={"one"} className="layout-comment">
        <span>{t("email_not_verified")}.</span>
        <Link to="/settings">{t("start_now")}</Link>
      </Row>);

  if (wizardNeeds)
    items.push(
      <Row key={"two"} className="layout-comment">
        <span>{t("kyc_not_finished")}.</span>
        <Link to={`/kyc`}>{t("start_now")}</Link>
      </Row>);

  if (note && note !== "")
    items.push(
      <Row key={"three"} className="layout-comment">
        <span>{note}</span>
      </Row>);

  if (minimalStatus === KycStatuses.OnReview.id)
    items.push(
      <Row className="layout-comment pending">
        <span>{t("kyc_on_verification")}.</span>
      </Row>);

  if (items.length === 0) return <></>

  return (
    <div className="layout-comments-area">
      {items.map((e) => e)}
    </div>
  );
};
export default LayoutComments;
