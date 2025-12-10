import React from "react";
import { useTranslation } from "react-i18next";
import BannerAnchor from "@compv2/Banners";
import HistoryCard from "@components/HistoryCard";
import "./styles.scss";

const AllHistoryPage: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="profile-all-history-page">
      <div className="page-title">{t("All history")}</div>
      <BannerAnchor placement={0} anchor="history" />
      <span className="page-subtitle">
        {t("All transaction history in your account")}
      </span>
      <div className="card">
        <HistoryCard />
      </div>
      <BannerAnchor placement={2} anchor="history" />
    </section>
  );
};

export default AllHistoryPage;
