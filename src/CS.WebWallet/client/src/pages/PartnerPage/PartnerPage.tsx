import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  $referral,
  fromReceived,
  historyNeedsReceived,
  referralPageUnmounted,
  toReceived,
} from "@store/partner";
import "./partnerPage.scss";
import { useStore } from "effector-react";
import ReferralHistoryCard from "@compv2/Grids/ReferralHistory";
import BannerAnchor from "@compv2/Banners";

const PartnerPage: React.FC = () => {
  const { t } = useTranslation();
  const { url, history } = useStore($referral);

  useEffect(() => {
    historyNeedsReceived();
    return () => referralPageUnmounted();
  }, []);

  const total = useMemo(() => {
    return history.length;
  }, [history]);

  const approved = useMemo(() => {
    return history.filter((f) => f.referralStatus === 1).length;
  }, [history]);

  const pending = useMemo(() => {
    return history.filter((f) => f.referralStatus === 0).length;
  }, [history]);

  const rejected = useMemo(() => {
    return history.filter((f) => f.referralStatus === 2).length;
  }, [history]);

  return (
    <div className="partner-page">
      <div className="page-title">{t("partner_page_title")}</div>
      <BannerAnchor placement={0} anchor="referrals" />
      <div className="reflink-container form-card">
        <div className="input-definition">
          <span>{t("your_link")}</span>
        </div>
        <div className="share-link">{url}</div>
        <div className="form-description">{t("partner_description")}</div>
      </div>

      <BannerAnchor placement={1} anchor="referrals" />
      <br />

      <div className="page-title">{t("History")}</div>
      <div className="history-filter">
        <span>{t("from")}</span>
        <input
          className="cs_input"
          type="date"
          onChange={(e) => fromReceived(e.target.value)}
        />
        <span>{t("to")}</span>
        <input
          className="cs_input"
          type="date"
          onChange={(e) => toReceived(e.target.value)}
        />
      </div>
      <div className="ref-stat">
        <div className="total">{`${t("ref_period_total")}: ${total}`}</div>
        <div className="approved">{`${t(
          "ref_period_approved"
        )}: ${approved}`}</div>
        <div className="pending">{`${t(
          "ref_period_pending"
        )}: ${pending}`}</div>
        <div className="rejected">{`${t(
          "ref_period_rejected"
        )}: ${rejected}`}</div>
      </div>
      <ReferralHistoryCard />
      <BannerAnchor placement={2} anchor="referrals" />
    </div>
  );
};

export default PartnerPage;
